import * as Yup from 'yup';
import { Role } from '../../../../contract/enums';

export const registerValidationSchema = Yup.object().shape({
  identifier: Yup.string()
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
  firstName: Yup.string()
    .required('First name is required'),
  lastName: Yup.string()
    .required('Last name is required'),
  role: Yup.mixed<Role>()
    .oneOf(Object.values(Role), 'Please select a valid role')
    .required('Role is required'),
});
