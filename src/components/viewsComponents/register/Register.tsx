import { useForm, FormProvider, type SubmitHandler } from 'react-hook-form';
import { Box, Typography, Button, Paper, Link, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import ExampleUserIcon from '../../../assets/icons/exampleUserIcon.png';
import { IRegisterRequest, useRegisterMutation } from '../../../redux/apiSlices/auth.api.slice';
import RHFTextField from '../../shared/formComponents/textField/RHFTextField';
import { registerValidationSchema } from './schema/Register.Yup';
import PasswordField from './elements/PasswordField';
import { Role } from '../../../contract/enums';
import './styles/AuthPanel.scss';

const Register = () => {
  const navigate = useNavigate();
  const [registerUser] = useRegisterMutation();

  const methods = useForm<IRegisterRequest>({
    resolver: yupResolver(registerValidationSchema),
    defaultValues: {
      identifier: '',
      password: '',
      firstName: '',
      lastName: '',
      role: Role.Developer
    },
  });

  const onSubmit: SubmitHandler<IRegisterRequest> = async data => {
    const { identifier, password, firstName, lastName, role } = data;

    await registerUser({
      identifier,
      password,
      firstName,
      lastName,
      role,
    });
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <FormProvider {...methods}>
      <Paper className="RegisterForm" component="form" onSubmit={methods.handleSubmit(onSubmit)}>
        <Box component="img" src={ExampleUserIcon} sx={{ width: '86px' }} />
        <Typography variant="h4" color="primary">
          Register Form
        </Typography>
        <RHFTextField name="identifier" label="Identifier" fullWidth type="identifier" />
        <PasswordField name="password" label="Password" />
        <RHFTextField name="firstName" label="First Name" fullWidth />
        <RHFTextField name="lastName" label="Last Name" fullWidth />
        <RHFTextField
          name="role"
          label="Role"
          fullWidth
          select
        >
          {Object.values(Role).map((role) => (
            <MenuItem key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
            </MenuItem>
          ))}
        </RHFTextField>
        <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '16px' }}>
          Already have an account?{' '}
          <Link
            component="button"
            type="button"
            onClick={handleLoginClick}
            sx={{
              cursor: 'pointer',
              textDecoration: 'underline',
              '&:hover': {
                textDecoration: 'none'
              }
            }}
          >
            Sign in here
          </Link>
        </Typography>
        <Button fullWidth size="large" type="submit" variant="contained">
          Register
        </Button>
      </Paper>
    </FormProvider>
  );
};

export default Register;
