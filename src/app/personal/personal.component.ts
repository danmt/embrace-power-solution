import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../core/state';
import { PersonalPageActions } from './actions';
import { map, take, distinctUntilChanged } from 'rxjs/operators';
import { merge } from 'rxjs';
import { Personal } from '../core/interfaces/personal.interface';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
  title = 'Personal';
  personalForm = this.fb.group(
    {
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      age: [
        null,
        [Validators.required, Validators.min(18), Validators.max(120)]
      ],
      about: [null, [Validators.required]]
    },
    {
      updateOn: 'blur'
    }
  );
  firstNameCtrl = this.personalForm.get('firstName');
  lastNameCtrl = this.personalForm.get('lastName');
  ageCtrl = this.personalForm.get('age');
  aboutCtrl = this.personalForm.get('about');
  submitted = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.store
      .select(fromRoot.selectPersonalGroupData)
      .pipe(take(1))
      .subscribe((personal: Personal) =>
        this.personalForm.patchValue(personal, { emitEvent: false })
      );

    const firstName$ = this.firstNameCtrl.valueChanges.pipe(
      map((firstName: string) => ({ firstName } as Partial<Personal>))
    );
    const lastName$ = this.lastNameCtrl.valueChanges.pipe(
      map((lastName: string) => ({ lastName } as Partial<Personal>))
    );
    const age$ = this.ageCtrl.valueChanges.pipe(
      map((age: number) => ({ age } as Partial<Personal>))
    );
    const about$ = this.aboutCtrl.valueChanges.pipe(
      map((about: string) => ({ about } as Partial<Personal>))
    );

    merge(firstName$, lastName$, age$, about$).subscribe(
      (payload: Partial<Personal>) => {
        this.store.dispatch(PersonalPageActions.patch({ payload }));
      }
    );

    this.personalForm.valueChanges
      .pipe(
        map(() => this.personalForm.valid),
        distinctUntilChanged()
      )
      .subscribe((isValid: boolean) =>
        this.store.dispatch(
          PersonalPageActions.changeValidationStatus({ isValid })
        )
      );
  }

  goToNextStep() {
    if (this.personalForm.invalid) {
      this.submitted = true;
      return;
    }

    this.router.navigate(['address']);
  }
}
