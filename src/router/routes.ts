import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/layouts/BaseLayout.vue'),
    children: [
      {
        path: '',
        name: 'testPage',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'menu',
        name: 'menuPage',
        component: () => import('src/pages/MenuPage.vue'),
      },
      {
        path: 'category/:categoryId',
        name: 'categoryPage',
        component: () => import('src/pages/CategoryMenu.vue'),
      },
    ],
  },
  {
    path: '/:externalId/stores',
    name: 'storesPage',
    component: () => import('pages/StoresPage.vue'),
  },
  {
    path: '/:externalId/policy',
    name: 'policyPage',
    component: () => import('pages/PolicyPage.vue'),
  },
  {
    path: '/:externalId/terms_of_service',
    name: 'termsOfServicePage',
    component: () => import('pages/TermsOfServicePage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
