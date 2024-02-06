import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import OpenAI from 'openai'

import { YoutubeLoader } from 'langchain/document_loaders/web/youtube'
import { YoutubeTranscript } from 'youtube-transcript'
import { ChatOpenAI } from '@langchain/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { loadSummarizationChain } from 'langchain/chains'
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib'
import { OpenAIEmbeddings } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { formatDocumentsAsString } from 'langchain/util/document'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { JsonOutputToolsParser } from 'langchain/output_parsers'
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

const openAIApiKey = process.env.OPENAI_KEY
const googleGeminiApiKey = process.env.GEMINI_API_KEY

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

    res.status(200).send({ docs })
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
        res.status(200).send({ result })
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
                  ', and '
                )}.
                The desired Word Count is approximately ${
                  descriptionOptions.wordCount
                } words. Your tone of voice for the description should be
                ${descriptionOptions.tones.join(
                  ', and '
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

    res.status(200).send({ summary: completion })
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

    //Uncomment this if you want to use openAI instead of Google
    // const langChainModelOpenAI = new ChatOpenAI({
    //   openAIApiKey,
    //   modelName,
    //   maxTokens: 125,
    //   temperature: 0.2,
    // })

    const langChainModelGoogle = new ChatGoogleGenerativeAI({
        apiKey: googleGeminiApiKey,
        modelName: "gemini-pro",
        maxOutputTokens: 125,
        temperature: 0.2
    });
    

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
      langChainModelGoogle,
      // The final operation is to parse the output into a string
      new StringOutputParser(),
    ])

    const answer = await chain.invoke({
      chatHistory: chatHistory,
      question: userPrompt,
    })

    res.status(200).send({ summary: answer })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).send('An error occurred')
  }
})

app.post('/getKeyWords', async (req, res) => {
  const transcript = req.body.transcript ?? ''

  const EXTRACTION_TEMPLATE = `Given the importance of focusing on the most relevant and impactful keywords for a YouTube video description, your task is to extract these keywords with an emphasis on precision and relevance. It's essential to identify keywords that truly resonate with the video's content, avoiding generic or overly broad terms. The goal is to select keywords that are directly tied to the video's main themes and messages, ensuring they are not only accurate but also significantly enhance the video's discoverability and alignment with the intended audience's interests.`

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', EXTRACTION_TEMPLATE],
    ['human', '{input}'],
  ])

  const getKeyWordsSchema = z.object({
    keyWords: z
      .array(
        z
          .string()
          .max(3, 'Each keyword should be a concise term, up to 3 words')
          .nonempty('Keywords must be meaningful and cannot be empty')
      )
      .min(
        3,
        'A minimum of 3 keywords is required to capture the essence of the video'
      )
      .max(5, 'Limit to 5 keywords to maintain focus and relevance')
      .describe(
        "Select keywords that are closely related to the video's content, ensuring they are specific and relevant"
      ),
  })

  try {
    const model = new ChatOpenAI({
      openAIApiKey,
      modelName: 'gpt-3.5-turbo-0125',
      temperature: 0.7,
    }).bind({
      tools: [
        {
          type: 'function',
          function: {
            name: 'getKeyWordsSchema',
            description:
              'Extract highly relevant keywords from a transcript for generating a YouTube video description',
            parameters: zodToJsonSchema(getKeyWordsSchema),
          },
        },
      ],
    })

    const parser = new JsonOutputToolsParser()
    const chain = prompt.pipe(model).pipe(parser)

    const response = await chain.invoke({
      input: `Transcript: ${transcript}. Identify the most specific and relevant keywords that accurately reflect the video's main themes and messages, focusing on precision and relevance.`,
    })

    res.status(200).send(response[0].args.keyWords)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).send('An error occurred')
  }
})

app.post('/custominstructions', async (req, res) => {
  const transcript = req.body.transcript ?? ''
  const category = req.body.category ?? ''
  const tones = req.body.tones ?? []
  const keyTerms = req.body.keyTerms ?? []

  const EXTRACTION_TEMPLATE = `Your task is to create custom instructions for generating a YouTube video description. These instructions should guide the language model to focus on precision and relevance, ensuring the inclusion of keywords that are most impactful and directly tied to the video's main themes and messages. The aim is to craft a description that enhances the video's discoverability while accurately reflecting its content and resonating with the intended audience. Avoid generic or overly broad terms to maintain specificity and relevance.`
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', EXTRACTION_TEMPLATE],
    ['human', '{input}'],
  ])

  const createCustomInstructionsSchema = z.object({
    customInstructions: z
      .array(
        z.object({
          instructionNumber: z.number(),
          instruction: z.string().nonempty('Instruction cannot be empty'),
        })
      )
      .min(1, 'At least one instruction is required'),
  })

  try {
    const model = new ChatOpenAI({
      openAIApiKey,
      modelName: 'gpt-3.5-turbo-0125',
      temperature: 0.7,
    }).bind({
      tools: [
        {
          type: 'function',
          function: {
            name: 'createCustomInstructions',
            description:
              'Generate concise and detailed instructions for creating a YouTube video description based on the transcript, tone, category, and key terms',
            parameters: zodToJsonSchema(createCustomInstructionsSchema),
          },
        },
      ],
    })

    const parser = new JsonOutputToolsParser()
    const chain = prompt.pipe(model).pipe(parser)

    const response = await chain.invoke({
      input: `Transcript: ${transcript}. Tone: ${tones.join(
        ', '
      )}. Category: ${category}. Key Terms: ${keyTerms.join(
        ', '
      )}. Create concise and detailed instructions for a YouTube video description.`,
    })

    const formattedResponse = response
      .map(item =>
        item.args.customInstructions
          .map(
            instruction =>
              `${instruction.instructionNumber}. ${instruction.instruction}`
          )
          .join('\n')
      )
      .join('\n')

    res.status(200).send(formattedResponse)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).send('An error occurred')
  }
})
