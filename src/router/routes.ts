import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/UserLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: {
          requiresAuth: true,
        },
        name: 'HomePage',
      },
      {
        path: '/track-records',
        component: () => import('pages/user/track-record/IndexPage.vue'),
        meta: {
          requiresAdmin: true,
        },
        name: 'TrackRecordIndexPage',
      },
      {
        path: 'issue/:id/detail',
        component: () => import('pages/user/issue/DetailIssue.vue'),
        meta: {
          requiresAuth: true,
        },
        name: 'DetailIssuePage',
      },
      {
        path: '/dashboard',
        component: () => import('pages/IndexPage.vue'),
        meta: {
          requiresAuth: true,
        },
        name: 'UserDashboardPage',
      },
      {
        path: '/issue',
        component: () => import('pages/user/issue/IndexPage.vue'),
        meta: {
          requiresAdmin: true,
        },
        name: 'ManageIssue',
      },
      {
        path: '/issue/:id/quality-issue',
        component: () => import('pages/user/quality-issue/IndexPage.vue'),
        meta: {
          requiresAdmin: true,
        },
        name: 'ManageQualityIssue',
      },
      {
        path: '/quality-issue/:id',
        component: () => import('pages/user/quality-issue/DetailPage.vue'),
        meta: {
          requiresAuth: true,
        },
        name: 'QualityIssueDetailPage',
      },
      {
        path: '/profile',
        component: () => import('pages/user/profile/IndexPage.vue'),
        meta: {
          requiresAuth: true,
        },
        name: 'ProfileIndexPage',
      },
      {
        path: '/information/:id',
        component: () =>
          import('pages/user/information/DetailInformationPage.vue'),
        meta: {
          requiresAuth: true,
        },
        name: 'DetailInformationPage',
      },
      {
        path: '/information',
        component: () => import('pages/user/information/IndexPage.vue'),
        meta: {
          requiresAuth: true,
        },
        name: 'InformationIndexPage',
      },
      {
        path: 'manage-issue/:id/quality-issue',
        component: () =>
          import('pages/admin/features/quality-issue/IndexPage.vue'),
        name: 'AdminManageQualityIssueIndexPage',
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'manage-issue/:id/quality-issue/chart',
        component: () =>
          import('pages/admin/features/issue/IssueChartPage.vue'),
        name: 'AdminManageIssueChartPage',
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'issue/:issueId/memo',
        component: () => import('pages/manager/DetailListMemo.vue'),
        name: 'DetailListMemo',
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    meta: {
      requiresAdmin: true,
    },
    children: [
      {
        path: '',
        component: () => import('pages/admin/IndexPage.vue'),
        name: 'AdminHomePage',
      },
      {
        path: 'manage-user/',
        component: () => import('pages/admin/features/user/IndexPage.vue'),
        name: 'AdminManageUserIndexPage',
      },
      {
        path: 'manage-issue/',
        component: () => import('pages/admin/features/issue/IndexPage.vue'),
        name: 'AdminManageIssueIndexPage',
      },

      {
        path: 'manage-information/',
        component: () =>
          import('pages/admin/features/more-information/IndexPage.vue'),
        name: 'AdminManageManageInformationPage',
      },
      {
        path: 'manage-plant/',
        component: () => import('pages/admin/features/plant/IndexPage.vue'),
        name: 'ManagePlantIndexPage',
      },
    ],
  },

  {
    path: '/signin',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/auth/SignInPage.vue'),
        name: 'SignInPage',
        meta: {
          requiresGuest: true,
        },
      },
    ],
  },
  {
    path: '/signup',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/auth/SignUpPage.vue'),
        name: 'SignUpPage',
        meta: {
          requiresGuest: true,
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/notadmin',
    component: () => import('pages/NotAdminPage.vue'),
    name: 'NotAdminPage',
  },
  {
    path: '/unauthorized',
    component: () => import('pages/UnauthorizedPage.vue'),
    name: 'UnauthorizedPage',
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
