import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../core/state';
import { take, map, distinctUntilChanged } from 'rxjs/operators';
import { Experience } from '../core/interfaces/experience.interface';
import { ExperiencePageActions } from './actions';
import { merge } from 'rxjs';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {
  title = 'Experience';
  experienceForm = this.fb.group(
    {
      degree: [null, [Validators.required]],
      years: [null, [Validators.required]],
      status: [null, [Validators.required]],
      reference: [null, [Validators.required]]
    },
    {
      updateOn: 'blur'
    }
  );
  degreeCtrl = this.experienceForm.get('degree');
  yearsCtrl = this.experienceForm.get('years');
  statusCtrl = this.experienceForm.get('status');
  referenceCtrl = this.experienceForm.get('reference');
  submitted = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.store
      .select(fromRoot.selectExperienceGroupData)
      .pipe(take(1))
      .subscribe((experience: Experience) =>
        this.experienceForm.patchValue(experience, { emitEvent: false })
      );

    const degree$ = this.degreeCtrl.valueChanges.pipe(
      map((degree: string) => ({ degree } as Partial<Experience>))
    );
    const years$ = this.yearsCtrl.valueChanges.pipe(
      map((years: number) => ({ years } as Partial<Experience>))
    );
    const status$ = this.statusCtrl.valueChanges.pipe(
      map((status: string) => ({ status } as Partial<Experience>))
    );
    const reference$ = this.referenceCtrl.valueChanges.pipe(
      map((reference: string) => ({ reference } as Partial<Experience>))
    );

    merge(degree$, years$, status$, reference$).subscribe(
      (payload: Partial<Experience>) => {
        this.store.dispatch(ExperiencePageActions.patch({ payload }));
      }
    );

    this.experienceForm.valueChanges
      .pipe(
        map(() => this.experienceForm.valid),
        distinctUntilChanged()
      )
      .subscribe((isValid: boolean) =>
        this.store.dispatch(
          ExperiencePageActions.changeValidationStatus({ isValid })
        )
      );
  }

  goToPreviousStep() {
    this.router.navigate(['address']);
  }

  goToNextStep() {
    if (this.experienceForm.invalid) {
      this.submitted = true;
      return;
    }

    console.log('we are done');
  }
}
