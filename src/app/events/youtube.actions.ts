import { createAction, props } from '@ngrx/store'
import {
  ChatCompletionResponse,
  YoutubeInfo,
  YoutubeTimestamps,
} from '../services/youtube.service'
import { GenerateDescription } from '../components/description-generator/description-generator.component'
import { ChatHistory } from './youtube.reducer'

export const getYoutubeInfo = createAction(
  '[Youtube] Get Youtube Info',
  props<{ youtubeUrl: string }>()
)
export const getYoutubeInfoSuccess = createAction(
  '[Youtube] Get Youtube Info Success',
  props<{ youtubeInfo: YoutubeInfo }>()
)
export const getYoutubeInfoError = createAction(
  '[Youtube] Get Youtube Info Error',
  props<{ error: Error }>()
)

export const getYoutubeTimestamps = createAction(
  '[Youtube] Get Youtube Transcript Info',
  props<{ youtubeUrl: string }>()
)
export const getYoutubeTimestampsSuccess = createAction(
  '[Youtube] Get Youtube Transcript Info Success',
  props<{ timestamps: YoutubeTimestamps[] }>()
)
export const getYoutubeTimestampsError = createAction(
  '[Youtube] Get Youtube Transcript Info Error',
  props<{ error: Error }>()
)

export const changeTabs = createAction(
  '[Youtube] Change active tabs',
  props<{ tab: string; tabType: string }>()
)

export const uploadedKey = createAction(
  '[Youtube] Uploaded API Key',
  props<{ key: boolean }>()
)

export const getAIYoutubeDescription = createAction(
  '[Youtube] Get Youtube AI Description',
  props<{ transcript: string; generateDescription: GenerateDescription }>()
)
export const getAIYoutubeDescriptionSuccess = createAction(
  '[Youtube] Get Youtube AI Description Success',
  props<{ description: ChatCompletionResponse }>()
)
export const getAIYoutubeDescriptionError = createAction(
  '[Youtube] Get Youtube AI Description Error',
  props<{ error: Error }>()
)

export const sendNewChatMessage = createAction(
  '[Youtube] Chat with AI YT Video',
  props<{
    transcript: string
    chatHistory: ChatHistory[]
    userPrompt: string
  }>()
)
export const sendNewChatMessageSuccess = createAction(
  '[Youtube] Chat with AI YT Video Success',
  props<{ response: string }>()
)
export const sendNewChatMessageError = createAction(
  '[Youtube] Chat with AI YT Video Error',
  props<{ error: Error }>()
)

export const getAIKeyTerms = createAction(
  '[Youtube] Get AI Key Terms',
  props<{ transcript: string }>()
)

export const getAIKeyTermsSuccess = createAction(
  '[Youtube] Get AI Key Terms Success',
  props<{ keyWords: string[] }>()
)
export const getAIKeyTermsError = createAction(
  '[Youtube] Get AI Key Terms Error',
  props<{ error: Error }>()
)

export const getCustomInstructions = createAction(
  '[Youtube] Get AI Custom Instructions',
  props<{
    transcript: string
    tones: string[]
    category: string
    keyTerms: string[]
  }>()
)

export const getCustomInstructionsSuccess = createAction(
  '[Youtube] Get AI Custom Instructions Success',
  props<{ instructions: string }>()
)
export const getCustomInstructionsError = createAction(
  '[Youtube] Get AI Custom Instructions Error',
  props<{ error: Error }>()
)
