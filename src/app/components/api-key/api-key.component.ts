import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { uploadedKey } from 'src/app/events/youtube.actions';
import { YoutubeService } from 'src/app/services/youtube.service';

@Component({
  selector: 'app-api-key',
  templateUrl: './api-key.component.html',
  styleUrls: ['./api-key.component.scss']
})
export class ApiKeyComponent {
  public static readonly OPENAI_API_KEY = 'openaiKey'
  public apiKeyValue: string = ''

  constructor(private youtubeService: YoutubeService, private store: Store){
  }

  public storeApiKey(){
    localStorage.setItem(ApiKeyComponent.OPENAI_API_KEY, this.apiKeyValue)
    this.store.dispatch(uploadedKey({key: true}))
  }

}
