import { AfterViewInit, Directive, EventEmitter, Inject, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { debounceTime, fromEvent, Subject, takeUntil, tap } from 'rxjs';

/** The height of the select items in `em` units. */
const SELECT_ITEM_HEIGHT_EM = 3;

@Directive({
  selector: '[infiniteScrollSelect]'
})
export class InfiniteScrollSelectDirective implements OnInit, OnDestroy, AfterViewInit {

  @Input() threshold = '15%';
  @Input() debounceTime = 150;
  @Input() complete: boolean = false;
  @Output() infiniteScroll = new EventEmitter<void>();

  private panel!: Element;
  private thrPx = 0;
  private thrPc = 0;
  private singleOptionHeight = SELECT_ITEM_HEIGHT_EM;

  private destroyed$ = new Subject<boolean>();

  constructor(private matSelect: MatSelect, @Inject(NgZone) private ngZone: NgZone) {
  }

  ngOnInit() {
    this.evaluateThreshold();
  }

  ngAfterViewInit() {
    this.matSelect.openedChange.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((opened) => {
      if (opened) {
        this.panel = this.matSelect.panel.nativeElement;
        this.singleOptionHeight = this.getSelectItemHeightPx();
        this.registerScrollListener();
      }
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
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
      const countOfRenderedOptions = this.matSelect.options.length;
      const infiniteScrollDistance = this.singleOptionHeight * countOfRenderedOptions;
      const threshold = this.thrPc !== 0 ? (infiniteScrollDistance * this.thrPc) : this.thrPx;

      const scrolledDistance = this.panel.clientHeight + event.target.scrollTop;

      if ((scrolledDistance + threshold) >= infiniteScrollDistance) {
        this.ngZone.run(() => this.infiniteScroll.emit());
      }
    });
  }

  getSelectItemHeightPx(): number {
    return parseFloat(getComputedStyle(this.panel).fontSize) * SELECT_ITEM_HEIGHT_EM;
  }

}
