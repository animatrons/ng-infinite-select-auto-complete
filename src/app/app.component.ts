import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent } from '@angular/material/legacy-autocomplete';
import { BehaviorSubject, map, Observable, of, scan, startWith } from 'rxjs';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {}
