import {
  arrangementRoutes,
  arrangementRoutesInQrMenu,
} from 'src/router/arrangementRoutes'
import { cloneDeep } from 'lodash'
import { RouteRecordRaw } from 'vue-router'

export const mainRoutes = [
  {
    path: '',
    name: 'home',
    component: () => import('src/pages/home/Home.vue'),
  },
  {
    path: 'profile',
    name: 'profilePage',
    redirect: {
      name: 'profileData',
    },
    children: [
      {
        path: 'data',
        name: 'profileData',
        component: () => import('src/pages/profile/ProfileData.vue'),
      },
      {
        path: 'orders',
        name: 'ordersHistory',
        component: () => import('src/pages/profile/ProfileOrdersHistory.vue'),
      },
      // {
      //   path: 'cards',
      //   name: 'profileCards',
      //   component: () => import('src/pages/profile/ProfileMyCards.vue'),
      // },
      {
        path: 'addresses',
        name: 'profileAddresses',
        component: () =>
          import('src/pages/profile/ProfileDeliveryAddresses.vue'),
      },
    ],
    component: () => import('src/pages/profile/ProfilePage.vue'),
  },
  {
    path: 'about',
    name: 'aboutUs',
    component: () => import('src/pages/profile/ProfileAboutUs.vue'),
    // meta: {
    //   title: 'О нас',
    //   description: 'Страница с данными о компании',
    //   keywords: '',
    // },
  },
  {
    path: 'news/:newsId',
    name: 'newsPage',
    component: () => import('src/pages/news/NewsPage.vue'),
  },

  {
    path: 'my_qr',
    name: 'myQrPage',
    component: () => import('src/pages/loyaltyCard/LoyaltyCardMyQr.vue'),
  },
  ...arrangementRoutes,
  ...arrangementRoutesInQrMenu,
]

export const withCityRouteKey = '__withCity'

export const getRouteNameVariables = (name: string) => {
  return [name, name + withCityRouteKey]
}

const processChildren = (parent: RouteRecordRaw) => {
  if (!parent.children) return
  for (const el of parent.children) {
    if (el.name && typeof el.name === 'string') el.name += withCityRouteKey
    processChildren(el)
  }
}

export const mainRoutesWithCity = cloneDeep(mainRoutes).map((el) => {
  if (el.name && typeof el.name === 'string') el.name += withCityRouteKey
  const redirect = el.redirect as
    | ({ name: string } & Record<string, any>)
    | undefined
  if (redirect?.name) redirect.name += withCityRouteKey
  el.path = `:_cityId/${el.path}`
  processChildren(el)
  return el
})

void mainRoutesWithCity
