import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

import { DialogComponent } from '../../shared/dialog/dialog.component';
import { ContactService } from '../contact.service';
import { Contact } from '../contact';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  // stored contacts from api
  contacts: Contact[] = [];
  searchedContacts: Contact[] = [];
  // contacts to bind in table after pagination
  contactData: Contact[] = [];
  searchText = '';
  bsModalRef: BsModalRef;

  total = 0;
  startIdx = 1;
  limit = 1;
  current = 1;
  pagesToShow = 0;

  constructor(
    public contactService: ContactService,
    private router: Router,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.contactService.getAll().subscribe((data: any[]) => {
      this.contacts = data || [];
      this.searchContact();
    }, error => {
      this.errorDialog("Error", error);
    })
  }

  deleteContact(id) {
    this.contactService.delete(id).subscribe(res => {
      this.contacts = this.contacts.filter(contact => contact.id !== id);
      this.searchContact();
    }, error => {
      this.errorDialog("Error", error);
    })
  }

  editContact(id) {
    this.router.navigate(['contact/edit/', id]);
  }

  searchContact() {
    this.current = 1;
    if (this.searchText === '') {
      this.searchedContacts = this.contacts;
    } else {
      const smallSearchText = this.searchText.toLowerCase();
      this.searchedContacts = this.contacts.filter(contact =>
        contact.name.toLowerCase().includes(smallSearchText) ||
        contact.phone.toLowerCase().includes(smallSearchText) ||
        contact.email.toLowerCase().includes(smallSearchText)
      );
    }

    this.getDatabyPageIndex();
  }

  // dialog to confirm deletion
  confirmDelete(contact) {
    this.bsModalRef = this.modalService.show(DialogComponent, Object.assign({}, { class: 'modal-dialog-centered' }));
    this.bsModalRef.content.isConfirmModal = true;
    this.bsModalRef.content.closeBtnName = "Cancel";
    this.bsModalRef.content.title = "Delete Confirmation";
    this.bsModalRef.content.info = "Are you sure you want to delete " + contact.name + " ?";
    this.bsModalRef.content.event.subscribe(res => {
      if (res === 200) {
        this.deleteContact(contact.id);
      }
    }, error => {
      this.errorDialog("Error", error);
    });
  }

  // dialog to display error message
  errorDialog(errTitle, errInfo) {
    this.bsModalRef = this.modalService.show(DialogComponent, Object.assign({}, { class: 'modal-dialog-centered' }));
    this.bsModalRef.content.closeBtnName = "Ok";
    this.bsModalRef.content.title = errTitle;
    this.bsModalRef.content.info = errInfo;
  }

  // Pagination
  goToPage(n: number): void {
    this.current = n;
    this.getDatabyPageIndex();
  }

  onNext(): void {
    this.current++;
    if (this.current <= this.pagesToShow) {
      this.getDatabyPageIndex();
    } else {
      this.current = this.pagesToShow;
    }
  }

  onPrev(): void {
    this.current--;
    if (this.current >= 1) {
      this.getDatabyPageIndex();
    } else {
      this.current = 1;
    }
  }

  // change limit of pagination
  changeLimit() {
    this.current = 1;
    this.getDatabyPageIndex();
  }

  getDatabyPageIndex() {
    this.limit = Number(this.limit);
    this.total = this.searchedContacts.length;
    this.pagesToShow = Math.ceil(this.total / this.limit);
    // start index of current page
    this.startIdx = ((this.current * this.limit) - (this.limit - 1)) - 1;
    const stopIdx = (this.startIdx + this.limit);
    if (this.total < this.startIdx) {
      this.startIdx = this.startIdx - this.limit;
      this.current--;
    }
    this.contactData = this.searchedContacts.slice(this.startIdx, stopIdx);
  }

}
