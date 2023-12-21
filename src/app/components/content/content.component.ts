import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, filter } from 'rxjs';
import { selectActiveTabs, selectGeneratedDescriptions, selectUploadedKeyStatus, selectYoutubeInfo } from 'src/app/events/youtube.selectors';
import { ChatCompletionResponse, YoutubeInfo, YoutubeService } from 'src/app/services/youtube.service';
import { ApiKeyComponent } from '../api-key/api-key.component';
import { uploadedKey } from 'src/app/events/youtube.actions';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  public apiKeyValue: string = ''
  public youtubeInfo$: Observable<YoutubeInfo>
  public hasKeyUploaded$: Observable<boolean>
  public aiGenereatedDescriptions$: Observable<ChatCompletionResponse[]>
  public getActiveTabs$: Observable<any>

  public leftSide = [
    { label: 'Import API Key', icon: 'pi pi-fw pi-lock', key: 'key', group: 'left' },
    { label: 'Video Transcript', icon: 'pi pi-fw pi-file', key: 'transcript', group: 'left' }
  ]
  public rightSide = [
    { label: 'Description AI', icon: 'pi pi-fw pi-youtube', key: 'description', group: 'right' },
    { label: 'Chat Bot', icon: 'pi pi-fw pi-comment', key: 'chat', group: 'right' }
  ]
  constructor(private youtubeService: YoutubeService, private store: Store){
    this.youtubeInfo$ = this.store.select(selectYoutubeInfo)
    this.hasKeyUploaded$ = this.store.select(selectUploadedKeyStatus)
    this.aiGenereatedDescriptions$ =  this.store.select(selectGeneratedDescriptions)
    this.getActiveTabs$ = this.store.select(selectActiveTabs)

    // this.aiGenereatedDescriptions$.pipe(filter((aiDescription) => aiDescription.length > 0)).subscribe((a) => {
    //   this.rightSide.push({ label: 'Generated Descriptions', icon: 'pi pi-fw pi-comment' })
    // })
  }


  ngOnInit(): void {
    const apiKey = localStorage.getItem(ApiKeyComponent.OPENAI_API_KEY)
    if(!!apiKey) {
      this.store.dispatch(uploadedKey({key: true}))
    }
  }
}
