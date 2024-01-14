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

  categories: Categories[] | undefined;
  selectedCategory: Categories | undefined;

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

    this.categories = [
      { name: 'Gaming', code: 'GM' },
      { name: 'Technology', code: 'TECH' },
      { name: 'Vlogging', code: 'VLOG' },
      { name: 'Education', code: 'EDU' },
      { name: 'Music', code: 'MUS' },
      { name: 'Cooking', code: 'COOK' },
      { name: 'Travel', code: 'TRV' },
      { name: 'Fashion', code: 'FSH' },
      { name: 'Fitness', code: 'FIT' },
      { name: 'Comedy', code: 'CMD' },
      { name: 'Animation', code: 'ANIM' },
      { name: 'Sports', code: 'SPRT' },
      { name: 'Documentary', code: 'DOC' },
      { name: 'DIY', code: 'DIY' },
      { name: 'Beauty', code: 'BTY' },
      { name: 'News', code: 'NEWS' },
      { name: 'Science', code: 'SCI' },
      { name: 'History', code: 'HIST' },
      { name: 'Cinema', code: 'CIN' },
      { name: 'Automotive', code: 'AUTO' },
      { name: 'Nature', code: 'NAT' },
      { name: 'Health', code: 'HLTH' },
      { name: 'Literature', code: 'LIT' },
      { name: 'Philosophy', code: 'PHIL' },
      { name: 'Art', code: 'ART' },
      { name: 'Gardening', code: 'GARD' }
    ];
  }

  generateDescription(): void {
    const description = {
      tones: this.tones,
      wordCount: this.wordCount,
      category: this.selectedCategory ? this.selectedCategory : '',
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
  category: string
  keyWords: string[]
  phrases: string
}

export interface Categories {
  name: string;
  code: string;
}
