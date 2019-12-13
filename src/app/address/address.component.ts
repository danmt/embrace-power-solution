import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../core/state';
import { Address } from '../core/interfaces/address.interface';
import { take, map, distinctUntilChanged } from 'rxjs/operators';
import { AddressPageActions } from './actions';
import { merge } from 'rxjs';

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

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.store
      .select(fromRoot.selectAddressGroupData)
      .pipe(take(1))
      .subscribe((address: Address) =>
        this.addressForm.patchValue(address, { emitEvent: false })
      );

    const country$ = this.countryCtrl.valueChanges.pipe(
      map((country: string) => ({ country } as Partial<Address>))
    );
    const state$ = this.stateCtrl.valueChanges.pipe(
      map((state: string) => ({ state } as Partial<Address>))
    );
    const city$ = this.cityCtrl.valueChanges.pipe(
      map((city: string) => ({ city } as Partial<Address>))
    );
    const street$ = this.streetCtrl.valueChanges.pipe(
      map((street: string) => ({ street } as Partial<Address>))
    );
    const building$ = this.buildingCtrl.valueChanges.pipe(
      map((building: string) => ({ building } as Partial<Address>))
    );

    merge(country$, state$, city$, street$, building$).subscribe(
      (payload: Partial<Address>) => {
        this.store.dispatch(AddressPageActions.patch({ payload }));
      }
    );

    this.addressForm.valueChanges
      .pipe(
        map(() => this.addressForm.valid),
        distinctUntilChanged()
      )
      .subscribe((isValid: boolean) =>
        this.store.dispatch(
          AddressPageActions.changeValidationStatus({ isValid })
        )
      );
  }

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
