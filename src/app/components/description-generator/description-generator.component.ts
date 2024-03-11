import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable, Subscription, filter, take } from 'rxjs'
import {
  addAIYoutubeDescription,
  getAIKeyTerms,
  getCustomInstructions,
} from 'src/app/events/youtube.actions'
import {
  selectGeneratedDescriptions,
  selectInstructions,
  selectKeyWords,
  selectYoutubeInfo,
  selectYoutubeTimestamps,
} from 'src/app/events/youtube.selectors'
import {
  YoutubeInfo,
  YoutubeService,
  YoutubeTimestamps,
} from 'src/app/services/youtube.service'
import { ConfirmationService } from 'primeng/api'

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
  public instructions: string = ''
  public aiGenereatedDescriptions$: Observable<string[]>
  public youtubeTranscript$: Observable<YoutubeTimestamps>
  public youtubeInfo$: Observable<YoutubeInfo>
  public generateKeyWords$: Observable<string[]>
  public generateInstructions$: Observable<string>
  public currentlyGenerating = false
  public currentView = 'genDesc'
  public first: number = 0
  public stateOptions: any[] = [
    { label: 'Summary', value: 'noFull' },
    { label: 'Transcript', value: 'full' },
  ]
  public value: string = 'noFull'

  public categories: Categories[] | undefined
  public selectedCategory: Categories | undefined

  public visible: string = ''
  public fullResponse: string = ''
  private streamSubscription!: Subscription
  private sseSubscription!: Subscription

  constructor(
    private store: Store,
    private confirmationService: ConfirmationService,
    private youtube: YoutubeService
  ) {
    this.aiGenereatedDescriptions$ = this.store.select(
      selectGeneratedDescriptions
    )
    this.youtubeInfo$ = this.store.select(selectYoutubeInfo)

    this.generateKeyWords$ = this.store.select(selectKeyWords)

    this.generateInstructions$ = this.store.select(selectInstructions)

    this.youtubeTranscript$ = this.store.select(selectYoutubeTimestamps)
  }

  ngOnInit(): void {
    this.generateKeyWords$.subscribe(keywords => {
      this.keywords = [...this.keywords, ...keywords]
    })

    this.generateInstructions$.subscribe(instruct => {
      this.instructions = instruct
    })

    this.aiGenereatedDescriptions$.subscribe(descriptions => {
      this.first = descriptions.length - 1
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
      { name: 'Gardening', code: 'GARD' },
    ]
  }

  initiateChat(): void {
    this.currentlyGenerating = true
    const descriptionOptions = {
      tones: this.tones,
      wordCount: this.wordCount,
      category: this.selectedCategory ? this.selectedCategory.name : '',
      keyWords: this.keywords,
      instructions: this.instructions,
      fullTranscript: this.value === 'full',
    } as GenerateDescription

    this.youtubeTranscript$
      .pipe(
        take(1),
        filter(ytInfo => !!ytInfo.transcript)
      )
      .subscribe(ytInfo => {
        this.currentView = 'viewDesc'
        this.youtube
          .getYTDescription(
            descriptionOptions,
            ytInfo.transcript
          )
          .subscribe({
            next: (response: any) => {
              const token = response.token
              this.listenForUpdates(token)
            },
            error: error => console.error('Error initiating chat:', error),
          })
      })
  }

  listenForUpdates(token: string): void {
    this.youtube
      .getServerSentEvent(token)
      .pipe(filter(data => data && data !== 'undefined'))
      .subscribe({
        next: (data: string) => {
          this.fullResponse += JSON.parse(data)
        },
        complete: () => {
          console.log('finished')
        },
        error: error => {
          if (error.eventPhase === EventSource.CLOSED) {
            this.store.dispatch(
              addAIYoutubeDescription({ description: this.fullResponse })
            )
            this.fullResponse = ''
            this.currentlyGenerating = false
            console.warn('Connection closed by the server')
          } else {
            console.error('Error receiving updates:', error)
          }
        },
      })
  }

  generateKeyWords() {
    this.youtubeTranscript$
      .pipe(
        take(1),
        filter(ytInfo => !!ytInfo.transcript)
      )
      .subscribe(ytInfo => {
        this.store.dispatch(
          getAIKeyTerms({ transcript: ytInfo.transcript })
        )
      })
  }

  generateInstructions() {
    this.youtubeInfo$
      .pipe(
        take(1),
        filter(ytInfo => !!ytInfo.transcript)
      )
      .subscribe(ytInfo => {
        this.store.dispatch(
          getCustomInstructions({
            transcript: ytInfo.transcript,
            category: this.selectedCategory!.name,
            tones: this.tones,
            keyTerms: this.keywords,
          })
        )
      })
  }

  setVisible(type: string) {
    this.visible = type
  }

  addTone(tone: string, event: MouseEvent) {
    const clickedElement = event.target as HTMLElement

    if (clickedElement.classList.contains('selected')) {
      clickedElement.classList.remove('selected')
      this.tones = this.tones.filter(t => t !== tone)
    } else if (this.tones.length < 2) {
      clickedElement.classList.add('selected')
      this.tones = [...this.tones, tone]
    }
  }

  generateNav(view: string) {
    this.currentView = view
  }

  onPageChange(event: any) {
    this.first = event.first
  }

  confirmKeyTerms(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message:
        'Are you sure you want to use AI to create Key Words and Terms for you?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.generateKeyWords()
        // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
      },
      reject: () => {},
    })
  }

  confirmInstructions(event: Event) {
    this.youtubeInfo$
      .pipe(
        take(1),
        filter(ytInfo => !!ytInfo.transcript)
      )
      .subscribe(ytInfo => {
        if (this.selectedCategory && this.keywords.length) {
          this.confirmationService.confirm({
            target: event.target as EventTarget,
            message:
              'Are you sure you want to use AI to create Instructions for you?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.generateInstructions()
              // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
            },
            reject: () => {},
          })
        } else {
          alert(
            'You must have a transcript, a category and key terms filled out'
          )
        }
      })
  }
}

export interface GenerateDescription {
  tones: string[]
  wordCount: number
  category: string
  keyWords: string[]
  instructions: string
  fullTranscript: boolean
}

export interface Categories {
  name: string
  code: string
}
