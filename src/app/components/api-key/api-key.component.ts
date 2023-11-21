import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { selectYoutubeInfo } from 'src/app/events/youtube.selectors';
import { YoutubeInfo, YoutubeService } from 'src/app/services/youtube.service';

@Component({
  selector: 'app-api-key',
  templateUrl: './api-key.component.html',
  styleUrls: ['./api-key.component.scss']
})
export class ApiKeyComponent implements OnInit {
  private static readonly OPENAI_API_KEY = 'openaiKey'
  public hasKeyUploaded: boolean = false
  public apiKeyValue: string = ''
  public youtubeInfo$: Observable<YoutubeInfo>

  public leftSide = [
    { label: 'Import API Key', icon: 'pi pi-fw pi-lock' },
    { label: 'Video Transcript', icon: 'pi pi-fw pi-file' }
  ]
  public rightSide = [
    { label: 'Description AI', icon: 'pi pi-fw pi-youtube' },
    { label: 'Chat Bot', icon: 'pi pi-fw pi-comment' }
  ]
  constructor(private youtubeService: YoutubeService, private store: Store){
    this.youtubeInfo$ = this.store.select(selectYoutubeInfo)
  }


  ngOnInit(): void {
    const apiKey = localStorage.getItem(ApiKeyComponent.OPENAI_API_KEY)
    if(!!apiKey) {
      this.hasKeyUploaded = true
    }
  }

  public storeApiKey(){
    localStorage.setItem(ApiKeyComponent.OPENAI_API_KEY, this.apiKeyValue)
    this.hasKeyUploaded = true
  }

  public getDescription(transcript: string){
    this.youtubeService.getYoutubeDescription(transcript).pipe(take(1)).subscribe((description: any) => {
      const parsed = JSON.parse(description)
      const parsedSummary = JSON.parse(parsed.summary)
      console.log(parsedSummary)
    })
  }
}
