import { createReducer, on } from '@ngrx/store'
import {
  ChatCompletionResponse,
  YoutubeInfo,
  YoutubeTimestamps,
} from '../services/youtube.service'
import {
  changeTabs,
  getAIKeyTermsSuccess,
  getAIYoutubeDescription,
  getAIYoutubeDescriptionSuccess,
  getCustomInstructionsSuccess,
  getYoutubeInfoSuccess,
  getYoutubeTimestampsSuccess,
  sendNewChatMessage,
  sendNewChatMessageSuccess,
  uploadedKey,
} from './youtube.actions'

export const youtubeFeatureKey = 'youtube-info'

export interface YoutubeState {
  youtubeInfo: YoutubeInfo
  timestamps: YoutubeTimestamps[]
  activeTabs: any
  hasUploadedKey: boolean
  generatedDescriptions: ChatCompletionResponse[]
  currentlyGeneratingDescription: boolean
  currentlyLoadingResponse: boolean
  chatMessages: ChatHistory[]
  keyWords: string[]
  customInstructions: string
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
        // {
        //   label: 'Import API Key',
        //   icon: 'pi pi-fw pi-lock',
        //   key: 'key',
        //   group: 'left',
        // },
        {
          label: 'Video Transcript',
          icon: 'pi pi-fw pi-file',
          key: 'transcript',
          group: 'left',
        },
      ],
      activeTab: 'transcript',
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
  currentlyGeneratingDescription: false,
  currentlyLoadingResponse: false,
  chatMessages: [],
  keyWords: [],
  customInstructions: '',
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
  on(getAIYoutubeDescription, (state: YoutubeState): YoutubeState => {
    return {
      ...state,
      currentlyGeneratingDescription: true,
    }
  }),
  on(getAIYoutubeDescriptionSuccess, (state: YoutubeState, { description }) => {
    return {
      ...state,
      generatedDescriptions: [...state.generatedDescriptions, description],
      currentlyGeneratingDescription: false,
    }
  }),
  on(sendNewChatMessage, (state: YoutubeState, { userPrompt }) => {
    const newMessage: ChatHistory = {
      human: userPrompt,
      ai: '',
    }
    return {
      ...state,
      chatMessages: [...state.chatMessages, newMessage],
      currentlyLoadingResponse: true,
    }
  }),
  on(sendNewChatMessageSuccess, (state: YoutubeState, { response }) => {
    let updatedChatHistory = [...state.chatMessages]
    let lastChatEntry = { ...updatedChatHistory[updatedChatHistory.length - 1] } // Deep copy
    if (lastChatEntry && lastChatEntry.ai === '') {
      lastChatEntry.ai = response
      updatedChatHistory[updatedChatHistory.length - 1] = lastChatEntry
    }
    return {
      ...state,
      chatMessages: updatedChatHistory,
      currentlyLoadingResponse: false,
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
  }),
  on(
    getAIKeyTermsSuccess,
    (state: YoutubeState, { keyWords }): YoutubeState => {
      return {
        ...state,
        keyWords,
      }
    }
  ),
  on(
    getCustomInstructionsSuccess,
    (state: YoutubeState, { instructions }): YoutubeState => {
      return {
        ...state,
        customInstructions: instructions,
      }
    }
  )
)

export type ChatHistory = {
  human: string
  ai: string
}
