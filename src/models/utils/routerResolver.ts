import {
  RouteLocationNormalizedLoaded,
  Router,
  useRoute,
  useRouter,
} from 'vue-router'
import { AppManager } from 'src/models/utils/appManager'

type RouterResolverRaw = { withCityPage?: boolean; withCompanyPage?: boolean }

export class RouterResolverFields {
  withCityPage = false
  withCompanyPage = false

  constructor(raw?: RouterResolverRaw) {
    this.withCompanyPage = !!raw?.withCompanyPage
    this.withCityPage = !!raw?.withCityPage
  }
}

export class RouterResolver extends RouterResolverFields {
  private readonly router: Router
  private readonly route: RouteLocationNormalizedLoaded
  private readonly appManager: AppManager

  constructor(
    raw?: (RouterResolverRaw | RouterResolverFields) &
      Partial<{ router: Router; route: RouteLocationNormalizedLoaded }>,
  ) {
    super(raw)
    this.route = raw?.route || useRoute()
    this.router = raw?.router || useRouter()
    if (!this.route || !this.router)
      throw Error(
        'Init this class from vue template life cycle or provide route and router.',
      )
    this.appManager = new AppManager({route: this.route, router: this.router})
  }

  detect() {
    const res = this.appManager.detectPageType()
    for (const [k, v] of Object.entries(res)) {
      this[k as keyof typeof this] = v
    }
    return this
  }

  async resolve() {
    if (this.withCityPage && this.withCompanyPage)
      return await this.router.replaceToWithCityAndCompanyPage()
    else if (this.withCompanyPage)
      return await this.router.replaceToWithCompanyPage()
    else if (this.withCityPage)
      return await this.router.replaceToWithCityPage()
    else
      return await this.router.replaceToRawPage()
  }
}
