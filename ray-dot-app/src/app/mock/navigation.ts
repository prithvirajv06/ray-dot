import { Navigation } from '../interface/navigation';

export const navigation: Navigation[] = [
  {
    label: 'Dashboard',
    icon: getIconStr('gauge'),
    route: 'dashboard',
  },
  {
    label: 'Data Model',
    icon: getIconStr('code'),
    route: 'data-model',
  },
  {
    label: 'Reference Data',
    icon: getIconStr('database'),
    route: 'reference-data',
  },
  {
    label: 'If-Then Logic',
    icon: getIconStr('project-diagram'),
    route: 'if-then',
  },
  {
    label: 'Decision Table',
    icon: getIconStr('table'),
    route: 'decision-table',
  },
  {
    label: 'Rule Builder',
    icon: getIconStr('balance-scale'),
    route: 'rule-builder',
  },
  {
    label: 'Form Designer',
    icon: getIconStr('clipboard-list'),
    route: 'form-designer',
  },
  {
    label: 'Access Mgt.',
    icon: getIconStr('user-shield'),
    route: 'access-management',
  },
  {
    label: 'Notifications',
    icon: getIconStr('exclamation-triangle'),
    route: 'notification',
  },
  {
    label: 'Audit Logs',
    icon: getIconStr('history'),
    route: 'audit-logs',
  },
  {
    label: 'Reports',
    icon: getIconStr('chart-line'),
    route: 'report',
  },
];

export function getIconStr(iconName: string) {
  return 'fa-solid fa-' + iconName;
}
