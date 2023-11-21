import { createAction, props } from '@ngrx/store';
import { YoutubeInfo } from '../services/youtube.service';


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