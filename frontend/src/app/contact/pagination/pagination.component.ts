import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input() total: number;
  @Input() pagesToShow: number;
  @Input() current: number;

  @Output() goPrev = new EventEmitter<boolean>();
  @Output() goNext = new EventEmitter<boolean>();
  @Output() goPage = new EventEmitter<number>();

  constructor() { }

  ngOnInit() { }

  onPage(n: number): void {
    this.goPage.emit(n);
  }

  onPrev(): void {
    this.goPrev.emit(true);
  }

  onNext(next: boolean): void {
    this.goNext.emit(next);
  }

  getPages(): number[] {
    const pages: number[] = [];
    this.current = Number(this.current);
    this.pagesToShow = Number(this.pagesToShow);
    if (this.pagesToShow < 8) {
      for (let p = 1; p <= this.pagesToShow; p++) {
        pages.push(p);
      }
    } else {
      let left = 0;
      let right = 0;
      if (this.current <= 4) {
        left = 1;
        right = 7;
      } else if (this.current + 3 > this.pagesToShow) {
        right = this.pagesToShow;
        left = this.pagesToShow - 6;
      } else {
        left = this.current - 3;
        right = this.current + 3;
      }
      for (let p = left; p <= right; p++) {
        pages.push(p);
      }
    }
    return pages;
  }

}

