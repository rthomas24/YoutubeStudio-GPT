import { createReducer, on } from '@ngrx/store';
import { ChatCompletionResponse, YoutubeInfo, YoutubeTimestamps } from '../services/youtube.service';
import { changeTabs, getAIYoutubeDescriptionSuccess, getYoutubeInfoSuccess, getYoutubeTimestampsSuccess, uploadedKey } from './youtube.actions';

export const youtubeFeatureKey = 'youtube-info'

export interface YoutubeState {
    youtubeInfo: YoutubeInfo,
    timestamps: YoutubeTimestamps[],
    activeTabs: any,
    hasUploadedKey: boolean,
    generatedDescriptions: ChatCompletionResponse[]
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
    activeTabs: [
      {
        left: 'transcript'
      },
      {
        right: 'description'
      }
    ],
    hasUploadedKey: false,
    generatedDescriptions: []
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
  }),
  on(getAIYoutubeDescriptionSuccess, (state: YoutubeState , { description }) =>
  {
    return {
        ...state,
        generatedDescriptions: [...state.generatedDescriptions, description]
    }
  }),
  on(changeTabs, (state: YoutubeState, { tab, tabType }) => {
    let updatedActiveTabs = state.activeTabs.map((tabItem: any) => {
      if (tabItem.hasOwnProperty(tabType)) {
        return { [tabType]: tab };
      }
      return tabItem;
    });
  
    return {
      ...state,
      activeTabs: updatedActiveTabs
    };
  })
);
