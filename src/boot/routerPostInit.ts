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
import { cloneDeep, merge } from 'lodash'

const processRouteLocation = (
  to: RouteLocationRaw,
  currentRouteName: string,
): RouteLocationRaw => {
  const isCityPage = currentRouteName.includes(withCityRouteKey)
  const isCompanyPage = currentRouteName.includes(withCompanyRouteKey)
  const isCityAndCompanyPage = isCityPage && isCompanyPage
  let routePostfix = ''
  if (isCityAndCompanyPage)
    routePostfix = withCityRouteKey + withCompanyRouteKey
  else if (isCityPage) routePostfix = withCityRouteKey
  else if (isCompanyPage) routePostfix = withCompanyRouteKey
  if (!isCityPage) return to
  if (typeof to === 'string' && !to.includes(withCityRouteKey)) {
    return (to.split('__')[0] + routePostfix) as RouteLocationRaw
  }
  if (Object.keys(to).includes('name')) {
    const _to = to as { name: string }
    const _toName = _to.name.split('__')[0]
    _to.name = _toName + routePostfix
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

    const prepareWithCityPageReplace = (): RouteLocationRaw => {
      const name = getRouteName().split('__')[0]
      const city =
        LocalStorage.getItem('cityAlias') || LocalStorage.getItem('city')
      const _to = {
        name: name,
        params: cloneDeep(getRouteParams()),
        meta: cloneDeep(getRouteMeta()),
      }
      if (!city) {
        console.error('City is empty')
      } else {
        _to.name += withCityRouteKey
        _to.params[cityRouteParamKey] = city as string
      }
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
      }
      if (!company) {
        console.error('Company is empty')
      } else {
        _to.name += withCompanyRouteKey
        _to.params[companyRouteParamKey] = company as string
      }
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
      const s = second.replace(withCityRouteKey, '').replace(withCompanyRouteKey, '')
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
      res.name = name
      return router.rawReplace(res)
    }
    router.replaceToRawPage = () => {
      const name = getRouteName()
      const _to = {
        name: name,
        params: getRouteParams(),
        meta: cloneDeep(getRouteMeta()),
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
