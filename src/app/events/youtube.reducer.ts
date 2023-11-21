import { createReducer, on } from '@ngrx/store';
import { YoutubeInfo } from '../services/youtube.service';
import { getYoutubeInfoSuccess } from './youtube.actions';

export const youtubeFeatureKey = 'youtube-info'

export interface YoutubeState {
    youtubeInfo: YoutubeInfo
}

const initialState: YoutubeState = {
    youtubeInfo: {
      transcript: '',
      description: '',
      title: '',
      viewCount: 0,
      author: ''
    }
};

export const YoutubeReducer = createReducer(
  initialState,
  on(getYoutubeInfoSuccess, (state: YoutubeState , { youtubeInfo }) =>
  {
    return {
        ...state,
        youtubeInfo: youtubeInfo
    }
  })
);
