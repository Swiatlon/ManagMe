import { VisibilityOff, Visibility } from '@mui/icons-material';
import { InputAdornment, IconButton, type TextFieldProps } from '@mui/material';
import { usePasswordToggle } from '../../../../hooks/usePasswordVisibility/usePasswordVisibility';
import RHFTextField from '../../../shared/formComponents/textField/RHFTextField';

interface RHFTextFieldProps extends Omit<TextFieldProps, 'name'> {
  name: string;
}

const PasswordField = ({ name, ...props }: RHFTextFieldProps) => {
  const { showPassword, togglePasswordVisibility } = usePasswordToggle();

  return (
    <RHFTextField
      {...props}
      name={name}
      type={showPassword ? 'text' : 'password'}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={togglePasswordVisibility} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordField;
