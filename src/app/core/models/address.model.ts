import { Address } from '../interfaces/address.interface';

export class AddressGroup {
  data = {
    country: '',
    state: '',
    city: '',
    street: '',
    building: ''
  } as Address;
  isValid = false;
}
