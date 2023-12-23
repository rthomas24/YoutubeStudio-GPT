import { Component } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable, filter, take, takeUntil } from 'rxjs'
import { changeTabs, uploadedKey } from 'src/app/events/youtube.actions'
import { selectUploadedKeyStatus } from 'src/app/events/youtube.selectors'
import { YoutubeService } from 'src/app/services/youtube.service'

@Component({
  selector: 'app-api-key',
  templateUrl: './api-key.component.html',
  styleUrls: ['./api-key.component.scss'],
})
export class ApiKeyComponent {
  public static readonly OPENAI_API_KEY = 'openaiKey'
  public apiKeyValue: string = ''
  public hasKeyUploaded$: Observable<boolean>

  constructor(
    private youtubeService: YoutubeService,
    private store: Store
  ) {
    this.hasKeyUploaded$ = this.store.select(selectUploadedKeyStatus)

    this.hasKeyUploaded$
      .pipe(
        filter(value => !!value),
        take(1)
      )
      .subscribe(value => {
        if (value) {
          this.store.dispatch(
            changeTabs({ tab: 'transcript', tabType: 'left' })
          )
        }
      })
  }

  public storeApiKey() {
    localStorage.setItem(ApiKeyComponent.OPENAI_API_KEY, this.apiKeyValue)
    this.store.dispatch(uploadedKey({ key: true }))
  }
}
