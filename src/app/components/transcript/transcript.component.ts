import { Component } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { selectYoutubeInfo } from 'src/app/events/youtube.selectors'
import { YoutubeInfo } from 'src/app/services/youtube.service'

@Component({
  selector: 'app-transcript',
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.scss'],
})
export class TranscriptComponent {
  public youtubeInfo$: Observable<YoutubeInfo>

  constructor(private store: Store) {
    this.youtubeInfo$ = this.store.select(selectYoutubeInfo)
  }
}
