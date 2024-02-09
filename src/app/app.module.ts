import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { InfiniteScrollSelectDirective } from './shared/infinite-scroll-select.directive';
import { TestAutoCompleteDirective } from './shared/test-auto-complete.directive';
import { InfiniteScrollListComponent } from './infinite-scroll-list/infinite-scroll-list.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import the 'BrowserAnimationsModule' module
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { Route, RouterModule } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { InifinteScrollMatselectComponent } from './inifinte-scroll-matselect/inifinte-scroll-matselect.component';


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
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    BrowserAnimationsModule, // Import the 'BrowserAnimationsModule' module
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule, // Import the 'MatInputModule' module
    RouterModule.forRoot(routes),
    InfiniteScrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
