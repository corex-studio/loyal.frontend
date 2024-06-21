import { boot } from 'quasar/wrappers'
import { RouteLocationRaw, Router as _Router } from 'vue-router'
import { withCityRouteKey } from 'src/router/mainRoutes'
import { LocalStorage } from 'quasar'
import { cloneDeep } from 'lodash'

const processRouteLocation = (
  to: RouteLocationRaw,
  currentRouteName: string,
): RouteLocationRaw => {
  const isCityPage = currentRouteName.endsWith(withCityRouteKey)
  if (!isCityPage) return to
  if (typeof to === 'string' && !to.endsWith(withCityRouteKey)) {
    return (to.replace(withCityRouteKey, '') + withCityRouteKey) as RouteLocationRaw
  }
  if (Object.keys(to).includes('name')) {
    const _to = to as { name: string }
    if (!_to.name.endsWith(withCityRouteKey)) _to.name += withCityRouteKey
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
      const s = second.replace(withCityRouteKey, '')
      return f.includes(s)
    }
    router.replaceToWithCityPage = () => {
      const name = getRouteName().replace(withCityRouteKey, '')
      const city = LocalStorage.getItem('cityAlias') || LocalStorage.getItem('city')
      const _to = { name: name, params: cloneDeep(getRouteParams()), meta: cloneDeep(getRouteMeta()) }
      if (!city) {
        console.error('City is empty')
      } else {
        _to.name += withCityRouteKey
        _to.params._cityId = city as string
      }
      return router.replace(_to)
    }
    router.replaceToWithoutCityPage = () => {
      const name = getRouteName()
      const _to = { name: name, params: getRouteParams(), meta: cloneDeep(getRouteMeta()) }
      _to.name = name.replace(withCityRouteKey, '')
      if (_to.params) delete _to.params._cityId
      return router.rawReplace(_to)
    }
  })
})

declare module 'vue-router' {
  interface Router {
    rawPush: _Router['push']
    rawReplace: _Router['replace']
    replaceToWithCityPage: () => ReturnType<_Router['replace']>
    replaceToWithoutCityPage: () => ReturnType<_Router['replace']>
    isIncludesRouteName: (first: string[], second?: string) => boolean
  }
}

