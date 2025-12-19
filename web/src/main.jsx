import React from 'react';
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App';
import Layout01 from './layout/Layout1';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Layout2 from './layout/Layout2';
import Index from './pages/IndexPage';
import NotFound from './pages/NotFound';
import ReportPage from './pages/ReportPage';
import AllissuePage from './pages/AllissuePage';
import ViewPage from './pages/ViewPage';
import ProfilePage from './pages/ProfilePage';
import { IssueModalProvider } from './context/IssueModalContext';
import NotificationsPage from './pages/NotificationsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout01 />,
    children: [
      { index: true, element: <App /> },
      { path: 'auth/login', element: <Login /> },
      { path: 'auth/register', element: <Register /> }
    ]
  },
  {
    path: 'index',
    element: <Layout2 />,
    children: [
      { index: true, element: <Index /> },
      { path: "/index/report", element: <ReportPage /> },
      { path: "/index/all-issues", element: <AllissuePage /> },
      { path: "/index/post/:id", element: <ViewPage />},
      { path: "/index/profile", element: <ProfilePage />},
      { path: "/index/notifications", element: <NotificationsPage />},
      { path: "*", element: <NotFound />}
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <IssueModalProvider>
      <RouterProvider router={router} />
    </IssueModalProvider>
  </React.StrictMode>
);