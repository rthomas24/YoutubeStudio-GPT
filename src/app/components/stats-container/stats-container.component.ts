import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-container',
  templateUrl: './stats-container.component.html',
  styleUrls: ['./stats-container.component.scss']
})
export class StatsContainerComponent {
  @Input() title: string = '';
  @Input() author: string = '';
  @Input() views: number = 0;
  @Input() description: string = '';
}
