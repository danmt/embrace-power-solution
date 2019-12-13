import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {}

  goToNextStep() {
    this.submitted = true;
  }

  ngOnInit() {
    // this method comes from OnInit interface
  }
}
