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

  getMin(): number {
    return ((this.limitPerPage * this.startIdx) - this.limitPerPage) + 1;
  }

  getMax(): number {
    let max = this.limitPerPage * this.startIdx;
    if (max > this.total) {
      max = this.total;
    }
    return max;
  }

  totalPages(): number {
    return Math.ceil(this.total / this.limitPerPage) || 0;
  }

  lastPage(): boolean {
    return this.limitPerPage * this.startIdx > this.total;
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
      if (this.current < 4) {
        left = 1;
        if (this.current + 3 > this.pagesToShow) {
          right = this.pagesToShow;
        } else {
          right = this.current + (7 - this.current);
        }
      } else if (this.current + 3 > this.pagesToShow) {
        right = this.pagesToShow;
        left = this.current - 3 - (this.current + 3 - this.pagesToShow);
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

