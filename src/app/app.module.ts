import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiKeyComponent } from './components/api-key/api-key.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { YoutubeReducer, youtubeFeatureKey } from './events/youtube.reducer';
import { YoutubeEffects } from './events/youtube.effects';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { ToolbarModule } from 'primeng/toolbar';
import { DescriptionGeneratorComponent } from './components/description-generator/description-generator.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { BadgeModule } from 'primeng/badge';

@NgModule({
  declarations: [
    AppComponent,
    ApiKeyComponent,
    HomeComponent,
    TopNavComponent,
    DescriptionGeneratorComponent
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
    TabMenuModule,
    BadgeModule,
    StoreModule.forRoot({}, {}),
    StoreModule.forFeature(youtubeFeatureKey, YoutubeReducer),
    EffectsModule.forRoot([YoutubeEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
