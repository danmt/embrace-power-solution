import { Personal } from '../interfaces/personal.interface';
export class PersonalGroup {
  data = {
    firstName: '',
    lastName: '',
    age: 18,
    about: ''
  } as Personal;
  isValid = false;
}
