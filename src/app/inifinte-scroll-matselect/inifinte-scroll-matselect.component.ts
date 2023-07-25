import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BehaviorSubject, map, Observable, of, scan, startWith } from 'rxjs';

@Component({
  templateUrl: './inifinte-scroll-matselect.component.html',
  styleUrls: ['./inifinte-scroll-matselect.component.scss']
})
export class InifinteScrollMatselectComponent {

  title = 'Angular Material Select Infinite Scroll';
  total = 6000;
  data = Array.from({length: this.total}).map((_, i) => `Option ${i}`);
  limit = 10;
  offset = 0;
  options = new BehaviorSubject<string[]>([]);
  options$: Observable<string[]>;

  reset: boolean = false;

  myControl = new FormControl('');
  optionsAuto: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]> = new Observable();

  constructor() {
      this.options$ = this.options.asObservable().pipe(
          scan((acc: any[], curr) => {
            if (this.reset) return [...curr];
            return [...acc, ...curr];
          }, [])
      );
  }

  ngOnInit() {
    this.getBlock(0, '', false);
  }

  getNextBatch() {
      const result = this.data.slice(this.offset, this.offset + this.limit);
      this.options.next(result);
      this.offset += this.limit;
  }

  getBlock(block: number, filter: string, reset: boolean) {
    this.reset = reset;
    let nextBatch: any[] = [];
    nextBatch = (!!filter.trim() ? [...this.data.filter(element => element.includes(filter))] : [...this.data])
      .slice(block * this.limit, block * this.limit + this.limit)
    console.log(`Block NO: ${block} | Filter: ${filter} | Reset: ${reset} | Result: `, nextBatch);
    this.options.next(nextBatch);
  }

  onSelect($event: MatAutocompleteSelectedEvent) {
    console.log($event.option.value);
  }

}
