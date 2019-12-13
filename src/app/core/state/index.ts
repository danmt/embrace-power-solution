import { ActionReducerMap, createSelector, MetaReducer } from '@ngrx/store';
import * as fromPersonal from './personal.reducer';
import * as fromAddress from './address.reducer';
import { PersonalGroup } from '../models/personal.model';
import { AddressGroup } from '../models/address.model';

export interface State {
  personal: PersonalGroup;
  address: AddressGroup;
}

export const reducers: ActionReducerMap<State> = {
  personal: fromPersonal.reducer,
  address: fromAddress.reducer
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
