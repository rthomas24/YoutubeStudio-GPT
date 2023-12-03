import { createAction, props } from '@ngrx/store';
import { ChatCompletionResponse, YoutubeInfo, YoutubeTimestamps } from '../services/youtube.service';
import { GenerateDescription } from '../components/description-generator/description-generator.component';


export const getYoutubeInfo = createAction(
  '[Youtube] Get Youtube Info',
  props<{ youtubeUrl: string }>()
);
export const getYoutubeInfoSuccess = createAction(
  '[Youtube] Get Youtube Info Success',
  props<{ youtubeInfo: YoutubeInfo }>()
  );
export const getYoutubeInfoError = createAction(
  '[Youtube] Get Youtube Info Error',
  props<{ error: Error }>()
);

export const getYoutubeTimestamps = createAction(
  '[Youtube] Get Youtube Info',
  props<{ youtubeUrl: string }>()
);
export const getYoutubeTimestampsSuccess = createAction(
  '[Youtube] Get Youtube Info Success',
  props<{ timestamps: YoutubeTimestamps[] }>()
  );
export const getYoutubeTimestampsError = createAction(
  '[Youtube] Get Youtube Info Error',
  props<{ error: Error }>()
);

export const changeTabs = createAction(
  '[Youtube] Get Youtube Info',
  props<{ tab: string, tabType: string }>()
);

export const uploadedKey = createAction(
  '[Youtube] Uploaded API Key',
  props<{ key: boolean }>()
);

export const getAIYoutubeDescription = createAction(
  '[Youtube] Get Youtube AI Description',
  props<{ transcript: string, generateDescription: GenerateDescription }>()
);
export const getAIYoutubeDescriptionSuccess = createAction(
  '[Youtube] Get Youtube AI Description Success',
  props<{ description: ChatCompletionResponse }>()
  );
export const getAIYoutubeDescriptionError = createAction(
  '[Youtube] Get Youtube AI Description Error',
  props<{ error: Error }>()
);