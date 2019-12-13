import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';

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

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit() {}

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
