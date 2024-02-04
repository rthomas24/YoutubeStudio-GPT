import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment'
import { Observable, map } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { GenerateDescription } from '../components/description-generator/description-generator.component'
import { ChatHistory } from '../events/youtube.reducer'

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  constructor(private http: HttpClient) {}

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

  public getYoutubeDescription(
    transcript: string,
    descriptionOptions: GenerateDescription
  ): Observable<ChatCompletionResponse> {
    const headers = { 'x-api-key': environment.functionApiKey }
    const url = 'http://localhost:3000/getcustomdescription'
    return this.http
      .post(
        url,
        { transcript, descriptionOptions },
        { headers, responseType: 'text' }
      )
      .pipe(
        map((data: any) => {
          const parsedData = JSON.parse(data)
          return {
            summary: {
              id: parsedData.summary.id,
              object: parsedData.summary.object,
              created: parsedData.summary.created,
              model: parsedData.summary.model,
              choices: parsedData.summary.choices.map((choice: any) => {
                return {
                  index: choice.index,
                  message: {
                    role: choice.message.role,
                    content: choice.message.content,
                  },
                  finish_reason: choice.finish_reason,
                }
              }),
              usage: {
                prompt_tokens: parsedData.summary.usage.prompt_tokens,
                completion_tokens: parsedData.summary.usage.completion_tokens,
                total_tokens: parsedData.summary.usage.total_tokens,
              },
            },
          } as ChatCompletionResponse
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
              text: a.text,
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

    // Join the sentences back together, now each sentence ends with a newline
    // The slice(0, -1) removes the last added newline character after the final sentence
    return formattedSentences.join('').slice(0, -1)
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
  text: string
  start: number
  duration: number
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
