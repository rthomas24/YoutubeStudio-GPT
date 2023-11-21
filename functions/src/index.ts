/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as cors from 'cors';
import { YoutubeLoader } from "langchain/document_loaders/web/youtube"

import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";

import { Document } from "langchain/document";
import { TokenTextSplitter } from "langchain/text_splitter";
import { loadSummarizationChain } from "langchain/chains";


const corsHandler = cors({ origin: true });
const openAIApiKey = process.env.OPENAI_KEY;
const configuredApiKey = process.env.API_KEY;


export const getYoutubeTranscript = onRequest(async (request, response) => {
    corsHandler(request, response, async () => {

        const apiKey = request.headers['x-api-key'];

        if (apiKey !== configuredApiKey) {
            response.status(403).send('Forbidden');
            return;
        }

        const youtubeUrl: string = request.body.youtubeUrl ?? null;

        try {

            if(!youtubeUrl.includes('youtube')) {
                logger.info('Not a youtube url link')

                response.status(403).send('Not a youtube url link');
            }

            const loader = YoutubeLoader.createFromUrl(youtubeUrl, {
                language: "en",
                addVideoInfo: true,
            });

            logger.info('Transcript aquired')

            const docs = await loader.load();

            response.send({ docs });

        } catch (error) {
            logger.error('Error reading file:', error)
            response.status(500).send('Internal Server Error');
        }
    });
});

export const getCustomDescription = onRequest(async (request, response) => {
    corsHandler(request, response, async () => {
        const apiKey = request.headers['x-api-key'];

        if (apiKey !== configuredApiKey) {
            response.status(403).send('Forbidden');
            return;
        }
        const transcript: string = request.body.transcript ?? 'what is my childs name';
        const modelName = request.body.model ?? 'gpt-3.5-turbo';
        // const cHistory = request.body.chatHistory ?? [];


        try {

            const model = new ChatOpenAI({openAIApiKey, modelName, maxTokens: 200, temperature: 0.3});
            
            const docs = [new Document({pageContent: transcript})]
            const splitter = new TokenTextSplitter({
                chunkSize: 750,
                chunkOverlap: 250,
            });

            const docsSummary = await splitter.splitDocuments(docs);

            const summaryTemplate = `
            You are an expert in creating detailed YouTube descriptions.
            Your goal is to create a description for a youtube video based on the transcript of the video.
            Below you find the transcript of a Youtube video:
            --------
            {text}
            --------

            The transcript of the Youtube video will also be used as the basis for a question and answer bot.
            Provide some examples questions and answers that could be asked about the Video. Make these questions very specific.

            Total output will be a summary of the video and a list of example questions the user could ask of the video.

            SUMMARY AND QUESTIONS:
            `;

            const SUMMARY_PROMPT = PromptTemplate.fromTemplate(summaryTemplate);

            const summaryRefineTemplate = `
            You are an expert in creating detailed YouTube descriptions.
            Your goal is to create a description for a youtube video based on the transcript of the video.
            We have provided an existing summary up to a certain point: {existing_answer}

            Below you find the transcript of a podcast:
            --------
            {text}
            --------

            Given the new context, refine the summary and example questions.
            The transcript of the youtube video will also be used as the basis for a question and answer bot.
            Provide some examples questions and answers that could be asked about the podcast. Make
            these questions very specific.
            If the context isn't useful, return the original summary and questions.
            Total output will be a summary of the video and a list of example questions the user could ask of the video.

            SUMMARY AND QUESTIONS:
            `;

            const SUMMARY_REFINE_PROMPT = PromptTemplate.fromTemplate(
            summaryRefineTemplate
            );

            const summarizeChain = loadSummarizationChain(model, {
                type: "refine",
                verbose: true,
                questionPrompt: SUMMARY_PROMPT,
                refinePrompt: SUMMARY_REFINE_PROMPT,
            });

            const summary = await summarizeChain.run(docsSummary);

            
            response.send({ summary });

        } catch (error) {
            console.error('Error reading file:', error);
            response.status(500).send('Internal Server Error');
        }
    });
});