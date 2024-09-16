import { boot } from 'quasar/wrappers'
import {
  RouteLocationNamedRaw,
  RouteLocationRaw,
  Router as _Router,
} from 'vue-router'
import {
  cityRouteParamKey,
  companyRouteParamKey,
  withCityRouteKey,
  withCompanyRouteKey,
} from 'src/router/mainRoutes'
import { LocalStorage } from 'quasar'
import { clone, cloneDeep, merge } from 'lodash'

const routePriority = [
  // плохо, хз как лучше
  'withCategories',
  'withProducts',
  'withCity',
  'withCompany',
]

const prepareModifiers = (modifiers: string[], deleteItems: string[] = []) => {
  const res =  [...new Set(modifiers.sort((a, b) => routePriority.indexOf(a) - routePriority.indexOf(b)))]
  for (const toDelete of deleteItems) {
    const _toCheck = clone(toDelete).replace('__', '')
    const i = res.indexOf(_toCheck)
    if (i > -1) res.splice(i, 1)
  }
  return res
}

const processRouteLocation = (
  to: RouteLocationRaw,
  currentRouteName: string,
): RouteLocationRaw => {
  const cartCompany = LocalStorage.getItem('cartCompanyAlias') || LocalStorage.getItem('cartCompany')
  const city = LocalStorage.getItem('cityAlias') || LocalStorage.getItem('city')
  const isCityPage = currentRouteName.includes(withCityRouteKey)
  const isCompanyPage = currentRouteName.includes(withCompanyRouteKey)
  const isCityAndCompanyPage = isCityPage && isCompanyPage
  let routePostfix = ''
  if (isCityAndCompanyPage)
    routePostfix = withCityRouteKey + withCompanyRouteKey
  else if (isCityPage) routePostfix = withCityRouteKey
  else if (isCompanyPage) routePostfix = withCompanyRouteKey
  if (typeof to === 'string' && !to.includes(withCityRouteKey)) {
    return (to.split('__')[0] + routePostfix) as RouteLocationRaw
  }
  if (Object.keys(to).includes('name')) {
    const _to = to as { name: string, params?: Record<string, any> }
    const _toName = _to.name.split('__')[0]
    _to.name = _toName + routePostfix
    if (!_to.params) _to.params = {}
    if (isCityPage) _to.params._cityId = city
    if (isCompanyPage) _to.params._companyId = cartCompany

    return _to as RouteLocationRaw
  }
  return to as RouteLocationRaw
}

