import { RouteRecordRaw } from 'vue-router'
import { cloneDeep } from 'lodash'

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

export const arrangementRoutesInQrMenu = cloneDeep(arrangementRoutes)
arrangementRoutesInQrMenu[0].path = 'qr_menu/arrangement'
arrangementRoutesInQrMenu[0].name = 'qrMenuArrangementPage'
