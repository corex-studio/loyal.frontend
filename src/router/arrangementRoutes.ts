import { RouteRecordRaw } from 'vue-router'

export const arrangementRoutes: RouteRecordRaw[] = [
  {
    path: 'arrangement',
    name: 'arrangementPage',
    component: () => import('src/pages/arrangement/ArrangementPage.vue'),
    redirect: {
      name: 'orderingPage',
    },
    children: [
      {
        path: 'ordering',
        name: 'orderingPage',
        component: () =>
          import('src/pages/arrangement/ArrangementOrdering.vue'),
      },
      {
        path: 'success_order/:orderId',
        name: 'successOrderPage',
        component: () => import('src/pages/arrangement/ArrangementSuccess.vue'),
      },
    ],
  },
]

export const arrangementRoutesInQrMenu: RouteRecordRaw[] = [
  {
    path: 'qr_menu/arrangement',
    name: 'qrMenuArrangementPage',
    component: () => import('src/pages/arrangement/ArrangementPage.vue'),
    redirect: {
      name: 'qrMenuOrderingPage',
    },
    children: [
      {
        path: 'ordering',
        name: 'qrMenuOrderingPage',
        component: () =>
          import('src/pages/arrangement/ArrangementOrdering.vue'),
      },
      {
        path: 'success_order/:orderId',
        name: 'qrMenuSuccessOrderPage',
        component: () => import('src/pages/arrangement/ArrangementSuccess.vue'),
      },
    ],
  },
]
