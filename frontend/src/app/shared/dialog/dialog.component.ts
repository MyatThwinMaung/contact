import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  info = '';
  title = '';
  closeBtnName = '';
  isConfirmModal = false;

  public event: EventEmitter<any> = new EventEmitter();

  constructor(private bsModalRef: BsModalRef) { }

  ngOnInit(): void { }

  onCancel() {
    this.bsModalRef.hide();
  }

  // reply 200 to delete contact if user clicks confirm button
  onConfirm() {
    this.event.emit(200);
    this.bsModalRef.hide();
  }

}
