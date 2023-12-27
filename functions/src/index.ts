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
import { YoutubeTranscript } from 'youtube-transcript';


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

export const getTimestampTranscript = onRequest(async (request, response) => {
    corsHandler(request, response, async () => {

        const apiKey = request.headers['x-api-key'];

        if (apiKey !== configuredApiKey) {
            response.status(403).send('Forbidden');
            return;
        }

        const youtubeUrl: string = request.body.youtubeUrl ?? null;

        YoutubeTranscript.fetchTranscript(youtubeUrl)
            .then((result) => {
                response.send({ result });

            }).catch((error) => {
                logger.error('Error reading file:', error)
                response.status(500).send('Internal Server Error');
            })        
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


        try {

            const model = new ChatOpenAI({openAIApiKey, modelName, maxTokens: 200, temperature: 0.3});
            
            //UNDER CONSTRUCTION

            
            response.send('');

        } catch (error) {
            console.error('Error reading file:', error);
            response.status(500).send('Internal Server Error');
        }
    });
});