/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from 'firebase-functions/v2/https'
import * as logger from 'firebase-functions/logger'
import * as cors from 'cors'
import { YoutubeLoader } from 'langchain/document_loaders/web/youtube'

import { ChatOpenAI } from 'langchain/chat_models/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { loadSummarizationChain } from 'langchain/chains'
import { YoutubeTranscript } from 'youtube-transcript'
import * as admin from 'firebase-admin'
import OpenAI from 'openai'
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PromptTemplate } from "langchain/prompts";
import {
  RunnableSequence,
} from "langchain/schema/runnable";
import { StringOutputParser } from "langchain/schema/output_parser";
import { formatDocumentsAsString } from "langchain/util/document";

const corsHandler = cors({ origin: true })
const openAIApiKey = process.env.OPENAI_KEY
const configuredApiKey = process.env.API_KEY
admin.initializeApp()

export const getYoutubeTranscript = onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    const apiKey = request.headers['x-api-key']

    if (apiKey !== configuredApiKey) {
      response.status(403).send('Forbidden')
      return
    }

    const youtubeUrl: string = request.body.youtubeUrl ?? null

    try {
      if (!youtubeUrl.includes('youtube')) {
        logger.info('Not a youtube url link')

        response.status(403).send('Not a youtube url link')
      }

      const loader = YoutubeLoader.createFromUrl(youtubeUrl, {
        language: 'en',
        addVideoInfo: true,
      })

      logger.info('Transcript aquired')

      const docs = await loader.load()

      response.send({ docs })
    } catch (error) {
      logger.error('Error reading file:', error)
      response.status(500).send('Internal Server Error')
    }
  })
})

export const getTimestampTranscript = onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    const apiKey = request.headers['x-api-key']

    if (apiKey !== configuredApiKey) {
      response.status(403).send('Forbidden')
      return
    }

    const youtubeUrl: string = request.body.youtubeUrl ?? null

    YoutubeTranscript.fetchTranscript(youtubeUrl)
      .then(result => {
        response.send({ result })
      })
      .catch(error => {
        logger.error('Error reading file:', error)
        response.status(500).send('Internal Server Error')
      })
  })
})

interface GenerateDescription {
  tones: string[]
  wordCount: number
  keyWords: string[]
  phrases: string[]
}

export const getCustomDescription = onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    const apiKey = request.headers['x-api-key']

    if (apiKey !== configuredApiKey) {
      response.status(403).send('Forbidden')
      return
    }
    const transcript: string =
      request.body.transcript ?? ''
    const descriptionOptions: GenerateDescription =
      request.body.descriptionOptions ?? {}
    const modelName = request.body.model ?? 'gpt-3.5-turbo'

    const openaiModel = new OpenAI({ apiKey: openAIApiKey })
    const langChainModel = new ChatOpenAI({
      openAIApiKey,
      modelName,
      maxTokens: descriptionOptions.wordCount,
      temperature: 0,
    })

    try {
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
      })
      const docs = await textSplitter.createDocuments([transcript])

      const chain = loadSummarizationChain(langChainModel, {
        type: 'map_reduce',
      })
      const res = await chain.call({
        input_documents: docs,
      })

      const completion = await openaiModel.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are an expert in creating detailed YouTube descriptions. 
                                Your goal is to create a description for a youtube video based on the transcript of the video.
                                The following text is a detailed summary of the transcript: 
                                
                                [Summary: ${res}]
                                
                                - Include these specific keywords: ${descriptionOptions.keyWords}
                                - Include these specific phrases: ${descriptionOptions.phrases}
                                - Ensure the response has approximately ${descriptionOptions.wordCount} words.
                                - The tone should be ${descriptionOptions.tones}.

                                These modifications are user-defined and are intended to tailor the response to their specific requirements.
                                `,
          },
          {
            role: 'user',
            content:
              'Please create a YouTube video description incorporating the details of my video and the specific elements Ive requested.',
          },
        ],
        model: 'gpt-3.5-turbo-1106',
        frequency_penalty: 1.75,
        presence_penalty: 1.75,
        temperature: 0.2,
      })

      response.send({ summary: completion })
    } catch (error) {
      console.error('Error reading file:', error)
      response.status(500).send('Internal Server Error')
    }
  })
})


export const chatWithYTVideo = onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    const apiKey = request.headers['x-api-key']

    if (apiKey !== configuredApiKey) {
      response.status(403).send('Forbidden')
      return
    }
    const transcript: string =
      request.body.transcript ?? ''
    const modelName = request.body.model ?? 'gpt-3.5-turbo'
    const chatHistory = request.body.chatHistory ?? []
    const userPrompt = request.body.userPrompt ?? []

    const langChainModel = new ChatOpenAI({
      openAIApiKey,
      modelName,
      maxTokens: 125,
      temperature: 0,
    })

    try {

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
      })
      const docs = await textSplitter.createDocuments([transcript])

      const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings({openAIApiKey}));
      const retriever = vectorStore.asRetriever();
     

      const formatChatHistoryAsString = (chatHistory: Array<{ human: string; ai: string }>) => {
          return chatHistory.map(interaction => `Human: ${interaction.human}\nAI: ${interaction.ai}`).join('\n\n');
      };
      
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
      );

      // Create a sequence of operations to be performed in order to generate the answer
      const chain = RunnableSequence.from([
      {
          // The first operation is to extract the question from the input
          question: (input: { question: string; chatHistory?: Array<{ human: string; ai: string }> }) =>
            input.question,
          // The second operation is to format the chat history as a string
          chatHistory: (input: { question: string; chatHistory?: Array<{ human: string; ai: string }> }) =>
            formatChatHistoryAsString(input.chatHistory || []) ?? "",
          // The third operation is to retrieve relevant documents based on the question and format them as a string
          context: async (input: { question: string; chatHistory?: Array<{ human: string; ai: string }> }) => {
            const relevantDocs = await retriever.getRelevantDocuments(input.question);
            const serialized = formatDocumentsAsString(relevantDocs);
            return serialized;
          },
      },
          // The fourth operation is to generate the question prompt
          questionPrompt,
          // The fifth operation is to use the model to generate the answer
          langChainModel,
          // The final operation is to parse the output into a string
          new StringOutputParser(),
      ]);
                  
      const answer = await chain.invoke({
          chatHistory: chatHistory,
          question: userPrompt
      });
      
        response.send({ summary: answer })
    } catch (error) {
      console.error('Error reading file:', error)
      response.status(500).send('Internal Server Error')
    }
  })
})
