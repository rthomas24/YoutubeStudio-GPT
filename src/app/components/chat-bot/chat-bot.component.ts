import { Component } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable, combineLatest, take } from 'rxjs'
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
    combineLatest([this.youtubeInfo$, this.chatHistory$])
      .pipe(take(1)).subscribe((dataArr) => {
        const youtubeInfo = dataArr[0]
        const chatHistory = dataArr[1]
        const lastThreeMessages = chatHistory.slice(-3);
        this.store.dispatch(sendNewChatMessage({transcript: youtubeInfo.transcript, chatHistory: lastThreeMessages, userPrompt: this.userMessage}))
        this.userMessage = ''
    })
  }
}
