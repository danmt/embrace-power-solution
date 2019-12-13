import { Experience } from '../interfaces/experience.interface';

export class ExperienceGroup {
  data = {
    degree: '',
    years: 1,
    status: '',
    reference: ''
  } as Experience;
  isValid = false;
}
