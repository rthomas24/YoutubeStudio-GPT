import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-description-generator',
  templateUrl: './description-generator.component.html',
  styleUrls: ['./description-generator.component.scss']
})
export class DescriptionGeneratorComponent implements OnInit {
  @Input() items: MenuItem[] | undefined;

  activeItem: MenuItem | undefined;

  ngOnInit() {
    if(this.items)
      this.activeItem = this.items[0];
  }
}
