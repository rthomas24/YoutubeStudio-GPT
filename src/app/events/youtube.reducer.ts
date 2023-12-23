import { createReducer, on } from '@ngrx/store'
import {
  ChatCompletionResponse,
  YoutubeInfo,
  YoutubeTimestamps,
} from '../services/youtube.service'
import {
  changeTabs,
  getAIYoutubeDescriptionSuccess,
  getYoutubeInfoSuccess,
  getYoutubeTimestampsSuccess,
  uploadedKey,
} from './youtube.actions'

export const youtubeFeatureKey = 'youtube-info'

export interface YoutubeState {
  youtubeInfo: YoutubeInfo
  timestamps: YoutubeTimestamps[]
  activeTabs: any
  hasUploadedKey: boolean
  generatedDescriptions: ChatCompletionResponse[]
}

const initialState: YoutubeState = {
  youtubeInfo: {
    transcript: '',
    description: '',
    title: '',
    viewCount: 0,
    author: '',
  },
  timestamps: [],
  activeTabs: [
    {
      left: [
        {
          label: 'Import API Key',
          icon: 'pi pi-fw pi-lock',
          key: 'key',
          group: 'left',
        },
        {
          label: 'Video Transcript',
          icon: 'pi pi-fw pi-file',
          key: 'transcript',
          group: 'left',
        },
      ],
      activeTab: 'key',
    },
    {
      right: [
        {
          label: 'Description AI',
          icon: 'pi pi-fw pi-youtube',
          key: 'description',
          group: 'right',
        },
        {
          label: 'Chat Bot',
          icon: 'pi pi-fw pi-comment',
          key: 'chat',
          group: 'right',
        },
      ],
      activeTab: 'description',
    },
  ],
  hasUploadedKey: false,
  generatedDescriptions: [],
}

export const YoutubeReducer = createReducer(
  initialState,
  on(getYoutubeInfoSuccess, (state: YoutubeState, { youtubeInfo }) => {
    return {
      ...state,
      youtubeInfo: youtubeInfo,
    }
  }),
  on(getYoutubeTimestampsSuccess, (state: YoutubeState, { timestamps }) => {
    // console.log(JSON.stringify(timestamps, null, '\t'))
    return {
      ...state,
      timestamps,
    }
  }),
  on(uploadedKey, (state: YoutubeState, { key }) => {
    return {
      ...state,
      hasUploadedKey: key,
    }
  }),
  on(getAIYoutubeDescriptionSuccess, (state: YoutubeState, { description }) => {
    return {
      ...state,
      generatedDescriptions: [...state.generatedDescriptions, description],
    }
  }),
  on(changeTabs, (state: YoutubeState, { tab, tabType }): YoutubeState => {
    let updatedActiveTabs = state.activeTabs.map((tabItem: any) => {
      if (tabItem.hasOwnProperty(tabType)) {
        const tabExists = tabItem[tabType].some((item: any) => item.key === tab)
        if (tabExists) {
          return {
            ...tabItem,
            [tabType]: [...tabItem[tabType]],
            activeTab: tab,
          }
        }
      }
      return tabItem
    })

    return {
      ...state,
      activeTabs: updatedActiveTabs,
    }
  })
)
