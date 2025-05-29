import { createBrowserRouter, Outlet } from 'react-router-dom';
import PostAuthLayout from '../layouts/postAuth/PostAuthLayout';
import PreAuthLayout from '../layouts/preAuth/PreAuthLayout';
import PersistLoginMiddleware from '../middlewares/persistLogin/PersistLogin.Middleware';
import ProtectedRoutesMiddleware from '../middlewares/protectedRoutes/ProtectedRoutes.Middleware';
import ErrorPage from '../components/shared/errorPage/ErrorPage';
import { indexPostAuthConfig } from './routesConfigs/index-post-auth.config';
import { indexPreAuthConfig } from './routesConfigs/index-pre-auth.config';
import { loginConfig } from './routesConfigs/login.config';
import { logoutConfig } from './routesConfigs/logout.config';
import { registerConfig } from './routesConfigs/register.config';
import { storiesConfig } from './routesConfigs/stories.config';
import { projectsConfig } from './routesConfigs/projects.config';
import { tasksConfig } from './routesConfigs/tasks.config';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <PersistLoginMiddleware />,
        children: [
          {
            path: '',
            element: <PreAuthLayout />,
            children: [indexPreAuthConfig, loginConfig, registerConfig],
          },
          {
            path: 'postAuth',
            element: <ProtectedRoutesMiddleware />,
            children: [
              {
                element: <PostAuthLayout />,
                children: [
                  indexPostAuthConfig,
                  logoutConfig,
                  storiesConfig,
                  projectsConfig,
                  tasksConfig
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
