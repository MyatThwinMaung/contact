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

  contacts: Contact[] = [];
  contactData: Contact[] = [];
  searchText = '';
  p = 1;
  bsModalRef: BsModalRef;

  constructor(
    public contactService: ContactService,
    private router: Router,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.contactService.getAll().subscribe((data: any[]) => {
      this.contacts = data || [];
      this.searchContact();
      console.log(this.contacts);
    }, error => {
      this.errorDialog("Error", error);
    })
  }

  deleteContact(id) {
    this.contactService.delete(id).subscribe(res => {
      this.contacts = this.contacts.filter(contact => contact.id !== id);
      this.searchContact();
      console.log('Post deleted successfully!');
      console.log(this.contacts);
    }, error => {
      this.errorDialog("Error", error);
    })
  }

  editContact(id) {
    console.log('Id', id);
    this.router.navigate(['contact/edit/', id]);
  }

  searchContact() {
    console.log('search', this.searchText);
    if (this.searchText === '') {
      this.contactData = this.contacts;
      return;
    }
    const smallSearchText = this.searchText.toLowerCase();
    this.contactData = this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(smallSearchText) ||
      contact.phone.toLowerCase().includes(smallSearchText) ||
      contact.email.toLowerCase().includes(smallSearchText)
    );
    console.log(this.contactData);
  }

  confirmDelete(contact) {
    this.bsModalRef = this.modalService.show(DialogComponent, Object.assign({}, { class: 'modal-dialog-centered' }));
    this.bsModalRef.content.isConfirmModal = true;
    this.bsModalRef.content.closeBtnName = "Close";
    this.bsModalRef.content.title = "Delete Confirmation";
    this.bsModalRef.content.info = "Are you sure you want to delete " + contact.name + " ?";
    this.bsModalRef.content.event.subscribe(res => {
      console.log('res', res);
      if (res === 200) {
        this.deleteContact(contact.id);
      }
    }, error => {
      this.errorDialog("Error", error);
    });
  }

  errorDialog(errTitle, errInfo) {
    this.bsModalRef = this.modalService.show(DialogComponent, Object.assign({}, { class: 'modal-dialog-centered' }));
    this.bsModalRef.content.closeBtnName = "Ok";
    this.bsModalRef.content.title = errTitle;
    this.bsModalRef.content.info = errInfo;
  }

}
