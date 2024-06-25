/* eslint-disable */
import { lazy } from 'react';
import { USER_ROLE } from 'constants.js';
import { DEFAULT_PATHS } from 'config.js';

const token = localStorage.getItem('token');

const dashboard = {
  analysis: lazy(() => import('views/dashboard/DashboardAnalysis')),
};

const services = {
  sender: lazy(() => import('views/services/Sender')),
  senderAdd: lazy(() => import('views/services/AddSender')),
  recipients: lazy(() => import('views/services/Recipients')),
  sendMail: lazy(() => import('views/services/SendMail')),
  mail: lazy(() => import('views/services/Mail')),
  mailDetails: lazy(() => import('views/services/MailDetails')),
  recipientsgroup: lazy(() => import('views/services/RecipientsGroup')),
};
const appRoot = DEFAULT_PATHS.APP.endsWith('/') ? DEFAULT_PATHS.APP.slice(1, DEFAULT_PATHS.APP.length) : DEFAULT_PATHS.APP;

const routesAndMenuItems = {
  mainMenuItems: [
    {
      path: DEFAULT_PATHS.APP,
      exact: true,
      redirect: true,
      to: `${appRoot}/dashboard`,
    },
    // {
    //   path: '/sender',
    //   label: 'Sender',
    //   icon: 'user',
    //   component: services.sender,
    //   subs: [{ path: '/add', label: 'menu.sender-add', hideInMenu: true, component: services.senderAdd }],
    // },
  ],

  sidebarItems: [
    {
      path: `${appRoot}/dashboard`,
      label: 'Dashboard',
      icon: 'grid-1',
      exact: true,
      redirect: true,
      to: `${appRoot}/dashboard/stats`,
      subs: [{ path: '/stats', label: 'Dashboard', icon: 'chart-4', component: dashboard.analysis }],
    },
    {
      path: `${appRoot}/services`,
      label: 'Services',
      icon: 'grid-1',
      exact: true,
      redirect: true,
      to: `${appRoot}/services/sender`,
      subs: [
        {
          path: '/sender',
          label: 'Sender',
          icon: 'user',
          component: services.sender,
          subs: [{ path: '/add', label: 'menu.sender-add', hideInMenu: true, component: services.senderAdd }],
        },
        {
          path: '/recipientsgroup',
          label: 'Recipient Group',
          icon: 'user',
          component: services.recipientsgroup,
        },
        {
          path: '/recipients',
          label: 'Recipient',
          icon: 'user',
          component: services.recipients,
        },
        { path: '/sendMail', label: 'Send Mail', icon: 'router', component: services.sendMail, hideInMenu: true },
        { path: '/mailDetails/:id', label: 'Send Mail', icon: 'router', component: services.mailDetails, hideInMenu: true },
        { path: '/mail', label: 'E-Mail', icon: 'email', component: services.mail },
      ],
    },
  ],
};

export default routesAndMenuItems;
