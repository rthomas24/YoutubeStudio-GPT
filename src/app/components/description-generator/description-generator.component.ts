import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, filter, take } from 'rxjs';
import { getAIYoutubeDescription } from 'src/app/events/youtube.actions';
import { selectGeneratedDescriptions, selectYoutubeInfo } from 'src/app/events/youtube.selectors';
import { ChatCompletionResponse, YoutubeInfo } from 'src/app/services/youtube.service';

@Component({
  selector: 'app-description-generator',
  templateUrl: './description-generator.component.html',
  styleUrls: ['./description-generator.component.scss']
})
export class DescriptionGeneratorComponent {

  public tones: string[] = ['Happy', "Excited"];
  public toneOptions: string[] = ['Happy', "Excited", "Formal", "Friendly", "Joyful", "Casual"];
  public wordCount: number = 100;
  public keywords: string[] = [];
  public phrases: string = '';
  public aiGenereatedDescriptions$: Observable<ChatCompletionResponse[]>
  public youtubeInfo$: Observable<YoutubeInfo>
  visible: boolean = false;


  constructor(private store: Store){
    this.aiGenereatedDescriptions$ =  this.store.select(selectGeneratedDescriptions)
    this.youtubeInfo$ = this.store.select(selectYoutubeInfo)

    this.aiGenereatedDescriptions$.subscribe((a) => {
      console.log(JSON.stringify(a, null, '\t'))
    })
  }

  generateDescription(): void {
    const description = {
      tones: this.tones,
      wordCount: this.wordCount,
      keyWords: this.keywords,
      phrases: this.phrases
    } as GenerateDescription

    this.youtubeInfo$.pipe(take(1), filter((ytInfo) => !!ytInfo.transcript)).subscribe((ytInfo) => {
      this.store.dispatch(getAIYoutubeDescription({transcript: ytInfo.transcript, generateDescription: description}))
    })
  }

  setVisible(){
    this.visible = !this.visible
  }
}


export interface GenerateDescription {
  tones: string[]
  wordCount: number,
  keyWords: string[],
  phrases: string
}