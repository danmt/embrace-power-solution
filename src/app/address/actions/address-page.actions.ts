import { createAction, props } from '@ngrx/store';
import { Address } from 'src/app/core/interfaces/address.interface';

export const patch = createAction(
  '[Address Page] Patch Value',
  props<{ payload: Partial<Address> }>()
);

export const changeValidationStatus = createAction(
  '[Address Page] Change Validation Status',
  props<{ isValid: boolean }>()
);

export type Union = ReturnType<typeof patch | typeof changeValidationStatus>;
