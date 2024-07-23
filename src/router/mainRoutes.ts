import {
  arrangementRoutes,
  arrangementRoutesInQrMenu,
} from 'src/router/arrangementRoutes'
import { clone, cloneDeep, isEqual } from 'lodash'
import {
  RouteRecordRaw,
} from 'vue-router'

// todo было бы неплохо разбить этот файл по нескольким файлам :)

export const mainRoutes = [
  {
    path: '',
    name: 'home',
    component: () => import('src/pages/home/Home.vue'),
  },
  {
    path: 'categories/:_categoryId',
    name: 'home__withCategories',
    component: () => import('src/pages/home/Home.vue'),
  },
  {
    path: 'categories/:_categoryId/products/:_productId',
    name: 'home__withCategories__withProducts',
    component: () => import('src/pages/home/Home.vue'),
  },
  {
    path: 'news/:_newsId',
    name: 'home__withNews',
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
  // {
  //   path: 'news/:newsId',
  //   name: 'newsPage',
  //   component: () => import('src/pages/news/NewsPage.vue'),
  // },

  {
    path: 'my_qr',
    name: 'myQrPage',
    component: () => import('src/pages/loyaltyCard/LoyaltyCardMyQr.vue'),
  },
  ...arrangementRoutes,
  ...arrangementRoutesInQrMenu,
]

interface RouteNameModifier {
  routeKey: string
  routeParam: string
  canBeMixed: boolean
}

class RouteNameModifierManager {
  private _registered: RouteNameModifier[] = []

  get registered() {
    return Object.freeze(clone(this._registered))
  }

  get(key: string) {
    const el = this._registered.find((v) => v.routeKey === key)
    if (!el) throw Error('Item not registered')
    return el
  }

  register(key: string, param: string, canBeMixed = false, ) {
    this._registered.push({
      routeKey: key,
      routeParam: param,
      canBeMixed,
    })
  }

  isRegistered(key: string, param?: string) {
    this._registered.find(
      (v) =>
        v.routeKey === key && ((v.routeParam === param && param) || !param),
    )
  }

  getRouteVariables(name: string) {
    const res = [name]
    const forMix = this._registered
      .filter((v) => v.canBeMixed)
    for (const v of this._registered) res.push(name + v.routeKey)
    for (const v of forMix) {
      // пока так сойдет
      const other = forMix.filter((el) => !isEqual(v, el))
      for (const el of other) {
        res.push(name + v.routeKey + el.routeKey)
      }
    }
    return res
  }
}

export const routeNameModifierManager = new RouteNameModifierManager()
routeNameModifierManager.register('__withCity', '_cityId', true)
routeNameModifierManager.register('__withCompany', '_companyId', true)

export const withCityRouteKey =
  routeNameModifierManager.get('__withCity').routeKey
export const cityRouteParamKey =
  routeNameModifierManager.get('__withCity').routeParam
export const withCompanyRouteKey =
  routeNameModifierManager.get('__withCompany').routeKey
export const companyRouteParamKey =
  routeNameModifierManager.get('__withCompany').routeParam

const processChildren = (parent: RouteRecordRaw, key: string) => {
  if (!parent.children) return
  for (const el of parent.children) {
    if (el.name && typeof el.name === 'string') el.name += key
    processChildren(el, key)
  }
}

export const processRoutes = (routes = mainRoutes) => {
  const _routes = cloneDeep(routes)
  const res: typeof _routes = []
  for (const route of _routes) {
    let lastRoute: RouteRecordRaw | null = null
    for (const keyData of routeNameModifierManager.registered) {
      const _route = cloneDeep(route)
      const key = keyData.routeKey
      const keyId = keyData.routeParam
      if (_route.name && typeof _route.name === 'string') _route.name += key
      if (_route.redirect) processRedirect(_route, key)
      _route.path = `:${keyId}/${_route.path}`
      processChildren(_route, key)
      if (lastRoute && typeof lastRoute.name === 'string') {
        const path = lastRoute.path.split('/')
        path.splice(1, 0, `:${keyId}`)
        lastRoute.path = path.join('/')
        lastRoute.name += key
        if (lastRoute.redirect) processRedirect(lastRoute, key)
        res.push(lastRoute)
      }
      lastRoute = cloneDeep(_route)
      res.push(_route)
    }
  }
  return res
}

const processRedirect = (route: RouteRecordRaw, key: string) => {
  const redirect = route.redirect as
    | ({ name: string } & Record<string, any>)
    | undefined
  if (redirect?.name) redirect.name += key
}

// void mainRoutesWithCity
