import { ActionReducerMap, createSelector, MetaReducer } from '@ngrx/store';
import * as fromPersonal from './personal.reducer';
import * as fromAddress from './address.reducer';
import * as fromExperience from './experience.reducer';
import { PersonalGroup } from '../models/personal.model';
import { AddressGroup } from '../models/address.model';
import { ExperienceGroup } from '../models/experience.model';

export interface State {
  personal: PersonalGroup;
  address: AddressGroup;
  experience: ExperienceGroup;
}

export const reducers: ActionReducerMap<State> = {
  personal: fromPersonal.reducer,
  address: fromAddress.reducer,
  experience: fromExperience.reducer
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

export const selectAddressGroup = (state: State) => state.address;
export const selectAddressGroupData = createSelector(
  selectAddressGroup,
  fromAddress.selectAddressGroupData
);
export const selectAddressGroupIsValid = createSelector(
  selectAddressGroup,
  fromAddress.selectAddressGroupIsValid
);

export const selectExperienceGroup = (state: State) => state.experience;
export const selectExperienceGroupData = createSelector(
  selectExperienceGroup,
  fromExperience.selectExperienceGroupData
);
export const selectExperienceGroupIsValid = createSelector(
  selectExperienceGroup,
  fromExperience.selectExperienceGroupIsValid
);
