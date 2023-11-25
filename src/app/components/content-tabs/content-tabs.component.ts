import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { selectActiveTabs } from 'src/app/events/youtube.selectors';

@Component({
  selector: 'app-content-tabs',
  templateUrl: './content-tabs.component.html',
  styleUrls: ['./content-tabs.component.scss']
})
export class ContentTabsComponent {
  @Input() items: MenuItem[] | undefined;

  @Input() activeItem: MenuItem | undefined;

  public activeTabs$: Observable<string[]>

  constructor(private store: Store){
    this.activeTabs$ = this.store.select(selectActiveTabs)
  }
}
