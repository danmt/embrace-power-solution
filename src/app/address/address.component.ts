import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  title = 'Address';
  addressForm = this.fb.group(
    {
      country: [null, [Validators.required]],
      state: [null, [Validators.required]],
      city: [null, [Validators.required]],
      street: [null, [Validators.required]],
      building: [null, [Validators.required]]
    },
    {
      updateOn: 'blur'
    }
  );
  countryCtrl = this.addressForm.get('country');
  stateCtrl = this.addressForm.get('state');
  cityCtrl = this.addressForm.get('city');
  streetCtrl = this.addressForm.get('street');
  buildingCtrl = this.addressForm.get('building');
  submitted = false;

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit() {}

  goToNextStep() {
    if (this.addressForm.invalid) {
      this.submitted = true;
      return;
    }

    this.router.navigate(['experience']);
  }

  goToPreviousStep() {
    this.router.navigate(['personal']);
  }
}
