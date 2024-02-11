import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BehaviorSubject, map, Observable, of, scan, startWith, Subject, switchMap } from 'rxjs';

@Component({
  templateUrl: './inifinte-scroll-matselect.component.html',
  styleUrls: ['./inifinte-scroll-matselect.component.scss']
})
export class InifinteScrollMatselectComponent {

  title = 'Angular Material Select Infinite Scroll';
  total = 6000;
  data = Array.from({length: this.total}).map((_, i) => `Option ${i}`);
  limit = 10;

  dataRequest = new Subject<{block: number, filter: string}>();
  options$: Observable<string[]> = this.dataRequest.asObservable().pipe(
    startWith({block: 0, filter: ''}),
    switchMap(({block, filter}) => this.loadDataBlock(block, filter)),
    scan((acc: any[], curr) => {
      if (this.reset) return [...curr];
      return [...acc, ...curr];
    }, [])
  );

  reset: boolean = false;

  myControl = new FormControl('');

  ngOnInit() {
  }

  getBlock(block: number, filter: string, reset: boolean) {
    this.reset = reset;
    let nextBatch: any[] = [];
    console.log(`Block NO: ${block} | Filter: ${filter} | Reset: ${reset} | Result: `, nextBatch);
    this.dataRequest.next({block, filter});
  }

  onSelect($event: MatAutocompleteSelectedEvent) {
    console.log($event.option.value);
  }

  loadDataBlock(block: number, filter: string): Observable<string[]> {
    return of((!!filter.trim() ? [...this.data.filter(element => element.includes(filter))] : [...this.data])
      .slice(block * this.limit, block * this.limit + this.limit));
  }

}
