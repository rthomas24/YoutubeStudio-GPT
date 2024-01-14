import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { ApiKeyComponent } from './components/api-key/api-key.component'
import { FormsModule } from '@angular/forms'
import { HomeComponent } from './components/home/home.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { InputTextModule } from 'primeng/inputtext'
import { SelectButtonModule } from 'primeng/selectbutton'
import { ButtonModule } from 'primeng/button'
import { HttpClientModule } from '@angular/common/http'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { YoutubeReducer, youtubeFeatureKey } from './events/youtube.reducer'
import { YoutubeEffects } from './events/youtube.effects'
import { TopNavComponent } from './components/top-nav/top-nav.component'
import { ToolbarModule } from 'primeng/toolbar'
import { DescriptionGeneratorComponent } from './components/description-generator/description-generator.component'
import { TabMenuModule } from 'primeng/tabmenu'
import { BadgeModule } from 'primeng/badge'
import { StatsContainerComponent } from './components/stats-container/stats-container.component'
import { ContentTabsComponent } from './components/content-tabs/content-tabs.component'
import { DividerModule } from 'primeng/divider'
import { SliderModule } from 'primeng/slider'
import { ChipsModule } from 'primeng/chips'
import { DialogModule } from 'primeng/dialog'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { ContentComponent } from './components/content/content.component'
import { ChatBotComponent } from './components/chat-bot/chat-bot.component'
import { TranscriptComponent } from './components/transcript/transcript.component'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    AppComponent,
    ApiKeyComponent,
    HomeComponent,
    TopNavComponent,
    DescriptionGeneratorComponent,
    StatsContainerComponent,
    ContentTabsComponent,
    ContentComponent,
    ChatBotComponent,
    TranscriptComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    InputTextModule,
    SelectButtonModule,
    ButtonModule,
    ToolbarModule,
    DialogModule,
    TabMenuModule,
    DividerModule,
    BadgeModule,
    SliderModule,
    ChipsModule,
    DropdownModule,
    InputTextareaModule,
    ProgressSpinnerModule,
    StoreModule.forRoot({}, {}),
    StoreModule.forFeature(youtubeFeatureKey, YoutubeReducer),
    EffectsModule.forRoot([YoutubeEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
