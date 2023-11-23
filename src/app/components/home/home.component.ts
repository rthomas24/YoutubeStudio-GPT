import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { getYoutubeInfo, getYoutubeTimestamps } from 'src/app/events/youtube.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  youtubeUrl: string = ''
  videoUrl?: SafeResourceUrl

  constructor(private store: Store, private sanitizer: DomSanitizer){}


  updateVideoUrl(url: string): void {
    const videoId = this.extractVideoID(url);
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + videoId);
  }

  getTranscript(){
    if(this.youtubeUrl.includes('youtube')) {
      // this.store.dispatch(getYoutubeInfo({youtubeUrl: this.youtubeUrl}))
      this.store.dispatch(getYoutubeTimestamps({youtubeUrl: this.youtubeUrl}))
      this.updateVideoUrl(this.youtubeUrl)
    }
  }

  private extractVideoID(url: string): string {
    // Logic to extract video ID from the YouTube URL
    // You may need to adjust the logic based on the URL format
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length == 11) {
      return match[2];
    } else {
      // Handle invalid URL
      return '';
    }
  }
}
