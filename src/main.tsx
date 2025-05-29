/// <reference types="vite-plugin-svgr/client" />
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import SnackbarConfig from './configs/snackbar/SnackbarConfig';
import ReactDOM from 'react-dom/client';
import { store } from './redux/store';
import { router } from './routes/Router';
import theme from './theme/theme';
import './assets/styles/app.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <StyledEngineProvider injectFirst>
          <CssBaseline />
          <SnackbarConfig>
              <RouterProvider router={router} />
          </SnackbarConfig>
        </StyledEngineProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
