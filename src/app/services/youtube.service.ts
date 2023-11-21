import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  constructor(private http: HttpClient) { }

  public getYoutubeUrl(youtubeUrl: string): Observable<YoutubeInfo>{
    const headers = { 'x-api-key': environment.functionApiKey }
    const url = environment.apiCalls.getYoutubeUrl
    return this.http.post(url, {youtubeUrl}, { headers, responseType: 'text' })
      .pipe(
        map((data: any) => {
          const parsedData = JSON.parse(data)
          const formatted = this.formatTranscript(parsedData.docs[0].pageContent)
          return {
            transcript: formatted,
            description: parsedData.docs[0].metadata.description,
            title: parsedData.docs[0].metadata.title,
            viewCount: parsedData.docs[0].metadata.view_count,
            author: parsedData.docs[0].metadata.author,
          } as YoutubeInfo
        }))
  }

  public getYoutubeDescription(transcript: string): Observable<YoutubeInfo>{
    const headers = { 'x-api-key': environment.functionApiKey }
    const url = environment.apiCalls.getYoutubeDescription
    return this.http.post(url, {transcript}, { headers, responseType: 'text' })
      .pipe(
        map((data: any) => {
          return data
        }))
  }

  public formatTranscript(transcript: string){
    const sentences = transcript.split('. ');

    // Capitalize the first letter of each sentence
    const capitalizedSentences = sentences.map(sentence => {
        return sentence.charAt(0).toUpperCase() + sentence.slice(1);
    });

    // Join the sentences back together, adding '. ' between them
    return capitalizedSentences.join('. ');
  }
}


export interface YoutubeInfo {
  transcript: string
  description: string
  title: string
  viewCount: number
  author: string
}