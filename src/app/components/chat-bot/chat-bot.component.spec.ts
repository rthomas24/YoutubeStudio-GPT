import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBotComponent } from './chat-bot.component';

describe('ChatBotComponent', () => {
  let component: ChatBotComponent;
  let fixture: ComponentFixture<ChatBotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatBotComponent]
    });
    fixture = TestBed.createComponent(ChatBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
