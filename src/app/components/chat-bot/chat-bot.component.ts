import { Component } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable, take } from 'rxjs'
import { sendNewChatMessage } from 'src/app/events/youtube.actions'
import { ChatHistory } from 'src/app/events/youtube.reducer'
import { selectChatHistory, selectChatLoadStatus, selectYoutubeInfo } from 'src/app/events/youtube.selectors'
import { YoutubeInfo } from 'src/app/services/youtube.service'

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss'],
})
export class ChatBotComponent {
  public userMessage: string = ''
  public isLoadingAIMessage$: Observable<boolean>
  public youtubeInfo$: Observable<YoutubeInfo>
  public chatHistory$: Observable<ChatHistory[]>

  constructor(private store: Store){
    this.youtubeInfo$ = this.store.select(selectYoutubeInfo)
    this.chatHistory$ = this.store.select(selectChatHistory)
    this.isLoadingAIMessage$ = this.store.select(selectChatLoadStatus)
  }


  sendMessage(){
    this.youtubeInfo$.pipe(take(1)).subscribe((info) => {
      this.store.dispatch(sendNewChatMessage({transcript: info.transcript, chatHistory: [], userPrompt: this.userMessage}))
      this.userMessage = ''
    })
  }
}
