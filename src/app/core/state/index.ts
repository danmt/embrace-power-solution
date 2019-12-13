import { ActionReducerMap, createSelector, MetaReducer } from '@ngrx/store';
import * as fromPersonal from './personal.reducer';
import { PersonalGroup } from '../models/personal.model';

export interface State {
  personal: PersonalGroup;
}

export const reducers: ActionReducerMap<State> = {
  personal: fromPersonal.reducer
};

export const metaReducers: MetaReducer<State>[] = [];

export const selectPersonalGroup = (state: State) => state.personal;
export const selectPersonalGroupData = createSelector(
  selectPersonalGroup,
  fromPersonal.selectPersonalGroupData
);
export const selectPersonalGroupIsValid = createSelector(
  selectPersonalGroup,
  fromPersonal.selectPersonalGroupIsValid
);
