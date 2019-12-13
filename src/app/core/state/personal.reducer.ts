import { createReducer, on } from '@ngrx/store';
import { PersonalPageActions } from '../../personal/actions';
import { Personal } from '../interfaces/personal.interface';
import { PersonalGroup } from '../models/personal.model';

export interface State {
  data: Personal;
  isValid: boolean;
}

const initialState = new PersonalGroup();

const personalReducer = createReducer(
  initialState,
  on(
    PersonalPageActions.patch,
    (state: State, action: ReturnType<typeof PersonalPageActions.patch>) => ({
      ...state,
      data: { ...state.data, ...action.payload }
    })
  ),
  on(
    PersonalPageActions.changeValidationStatus,
    (
      state: State,
      { isValid }: ReturnType<typeof PersonalPageActions.changeValidationStatus>
    ) => ({
      ...state,
      isValid
    })
  )
);

export function reducer(state: State, action: PersonalPageActions.Union) {
  return personalReducer(state, action);
}

export const selectPersonalGroupData = (state: State) => state.data;
export const selectPersonalGroupIsValid = (state: State) => state.isValid;
