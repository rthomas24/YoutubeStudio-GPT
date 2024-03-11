import { Component } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable, Subscription } from 'rxjs'
import {
  selectYoutubeInfo,
  selectYoutubeTimestamps,
} from 'src/app/events/youtube.selectors'
import { YoutubeInfo, YoutubeService } from 'src/app/services/youtube.service'

@Component({
  selector: 'app-transcript',
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.scss'],
})
export class TranscriptComponent {
  public youtubeInfo$: Observable<YoutubeInfo>
  public youtubeTranscript$: Observable<any>
  public fullResponse: string = ''
  private streamSubscription!: Subscription
  private sseSubscription!: Subscription

  constructor(
    private store: Store,
    private youtube: YoutubeService
  ) {
    this.youtubeInfo$ = this.store.select(selectYoutubeInfo)
    this.youtubeTranscript$ = this.store.select(selectYoutubeTimestamps)
  }

  subscribeToApiStream(): void {
    this.sseSubscription = this.youtube
      .getServerSentEvent('http://localhost:3000/testApi')
      .subscribe({
        next: (data: string) => {
          const parsedData = JSON.parse(data)
          this.fullResponse += parsedData
        },
        error: error => console.error('SSE error:', error),
      })
  }

  ngOnDestroy(): void {
    if (this.streamSubscription) {
      this.streamSubscription.unsubscribe()
    }
  }
}
