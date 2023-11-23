import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-description-generator',
  templateUrl: './description-generator.component.html',
  styleUrls: ['./description-generator.component.scss']
})
export class DescriptionGeneratorComponent implements OnInit {
  @Input() items: MenuItem[] | undefined;

  @Input() activeItem: MenuItem | undefined;

  ngOnInit() {
    
  }
}
