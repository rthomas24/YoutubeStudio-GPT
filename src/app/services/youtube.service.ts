import { Injectable, NgZone } from '@angular/core'
import { environment } from '../../environments/environment'
import { Observable, map } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { ChatHistory } from '../events/youtube.reducer'

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  constructor(
    private http: HttpClient,
    private _zone: NgZone
  ) {}

  public getYoutubeUrl(youtubeUrl: string): Observable<YoutubeInfo> {
    const headers = { 'x-api-key': environment.functionApiKey }
    const url = 'http://localhost:3000/getyoutubetranscript'
    return this.http
      .post(url, { youtubeUrl }, { headers, responseType: 'text' })
      .pipe(
        map((data: any) => {
          const parsedData = JSON.parse(data)
          const formatted = this.formatTranscript(
            parsedData.docs[0].pageContent
          )
          return {
            transcript: formatted,
            description: parsedData.docs[0].metadata.description,
            title: parsedData.docs[0].metadata.title,
            viewCount: parsedData.docs[0].metadata.view_count,
            author: parsedData.docs[0].metadata.author,
          } as YoutubeInfo
        })
      )
  }

  public getYoutubeTimestampTranscript(
    youtubeUrl: string
  ): Observable<YoutubeTimestamps[]> {
    const headers = { 'x-api-key': environment.functionApiKey }
    const url = 'http://localhost:3000/gettimestamptranscript'
    return this.http
      .post(url, { youtubeUrl }, { headers, responseType: 'text' })
      .pipe(
        map((data: any) => {
          const parsedData = JSON.parse(data)
          return parsedData.result.map((a: any) => {
            return {
              transcript: a.text,
              start: a.offset / 1000,
              duration: a.duration / 1000,
            } as YoutubeTimestamps
          })
        })
      )
  }

  public chatWithYTVideo(
    transcript: string,
    userPrompt: string,
    chatHistory: ChatHistory[]
  ): Observable<string> {
    const headers = { 'x-api-key': environment.functionApiKey }
    const url = 'http://localhost:3000/chatwithytvideo'
    return this.http
      .post(
        url,
        { transcript, chatHistory, userPrompt },
        { headers, responseType: 'text' }
      )
      .pipe(
        map((data: any) => {
          const parsedData = JSON.parse(data)
          return parsedData.summary
        })
      )
  }

  public getYoutubeKeyTerms(transcript: string): Observable<string[]> {
    const url = 'http://localhost:3000/getKeyWords'
    return this.http
      .post<string[]>(url, { transcript })
      .pipe(map((response: string[]) => response))
  }

  public getYoutubeCustomInstructions(
    transcript: string,
    tones: string[],
    category: string,
    keyTerms: string[]
  ): Observable<string> {
    const url = 'http://localhost:3000/custominstructions'
    return this.http
      .post(
        url,
        { transcript, tones, category, keyTerms },
        { responseType: 'text' }
      )
      .pipe(map((response: string) => response))
  }

  public formatTranscript(transcript: string) {
    const sentences = transcript.split('. ')

    // Capitalize the first letter of each sentence and add a newline
    const formattedSentences = sentences.map(sentence => {
      if (sentence) {
        return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.\n'
      }
      return sentence
    })

    return formattedSentences.join('').slice(0, -1)
  }

  getEventSource(url: string): EventSource {
    return new EventSource(url)
  }

  getServerSentEvent(token: string): Observable<any> {
    return new Observable(observer => {
      const eventSource = new EventSource(
        `http://localhost:3000/getCustomDescription?token=${token}`
      )

      eventSource.onmessage = event => {
        this._zone.run(() => {
          observer.next(event.data)
        })
      }

      eventSource.onerror = error => {
        this._zone.run(() => {
          observer.error(error)
          eventSource.close()
        })
      }

      return () => {
        eventSource.close()
      }
    })
  }

  getYTDescription(params: any, transcript: string): Observable<string> {
    const parameters = {
      ...params,
      transcript,
    }
    return this.http.post<string>(
      'http://localhost:3000/api/getYTDescription',
      parameters
    )
  }
}

export interface YoutubeInfo {
  transcript: string
  description: string
  title: string
  viewCount: number
  author: string
}

export interface YoutubeTimestamps {
  transcript: string
  start?: number
  duration?: number
}

export interface ChatCompletionResponse {
  summary: {
    id: string
    object: string
    created: number
    choices: Choice[]
    model: string
    system_fingerprint: string
    usage: Usage
  }
}

interface Choice {
  index: number
  message: Message
  finish_reason: string
}

interface Message {
  role: string
  content: string
}

interface Usage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}
