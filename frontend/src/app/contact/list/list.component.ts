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
  contactData: Contact[] = []; // contacts to bind in table after searching
  searchText = '';
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

}
