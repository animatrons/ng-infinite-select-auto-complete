import { ElementRef, AfterViewInit, Directive, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, Inject } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { debounceTime, fromEvent, Subject, takeUntil, tap } from 'rxjs';

/** The height of the select items in `em` units. */
const SELECT_ITEM_HEIGHT_EM = 3;

@Directive({
  selector: '[appTestAutoComplete]'
})
export class TestAutoCompleteDirective implements OnInit, OnDestroy, AfterViewInit {
  @Input() threshold = '15%';
  @Input() debounceTime = 150;
  @Input() complete!: boolean;
  @Input() limit!: number;
  @Output() infiniteScroll = new EventEmitter<{block: number, filter: string, reset: boolean}>();

  private inputSuject = new Subject<string>();
  private filterInput = '';
  private input$ = this.inputSuject.asObservable();

  private panel!: Element;
  private blockIndex = 0;
  private thrPx = 0;
  private thrPc = 0;
  private singleOptionHeight = SELECT_ITEM_HEIGHT_EM;

  constructor(private matAuto: MatAutocomplete, @Inject(ElementRef) private elementRef: ElementRef, @Inject(NgZone) private ngZone: NgZone) { }

  private destroyed$ = new Subject<boolean>();

  ngOnInit() {
    this.evaluateThreshold();
  }

  ngAfterViewInit(): void {
    this.matAuto.opened.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      setTimeout(() => {
        console.log('OPENED PANEL');

        this.panel = this.matAuto.panel.nativeElement;
        this.singleOptionHeight = this.getSelectItemHeightPx();
        this.registerScrollListener();
      }, 300)
    });
    this.elementRef.nativeElement.parentElement.querySelector('input').addEventListener('input', (event: any) => {
      this.inputSuject.next(event.target.value);
    });

    this.input$.pipe(
      debounceTime(500),
      takeUntil(this.destroyed$)
    ).subscribe(filter => {
      this.filterInput = filter;
      this.blockIndex = 0;
      console.log(`You typed ${filter}`);
      this.infiniteScroll.emit({block: 0, filter: this.filterInput, reset: true});
    })
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  registerScrollListener() {
    fromEvent(this.panel, 'scroll').pipe(
      takeUntil(this.destroyed$),
      debounceTime(this.debounceTime),
      tap((event) => {
        this.handleScrollEvent(event);
      })
    ).subscribe();
  }

  handleScrollEvent(event: any) {
    this.ngZone.runOutsideAngular(() => {
      if (this.complete) {
        return;
      }
      const countOfRenderedOptions = this.matAuto.options.length;
      const infiniteScrollDistance = this.singleOptionHeight * countOfRenderedOptions;
      const threshold = this.thrPc !== 0 ? (infiniteScrollDistance * this.thrPc) : this.thrPx;

      const scrolledDistance = this.panel.clientHeight + event.target.scrollTop;
      const blockIndex = Math.floor(countOfRenderedOptions / this.limit)
      if (blockIndex === this.blockIndex) {
        return;
      }
      if ((scrolledDistance + threshold) >= infiniteScrollDistance) {
        this.ngZone.run(() => this.infiniteScroll.emit({block: blockIndex, filter: this.filterInput, reset: false}));
        this.blockIndex = blockIndex;
      }
    });
  }

  evaluateThreshold() {
    if (this.threshold.lastIndexOf('%') > -1) {
      this.thrPx = 0;
      this.thrPc = (parseFloat(this.threshold) / 100);
    } else {
      this.thrPx = parseFloat(this.threshold);
      this.thrPc = 0;
    }
  }

  getSelectItemHeightPx(): number {
    return parseFloat(getComputedStyle(this.panel).fontSize) * SELECT_ITEM_HEIGHT_EM;
  }

}
