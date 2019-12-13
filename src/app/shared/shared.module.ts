import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardStepComponent } from './wizard-step/wizard-step.component';



@NgModule({
  declarations: [WizardStepComponent],
  imports: [
    CommonModule
  ],
  exports: [WizardStepComponent]
})
export class SharedModule { }
