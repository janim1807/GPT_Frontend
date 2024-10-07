import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {WikiGPTComponent} from './wiki-gpt/wiki-gpt.component';
import {SidebarChatsComponent} from './wiki-gpt/sidebar-chats/sidebar-chats.component';
import {SearchBarComponent} from './wiki-gpt/search-bar/search-bar.component';
import {MatIconModule} from "@angular/material/icon";
import {HeaderComponent} from './wiki-gpt/header/header.component';
import {FormsModule} from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

@NgModule({
  declarations: [
    AppComponent,
    WikiGPTComponent,
    SidebarChatsComponent,
    SearchBarComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    MatSlideToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
