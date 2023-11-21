import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getYoutubeInfo } from 'src/app/events/youtube.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  youtubeUrl: string = ''

  constructor(private store: Store){}

  getTranscript(){
    this.store.dispatch(getYoutubeInfo({youtubeUrl: this.youtubeUrl}))
  }
}
