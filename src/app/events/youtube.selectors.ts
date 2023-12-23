import { createFeatureSelector, createSelector } from '@ngrx/store'
import { YoutubeState, youtubeFeatureKey } from './youtube.reducer'

const YoutubeDataState = createFeatureSelector<YoutubeState>(youtubeFeatureKey)

export const selectYoutubeInfo = createSelector(
  YoutubeDataState,
  (state: YoutubeState) => state.youtubeInfo
)
export const selectYoutubeTimestamps = createSelector(
  YoutubeDataState,
  (state: YoutubeState) => state.timestamps
)

export const selectActiveTabs = createSelector(
  YoutubeDataState,
  (state: YoutubeState) => state.activeTabs
)

export const selectUploadedKeyStatus = createSelector(
  YoutubeDataState,
  (state: YoutubeState) => state.hasUploadedKey
)

export const selectGeneratedDescriptions = createSelector(
  YoutubeDataState,
  (state: YoutubeState) => state.generatedDescriptions
)
