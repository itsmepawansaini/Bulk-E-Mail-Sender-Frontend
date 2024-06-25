import { LAYOUT, MENU_BEHAVIOUR, NAV_COLOR, MENU_PLACEMENT, RADIUS, THEME_COLOR, USER_ROLE } from 'constants.js';

export const IS_DEMO = false;
export const IS_AUTH_GUARD_ACTIVE = true;
export const SERVICE_URL = '/app';
export const USE_MULTI_LANGUAGE = false;

export const REACT_HELMET_PROPS = {
  defaultTitle: 'Bulk Mail Sender',
  titleTemplate: 'Bulk Mail Sender',
};

export const DEFAULT_PATHS = {
  APP: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  USER_WELCOME: '/dashboards/default',
  NOTFOUND: '/page-not-found',
  UNAUTHORIZED: '/unauthorized',
  INVALID_ACCESS: '/invalid-access',
};

export const DEFAULT_SETTINGS = {
  MENU_PLACEMENT: MENU_PLACEMENT.Horizontal,
  MENU_BEHAVIOUR: MENU_BEHAVIOUR.Pinned,
  LAYOUT: LAYOUT.Boxed,
  RADIUS: RADIUS.Rounded,
  COLOR: THEME_COLOR.LightGreen,
  NAV_COLOR: NAV_COLOR.Light,
  USE_SIDEBAR: true,
};

export const DEFAULT_USER = {
  id: 1,
  name: 'Pawan Saini',
  thumb: '/img/profile/profile-9.webp',
  role: USER_ROLE.Admin,
  email: 'itspawansaini@gmail.com',
};

export const REDUX_PERSIST_KEY = 'service-provider';
