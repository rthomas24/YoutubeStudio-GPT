import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { ChatCompletionResponse, YoutubeService } from '../services/youtube.service';
import { getAIYoutubeDescription, getAIYoutubeDescriptionError, getAIYoutubeDescriptionSuccess, getYoutubeInfo, getYoutubeInfoError, getYoutubeInfoSuccess, getYoutubeTimestamps, getYoutubeTimestampsError, getYoutubeTimestampsSuccess } from './youtube.actions';

@Injectable()
export class YoutubeEffects {
    constructor(
        private actions$: Actions,
        private youtubeService: YoutubeService
      ) {}


  youtubeInfo$ = createEffect(() => this.actions$.pipe(
    ofType(getYoutubeInfo),
    switchMap(({youtubeUrl}) => this.youtubeService.getYoutubeUrl(youtubeUrl).pipe(
      map(youtubeInfo => getYoutubeInfoSuccess({youtubeInfo})),
      catchError(error => of(getYoutubeInfoError({error})))
    ))
  ));

  youtubeTimestamps$ = createEffect(() => this.actions$.pipe(
    ofType(getYoutubeTimestamps),
    switchMap(({youtubeUrl}) => this.youtubeService.getYoutubeTimestampTranscript(youtubeUrl).pipe(
      map(timestamps => getYoutubeTimestampsSuccess({timestamps})),
      catchError(error => of(getYoutubeTimestampsError({error})))
    ))
  ));


  youtubeAiDescription$ = createEffect(() => this.actions$.pipe(
    ofType(getAIYoutubeDescription),
    switchMap(({transcript, generateDescription}) => this.youtubeService.getYoutubeDescription(transcript, generateDescription).pipe(
      map((description: ChatCompletionResponse) => getAIYoutubeDescriptionSuccess({description})),
      catchError(error => of(getAIYoutubeDescriptionError({error})))
    ))
  ));


}