export default boot(({ app }) => {
  setTimeout(() => {
    const router = app.config.globalProperties.$router
    const getRouteName = () => String(app.config.globalProperties.$route.name)
    const getRouteParams = () => app.config.globalProperties.$route.params
    const getRouteMeta = () => app.config.globalProperties.$route.meta
    const getRouteQuery = () => app.config.globalProperties.$route.query

    const getRouteModifiers = (name = getRouteName(), ) => {
      name = clone(name)
      const startFrom = name.indexOf('__')
      if (startFrom > -1) {
        const res = name
          .slice(startFrom + 2)
          .split('__')
        res.sort((a, b) => routePriority.indexOf(a) - routePriority.indexOf(b))
        return res
      }
      return []
    }


    const prepareWithCityPageReplace = (): RouteLocationRaw => {
      const name = getRouteName().split('__')[0]
      const city =
        LocalStorage.getItem('cityAlias') || LocalStorage.getItem('city')
      const _to = {
        name: name,
        params: cloneDeep(getRouteParams()),
        meta: cloneDeep(getRouteMeta()),
        query: cloneDeep(getRouteQuery())
      }
      if (!city) {
        console.error('City is empty')
      } else {
        _to.name += withCityRouteKey
        _to.params[cityRouteParamKey] = city as string
      }
      const currentModifiers = getRouteModifiers(_to.name)
      const initialModifiers = getRouteModifiers(getRouteName())
      const modifiers = prepareModifiers([...currentModifiers, ...initialModifiers], [withCompanyRouteKey])
      _to.name = name + '__' + modifiers.join('__')
      return _to
    }

    const prepareWithCompanyPageReplace = (): RouteLocationRaw => {
      const name = getRouteName().split('__')[0]
      const company =
        LocalStorage.getItem('cartCompanyAlias') ||
        LocalStorage.getItem('cartCompany')
      const _to = {
        name: name,
        params: cloneDeep(getRouteParams()),
        meta: cloneDeep(getRouteMeta()),
        query: cloneDeep(getRouteQuery())
      }
      if (!company) {
        console.error('Company is empty')
      } else {
        _to.name += withCompanyRouteKey
        _to.params[companyRouteParamKey] = company as string
      }
      const currentModifiers = getRouteModifiers(_to.name)
      const initialModifiers = getRouteModifiers(getRouteName())
      const modifiers = prepareModifiers([...currentModifiers, ...initialModifiers], [withCityRouteKey])
      _to.name = name + '__' + modifiers.join('__')
      return _to
    }

    router.rawPush = router.push
    router.rawReplace = router.replace

    router.push = (to) => {
      return router.rawPush(processRouteLocation(to, getRouteName()))
    }
    router.replace = (to) => {
      return router.rawReplace(processRouteLocation(to, getRouteName()))
    }
    router.isIncludesRouteName = (first, second = getRouteName()) => {
      const f = first.map((v) => v.replace(withCityRouteKey, ''))
      if (f.includes('home'))
        f.push(
          'home__withCategories',
          'home__withCategories__withProducts',
          'home__withNews',
        )
      const s = second
        .replace(withCityRouteKey, '')
        .replace(withCompanyRouteKey, '')
      return f.includes(s)
    }
    router.replaceToWithCityPage = () => {
      return router.rawReplace(prepareWithCityPageReplace())
    }
    router.replaceToWithCompanyPage = () => {
      return router.rawReplace(prepareWithCompanyPageReplace())
    }
    router.replaceToWithCityAndCompanyPage = () => {
      const res = prepareWithCityPageReplace() as RouteLocationNamedRaw
      const resName = String(res.name)
      const withCompany = prepareWithCompanyPageReplace()
      const name =
        resName +
        (resName.endsWith(withCompanyRouteKey) ? '' : withCompanyRouteKey)
      merge(res, withCompany, { params: { _cityId: res.params?._cityId } })
      // res.name = name + '__' + prepareModifiers(getRouteModifiers(name)).join('__')
      const currentModifiers = getRouteModifiers(name)
      const initialModifiers = prepareModifiers(getRouteModifiers(getRouteName()), [withCityRouteKey, withCompanyRouteKey])
      const modifiers = prepareModifiers([...currentModifiers, ...initialModifiers])
      res.name = getRouteName().split('__')[0] + '__' + modifiers.join('__')
      return router.rawReplace(res)
    }
    router.replaceToRawPage = () => {
      const name = getRouteName()
      const _to = {
        name: name,
        params: getRouteParams(),
        meta: cloneDeep(getRouteMeta()),
        query: cloneDeep(getRouteQuery()),
      }
      _to.name = name.split('__')[0]
      if (_to.params) {
        for (const key of Object.keys(_to.params)) {
          if (key.startsWith('_')) delete _to.params[key]
        }
      }
      return router.rawReplace(_to)
    }
  })
})

declare module 'vue-router' {
  interface Router {
    rawPush: _Router['push']
    rawReplace: _Router['replace']
    replaceToWithCityPage: () => ReturnType<_Router['replace']>
    replaceToWithCompanyPage: () => ReturnType<_Router['replace']>
    replaceToWithCityAndCompanyPage: () => ReturnType<_Router['replace']>
    /**
    Replacing to page without city and company in URL
     */
    replaceToRawPage: () => ReturnType<_Router['replace']>
    isIncludesRouteName: (first: string[], second?: string) => boolean
  }
}
