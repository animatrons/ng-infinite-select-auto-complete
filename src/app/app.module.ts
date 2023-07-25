import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { InfiniteScrollSelectDirective } from './shared/infinite-scroll-select.directive';
import { TestAutoCompleteDirective } from './shared/test-auto-complete.directive';
import { InfiniteScrollListComponent } from './infinite-scroll-list/infinite-scroll-list.component';
import { Route, RouterModule } from '@angular/router';
import { InifinteScrollMatselectComponent } from './inifinte-scroll-matselect/inifinte-scroll-matselect.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const routes: Route[] = [
  {
    path: '',
    redirectTo: 'matselect',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: InfiniteScrollListComponent
  },
  {
    path: 'matselect',
    component: InifinteScrollMatselectComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    InfiniteScrollSelectDirective,
    TestAutoCompleteDirective,
    InfiniteScrollListComponent,
    InifinteScrollMatselectComponent
  ],
  imports: [
    BrowserModule,
    MatSelectModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterModule.forRoot(routes),
    InfiniteScrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
