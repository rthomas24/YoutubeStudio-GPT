import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable, filter, take } from 'rxjs'
import { getAIYoutubeDescription } from 'src/app/events/youtube.actions'
import {
  selectGeneratedDescriptions,
  selectGeneratingStatus,
  selectYoutubeInfo,
} from 'src/app/events/youtube.selectors'
import {
  ChatCompletionResponse,
  YoutubeInfo,
} from 'src/app/services/youtube.service'

@Component({
  selector: 'app-description-generator',
  templateUrl: './description-generator.component.html',
  styleUrls: ['./description-generator.component.scss'],
})
export class DescriptionGeneratorComponent implements OnInit {
  public tones: string[] = []
  public toneOptions: string[] = [
    'Happy',
    'Excited',
    'Formal',
    'Friendly',
    'Joyful',
    'Casual',
  ]
  public wordCount: number = 100
  public keywords: string[] = []
  public phrases: string = ''
  public aiGenereatedDescriptions$: Observable<ChatCompletionResponse[]>
  public youtubeInfo$: Observable<YoutubeInfo>
  public generatingStatus$: Observable<boolean>
  public currentlyGenerating = false
  public currentView = 'genDesc'
  visible: boolean = false

  constructor(private store: Store) {
    this.aiGenereatedDescriptions$ = this.store.select(
      selectGeneratedDescriptions
    )
    this.youtubeInfo$ = this.store.select(selectYoutubeInfo)

    this.generatingStatus$ = this.store.select(selectGeneratingStatus)
  }

  ngOnInit(): void {
    this.generatingStatus$.subscribe(status => {
      this.currentlyGenerating = status
    })
  }

  generateDescription(): void {
    const description = {
      tones: this.tones,
      wordCount: this.wordCount,
      keyWords: this.keywords,
      phrases: this.phrases,
    } as GenerateDescription

    this.youtubeInfo$
      .pipe(
        take(1),
        filter(ytInfo => !!ytInfo.transcript)
      )
      .subscribe(ytInfo => {
        this.store.dispatch(
          getAIYoutubeDescription({
            transcript: ytInfo.transcript,
            generateDescription: description,
          })
        )
      })
  }

  setVisible() {
    this.visible = !this.visible
  }

  addTone(tone: string, event: MouseEvent) {
    const clickedElement = event.target as HTMLElement

    if (clickedElement.classList.contains('selected')) {
      clickedElement.classList.remove('selected')
    } else {
      clickedElement.classList.add('selected')
    }

    if (this.tones.includes(tone)) {
      this.tones = this.tones.filter(t => t !== tone)
    } else {
      this.tones = [...this.tones, tone]
    }
  }

  generateNav(view: string) {
    this.currentView = view
  }
}

export interface GenerateDescription {
  tones: string[]
  wordCount: number
  keyWords: string[]
  phrases: string
}
