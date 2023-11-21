import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionGeneratorComponent } from './description-generator.component';

describe('DescriptionGeneratorComponent', () => {
  let component: DescriptionGeneratorComponent;
  let fixture: ComponentFixture<DescriptionGeneratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DescriptionGeneratorComponent]
    });
    fixture = TestBed.createComponent(DescriptionGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
