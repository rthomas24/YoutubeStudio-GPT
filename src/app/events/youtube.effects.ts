import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { of } from 'rxjs'
import { switchMap, catchError, map } from 'rxjs/operators'
import { YoutubeService } from '../services/youtube.service'
import {
  getAIKeyTerms,
  getAIKeyTermsError,
  getAIKeyTermsSuccess,
  getCustomInstructions,
  getCustomInstructionsError,
  getCustomInstructionsSuccess,
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

  youtubeAIInstructions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getCustomInstructions),
      switchMap(({ transcript, tones, category, keyTerms }) =>
        this.youtubeService
          .getYoutubeCustomInstructions(transcript, tones, category, keyTerms)
          .pipe(
            map((instructions: string) =>
              getCustomInstructionsSuccess({ instructions })
            ),
            catchError(error => of(getCustomInstructionsError({ error })))
          )
      )
    )
  )
}
