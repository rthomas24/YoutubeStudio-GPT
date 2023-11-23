import { createReducer, on } from '@ngrx/store';
import { YoutubeInfo, YoutubeTimestamps } from '../services/youtube.service';
import { getYoutubeInfoSuccess, getYoutubeTimestampsSuccess } from './youtube.actions';

export const youtubeFeatureKey = 'youtube-info'

export interface YoutubeState {
    youtubeInfo: YoutubeInfo,
    timestamps: YoutubeTimestamps[]
}

const initialState: YoutubeState = {
    youtubeInfo: {
      transcript: '',
      description: '',
      title: '',
      viewCount: 0,
      author: ''
    },
    timestamps: []
};

export const YoutubeReducer = createReducer(
  initialState,
  on(getYoutubeInfoSuccess, (state: YoutubeState , { youtubeInfo }) =>
  {
    return {
        ...state,
        youtubeInfo: youtubeInfo
    }
  }),
  on(getYoutubeTimestampsSuccess, (state: YoutubeState , { timestamps }) =>
  {
    return {
        ...state,
        timestamps
    }
  })
);
