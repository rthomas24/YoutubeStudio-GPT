import { createFeatureSelector, createSelector } from '@ngrx/store';
import { YoutubeState, youtubeFeatureKey } from './youtube.reducer';

const YoutubeDataState = createFeatureSelector<YoutubeState>(youtubeFeatureKey);

export const selectYoutubeInfo = createSelector(
    YoutubeDataState,
    (state: YoutubeState) => state.youtubeInfo
);