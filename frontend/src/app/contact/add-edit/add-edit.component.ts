import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

import { DialogComponent } from '../../shared/dialog/dialog.component';
import { ContactService } from '../contact.service';
import { Contact } from '../contact';
@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit {

  id: number;
  contacts: Contact[] = [];
  contact: Contact = {
    id: '',
    name: '',
    email: '',
    phone: ''
  };

  bsModalRef: BsModalRef;

  constructor(
    public contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['contactId'];
    if (this.id) {
      // get edit data by id
      this.contactService.find(this.id).subscribe((data: Contact) => {
        this.contact = data;
      }, error => {
        this.errorDialog("Error", error);
      });
    }
  }

  saveContact() {
    this.contactService.getAll().subscribe((data: any[]) => {
      this.contacts = data || [];
      if (this.hasSameError('phone') && this.hasSameError('email')) {
        this.errorDialog("Input Error", "The same email and phone number already exist. ");
      } else if (this.hasSameError('email')) {
        this.errorDialog("Input Error", "The same email already exists. ");
      } else if (this.hasSameError('phone')) {
        this.errorDialog("Input Error", "The same phone number already exists. ");
      } else {
        if (!this.id) {
          this.createContact();
        } else {
          this.updateContact();
        }
      }
    }, error => {
      this.errorDialog("Error", error);
    })
  }

  createContact() {
    this.contactService.create(this.contact).subscribe(res => {
      this.router.navigateByUrl('contact/list');
    }, error => {
      this.errorDialog("Error", error);
    })
  }

  updateContact() {
    this.contactService.update(this.id, this.contact).subscribe(res => {
      this.router.navigateByUrl('contact/list');
    }, error => {
      this.errorDialog("Error", error);
    })
  }

  // checking input phone number or email already exists in contants
  // dataName: phone or email
  hasSameError(dataName) {
    const sameIdx = this.contacts.findIndex(item => item[dataName] === this.contact[dataName]);
    return sameIdx > -1 && this.contact.id !== this.contacts[sameIdx].id;
  }

  cancel() {
    this.router.navigateByUrl('contact/list');
  }

  // dialog to display error message
  errorDialog(errTitle, errInfo) {
    this.bsModalRef = this.modalService.show(DialogComponent, Object.assign({}, { class: 'modal-dialog-centered' }));
    this.bsModalRef.content.closeBtnName = "Ok";
    this.bsModalRef.content.title = errTitle;
    this.bsModalRef.content.info = errInfo;
  }

}
