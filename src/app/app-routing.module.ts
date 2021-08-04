import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'personal',
    loadChildren: () =>
      import('./personal/personal.module').then(m => m.PersonalModule)
  },
  {
    path: 'address',
    loadChildren: () =>
      import('./address/address.module').then(m => m.AddressModule)
  },
  {
    path: 'experience',
    loadChildren: () =>
      import('./experience/experience.module').then(m => m.ExperienceModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
