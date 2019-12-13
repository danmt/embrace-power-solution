import { createReducer, on } from '@ngrx/store';
import { ExperiencePageActions } from 'src/app/experience/actions';
import { ExperienceGroup } from '../models/experience.model';
import { Experience } from '../interfaces/experience.interface';

export interface State {
  data: Experience;
  isValid: boolean;
}

const initialState = new ExperienceGroup();

const experienceReducer = createReducer(
  initialState,
  on(
    ExperiencePageActions.patch,
    (state: State, action: ReturnType<typeof ExperiencePageActions.patch>) => ({
      ...state,
      data: { ...state.data, ...action.payload }
    })
  ),
  on(
    ExperiencePageActions.changeValidationStatus,
    (
      state: State,
      {
        isValid
      }: ReturnType<typeof ExperiencePageActions.changeValidationStatus>
    ) => ({
      ...state,
      isValid
    })
  )
);

export function reducer(state: State, action: ExperiencePageActions.Union) {
  return experienceReducer(state, action);
}

export const selectExperienceGroupData = (state: State) => state.data;
export const selectExperienceGroupIsValid = (state: State) => state.isValid;
