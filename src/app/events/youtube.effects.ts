import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { of } from 'rxjs'
import { switchMap, catchError, map } from 'rxjs/operators'
import {
  ChatCompletionResponse,
  YoutubeService,
} from '../services/youtube.service'
import {
  getAIKeyTerms,
  getAIKeyTermsError,
  getAIKeyTermsSuccess,
  getAIYoutubeDescription,
  getAIYoutubeDescriptionError,
  getAIYoutubeDescriptionSuccess,
  getYoutubeInfo,
  getYoutubeInfoError,
  getYoutubeInfoSuccess,
  getYoutubeTimestamps,
  getYoutubeTimestampsError,
  getYoutubeTimestampsSuccess,
  sendNewChatMessage,
  sendNewChatMessageError,
  sendNewChatMessageSuccess,
} from './youtube.actions'

@Injectable()
export class YoutubeEffects {
  constructor(
    private actions$: Actions,
    private youtubeService: YoutubeService
  ) {}

  youtubeInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getYoutubeInfo),
      switchMap(({ youtubeUrl }) =>
        this.youtubeService.getYoutubeUrl(youtubeUrl).pipe(
          map(youtubeInfo => getYoutubeInfoSuccess({ youtubeInfo })),
          catchError(error => of(getYoutubeInfoError({ error })))
        )
      )
    )
  )

  youtubeTimestamps$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getYoutubeTimestamps),
      switchMap(({ youtubeUrl }) =>
        this.youtubeService.getYoutubeTimestampTranscript(youtubeUrl).pipe(
          map(timestamps => getYoutubeTimestampsSuccess({ timestamps })),
          catchError(error => of(getYoutubeTimestampsError({ error })))
        )
      )
    )
  )

  chatWithYTVideo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sendNewChatMessage),
      switchMap(({ transcript, chatHistory, userPrompt }) =>
        this.youtubeService
          .chatWithYTVideo(transcript, userPrompt, chatHistory)
          .pipe(
            map(response => sendNewChatMessageSuccess({ response })),
            catchError(error => of(sendNewChatMessageError({ error })))
          )
      )
    )
  )

  youtubeAiDescription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getAIYoutubeDescription),
      switchMap(({ transcript, generateDescription }) =>
        this.youtubeService
          .getYoutubeDescription(transcript, generateDescription)
          .pipe(
            map((description: ChatCompletionResponse) =>
              getAIYoutubeDescriptionSuccess({ description })
            ),
            catchError(error => of(getAIYoutubeDescriptionError({ error })))
          )
      )
    )
  )

  youtubeAIKeyTerms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getAIKeyTerms),
      switchMap(({ transcript }) =>
        this.youtubeService.getYoutubeKeyTerms(transcript).pipe(
          map((keyWords: string[]) => getAIKeyTermsSuccess({ keyWords })),
          catchError(error => of(getAIKeyTermsError({ error })))
        )
      )
    )
  )
}
