import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import OpenAI from 'openai'

import { YoutubeLoader } from 'langchain/document_loaders/web/youtube'
import { YoutubeTranscript } from 'youtube-transcript'
import { ChatOpenAI } from '@langchain/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { loadSummarizationChain } from 'langchain/chains'
import { HNSWLib } from 'langchain/vectorstores/hnswlib'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { PromptTemplate } from 'langchain/prompts'
import { RunnableSequence } from 'langchain/schema/runnable'
import { StringOutputParser } from 'langchain/schema/output_parser'
import { formatDocumentsAsString } from 'langchain/util/document'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

const openAIApiKey = process.env.OPENAI_KEY

app.post('/getyoutubetranscript', async (req, res) => {
  try {
    const youtubeUrl = req.body.youtubeUrl ?? null

    if (!youtubeUrl.includes('youtube')) {
      res.status(403).send('Not a youtube url link')
    }

    const loader = YoutubeLoader.createFromUrl(youtubeUrl, {
      language: 'en',
      addVideoInfo: true,
    })

    const docs = await loader.load()

    res.send({ docs })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).send('An error occurred')
  }
})

app.post('/gettimestamptranscript', async (req, res) => {
  try {
    const youtubeUrl = req.body.youtubeUrl ?? null

    YoutubeTranscript.fetchTranscript(youtubeUrl)
      .then(result => {
        res.send({ result })
      })
      .catch(error => {
        logger.error('Error reading file:', error)
        res.status(500).send('Internal Server Error')
      })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).send('An error occurred')
  }
})

app.post('/getcustomdescription', async (req, res) => {
  const transcript = req.body.transcript ?? ''
  const descriptionOptions = req.body.descriptionOptions ?? {}
  const modelName = 'gpt-3.5-turbo-0125'

  try {
    const openaiModel = new OpenAI({ apiKey: openAIApiKey })
    const langChainModel = new ChatOpenAI({
      openAIApiKey,
      modelName,
      temperature: 0,
    })

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    })
    const docs = await textSplitter.createDocuments([transcript])

    const chain = loadSummarizationChain(langChainModel, {
      type: 'stuff',
    })

    let transcriptSummary
    if (!descriptionOptions.fullTranscript) {
      transcriptSummary = await chain.call({
        input_documents: docs,
      })
    }

    const completion = await openaiModel.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: ` You are specialized in crafting YouTube video descriptions. 
                      Your task is to create a compelling and informative description for a YouTube video, guided by the details the user specifies.
                  
                      Ensure that the description reflects the video's content accurately, incorporates the specified keywords naturally, adheres to the user's custom instructions, and matches the desired tone and word count. 
                      This tailored approach aims to meet the specific needs and preferences of the user for their YouTube video description.            
                `,
        },
        {
          role: 'user',
          content: `Create a YouTube video description, the category of the video is ${
            descriptionOptions.category
          }. 
                You should use the following keywords in the generated description natrually: ${descriptionOptions.keyWords.join(
                  ', '
                )}.
                The desired Word Count is approximately ${
                  descriptionOptions.wordCount
                } words. Your tone of voice for the description should be
                ${descriptionOptions.tones.join(
                  ', and'
                )}. This is the custom instructions on what to add to the description: ${
                  descriptionOptions.instructions
                }. 
                  And the following is a summary description of the video that you are to make the description for, use this summary of the transcript for your knowledge to fill 
                  out the description: ${
                    descriptionOptions.fullTranscript
                      ? transcript
                      : transcriptSummary.text
                  }`,
        },
      ],
      model: modelName,
      temperature: 0.7,
    })

    res.send({ summary: completion })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).send('An error occurred')
  }
})

app.post('/chatwithytvideo', async (req, res) => {
  const transcript = req.body.transcript ?? ''
  //add var for title
  const modelName = req.body.model ?? 'gpt-3.5-turbo-0125'
  const chatHistory = req.body.chatHistory ?? []
  const userPrompt = req.body.userPrompt ?? []

  try {
    const langChainModel = new ChatOpenAI({
      openAIApiKey,
      modelName,
      maxTokens: 125,
      temperature: 0,
    })

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    })
    const docs = await textSplitter.createDocuments([transcript])

    const vectorStore = await HNSWLib.fromDocuments(
      docs,
      new OpenAIEmbeddings({ openAIApiKey })
    )
    const retriever = vectorStore.asRetriever()

    const formatChatHistoryAsString = chatHistory => {
      return chatHistory
        .map(
          interaction => `Human: ${interaction.human}\nAI: ${interaction.ai}`
        )
        .join('\n\n')
    }

    const questionPrompt = PromptTemplate.fromTemplate(
      `You are a Youtube Video AI Assistant. The context you are given is the transcript of the video
              you are answering questions about. Use the transcript information to answer the question with relevant
              information, if you dont know the answer just say "I am not sure".
              ----------------
              CONTEXT: {context}
              ----------------
              CHAT HISTORY: {chatHistory}
              ----------------
              QUESTION: {question}
              ----------------
              Helpful Answer:`
    )

    // Create a sequence of operations to be performed in order to generate the answer
    const chain = RunnableSequence.from([
      {
        // The first operation is to extract the question from the input
        question: input => input.question,
        // The second operation is to format the chat history as a string
        chatHistory: input =>
          formatChatHistoryAsString(input.chatHistory || []) ?? '',
        // The third operation is to retrieve relevant documents based on the question and format them as a string
        context: async input => {
          const relevantDocs = await retriever.getRelevantDocuments(
            input.question
          )
          const serialized = formatDocumentsAsString(relevantDocs)
          return serialized
        },
      },
      // The fourth operation is to generate the question prompt
      questionPrompt,
      // The fifth operation is to use the model to generate the answer
      langChainModel,
      // The final operation is to parse the output into a string
      new StringOutputParser(),
    ])

    const answer = await chain.invoke({
      chatHistory: chatHistory,
      question: userPrompt,
    })

    res.send({ summary: answer })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).send('An error occurred')
  }
})
