import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { YoutubeService } from '../services/youtube.service';
import { getYoutubeInfo, getYoutubeInfoError, getYoutubeInfoSuccess } from './youtube.actions';

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


}
