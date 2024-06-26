import { withCityRouteKey } from 'src/router/mainRoutes'
import { RouteLocationNormalizedLoaded } from 'vue-router'


export const isCityPage = (route:  RouteLocationNormalizedLoaded) => {
  return String(route.name).endsWith(withCityRouteKey)
}
