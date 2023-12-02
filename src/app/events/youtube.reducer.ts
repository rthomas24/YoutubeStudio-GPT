import { createReducer, on } from '@ngrx/store';
import { YoutubeInfo, YoutubeTimestamps } from '../services/youtube.service';
import { getYoutubeInfoSuccess, getYoutubeTimestampsSuccess, uploadedKey } from './youtube.actions';

export const youtubeFeatureKey = 'youtube-info'

export interface YoutubeState {
    youtubeInfo: YoutubeInfo,
    timestamps: YoutubeTimestamps[],
    activeTabs: string[],
    hasUploadedKey: boolean
}

const initialState: YoutubeState = {
    youtubeInfo: {
      transcript: '',
      description: '',
      title: '',
      viewCount: 0,
      author: ''
    },
    timestamps: [],
    activeTabs: ['transcript', 'description'],
    hasUploadedKey: false
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
    // console.log(JSON.stringify(timestamps, null, '\t'))
    return {
        ...state,
        timestamps
    }
  }),
  on(uploadedKey, (state: YoutubeState , { key }) =>
  {
    return {
        ...state,
        hasUploadedKey: key
    }
  })
);
