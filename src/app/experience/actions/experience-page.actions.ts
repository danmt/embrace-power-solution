import { createAction, props } from '@ngrx/store';
import { Experience } from 'src/app/core/interfaces/experience.interface';

export const patch = createAction(
  '[Experience Page] Patch Value',
  props<{ payload: Partial<Experience> }>()
);

export const changeValidationStatus = createAction(
  '[Experience Page] Change Validation Status',
  props<{ isValid: boolean }>()
);

export type Union = ReturnType<typeof patch | typeof changeValidationStatus>;
