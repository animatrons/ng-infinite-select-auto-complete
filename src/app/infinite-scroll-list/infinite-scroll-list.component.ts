import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, debounce, debounceTime, startWith } from 'rxjs';

@Component({
  selector: 'inifinte-scroll-list',
  templateUrl: './infinite-scroll-list.component.html',
  styleUrls: ['./infinite-scroll-list.component.scss']
})
export class InfiniteScrollListComponent implements OnInit {
  title = 'List Infinite Scroll';
  throttle = 300;
  scrollDistance = 1;

  blockSize = 50;
  lastItemIndex = 0;

  items: string[] = [];
  itemsAll: string[] = [];
  itemsToShow: string[] = [];

  scrollItemsFilterController = new FormControl('');
  allItemsFilterController = new FormControl('');
  scrollItemsFilter = '';
  allItemsFilter = '';

  constructor() { }

  ngOnInit(): void {
    this.items = ([].constructor(1000) as string[]).fill('').map((_, i) => `✅ Item ${i + 1}`);
    this.updateDisplayed();
    this.updateDisplayedAll();

    this.scrollItemsFilterController.valueChanges.pipe(
      debounceTime(1000),
    ).subscribe((filter) => {
      this.scrollItemsFilter = filter ?? ''
      this.updateDisplayed(true);
    });

    this.allItemsFilterController.valueChanges.pipe(
      debounceTime(1000),
    ).subscribe((filter) => {
      this.allItemsFilter = filter ?? ''
      this.updateDisplayedAll();
    });
  }

  updateDisplayed(init: boolean = false, filter?: string) {
    if (init) {
      this.lastItemIndex = 0;
      this.itemsToShow = [];
    }
    const next = this.items.filter(item => item.includes(this.scrollItemsFilter)).slice(this.lastItemIndex, this.lastItemIndex + this.blockSize);
    this.itemsToShow = this.itemsToShow.concat(next);
    this.lastItemIndex += this.blockSize;
    // if (!init) {
    //   this.lastItemIndex += this.blockSize;
    // }
  }

  updateDisplayedAll() {
    this.itemsAll = this.items.filter(item => item.includes(this.allItemsFilter));
  }

  onScroll() {
    console.log('Scrolled to bottom');

    this.updateDisplayed();
  }

}
