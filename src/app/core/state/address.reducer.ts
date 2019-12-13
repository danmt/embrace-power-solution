import { createReducer, on } from '@ngrx/store';
import { AddressPageActions } from 'src/app/address/actions';
import { AddressGroup } from '../models/address.model';
import { Address } from '../interfaces/address.interface';

export interface State {
  data: Address;
  isValid: boolean;
}

const initialState = new AddressGroup();

const addressReducer = createReducer(
  initialState,
  on(
    AddressPageActions.patch,
    (state: State, action: ReturnType<typeof AddressPageActions.patch>) => ({
      ...state,
      data: { ...state.data, ...action.payload }
    })
  ),
  on(
    AddressPageActions.changeValidationStatus,
    (
      state: State,
      { isValid }: ReturnType<typeof AddressPageActions.changeValidationStatus>
    ) => ({
      ...state,
      isValid
    })
  )
);

export function reducer(state: State, action: AddressPageActions.Union) {
  return addressReducer(state, action);
}

export const selectAddressGroupData = (state: State) => state.data;
export const selectAddressGroupIsValid = (state: State) => state.isValid;
