import { Component } from '@angular/core';

@Component({
  selector: 'app-description-generator',
  templateUrl: './description-generator.component.html',
  styleUrls: ['./description-generator.component.scss']
})
export class DescriptionGeneratorComponent {

  public tone: string = '';
  public toneOptions: string[] = ['Happy', "Excited", "Formal", "Friendly", "Joyful", "Casual"];
  public wordCount: number = 100;
  public keywords: string[] = [];
  public phrases: string = '';
  visible: boolean = false;

  generateDescription(): void {
    
  }

  setVisible(){
    this.visible = !this.visible
  }
}
