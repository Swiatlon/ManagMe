import { useForm, FormProvider, type SubmitHandler } from 'react-hook-form';
import { Box, Typography, Button, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import ExampleUserIcon from '../../../assets/icons/exampleUserIcon.png';
import { loginValidationSchema } from './schema/Login.Yup';
import './styles/AuthPanel.scss';
import { useLoginMutation } from '../../../redux/apiSlices/auth.api.slice';
import RHFTextField from '../../shared/formComponents/textField/RHFTextField';
import PasswordField from './elements/PasswordField';

const Login = () => {
  const navigate = useNavigate();
  const [loginUser] = useLoginMutation();

  const methods = useForm<ILoginFields>({
    resolver: yupResolver(loginValidationSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<ILoginFields> = async data => {
    const { login, password } = data;

    await loginUser({
      identifier: login,
      password,
    });
  };

  const handleCreateAccountClick = () => {
    navigate('/register'); // or whatever your signup route is
  };

  return (
    <FormProvider {...methods}>
      <Paper className="LoginForm" component="form" onSubmit={methods.handleSubmit(onSubmit)}>
        <Box component="img" src={ExampleUserIcon} sx={{ width: '86px' }} />
        <Typography variant="h4" color="primary">
          Login Form
        </Typography>
        <RHFTextField name="login" label={'Username'} fullWidth />
        <PasswordField name="password" label={'Password'} />
        <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '16px' }}>
          Want to create an account?{' '}
          <Link
            component="button"
            type="button"
            onClick={handleCreateAccountClick}
            sx={{
              cursor: 'pointer',
              textDecoration: 'underline',
              '&:hover': {
                textDecoration: 'none'
              }
            }}
          >
            Sign up here
          </Link>
        </Typography>
        <Button fullWidth size="large" type="submit" variant="contained">
          Login
        </Button>
      </Paper>
    </FormProvider>
  );
};

export default Login;

export interface ILoginFields {
  login: string;
  password: string;
}
