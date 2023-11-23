import { createAction, props } from '@ngrx/store';
import { YoutubeInfo, YoutubeTimestamps } from '../services/youtube.service';


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