import { LocalStorage, useQuasar } from 'quasar'
import { store } from '../store'
import { companyGroupRepo } from '../companyGroup/companyGroupRepo'
import { uiSettingsRepo } from '../uiSettings/uiSettingsRepo'
import { cartRepo } from '../carts/cartRepo'
import { appSettingsRepo } from '../appSettings/appSettingsRepo'
import { authentication } from '../authentication/authentication'
import { newsRepo } from '../news/newsRepo'
import { NewsType } from '../news/news'
import { companyRepo } from '../company/companyRepo'
import { customerRepo } from '../customer/customerRepo'
import moment from 'moment'
import { CartType } from 'src/models/carts/cart'
import { authRepo } from 'src/models/authentication/authRepo'
import { qrMenuSettingsRepo } from 'src/models/qrMenuSettings/qrMenuSettingsRepo'
import { padRepo } from 'src/models/pads/padRepo'
import { menuItemRepo } from '../menu/menuItem/menuItemRepo'
import { salesPointRepo } from '../salesPoint/salesPointRepo'
import { menuRulesForAddingRepo } from '../menu/menuItem/menuRulesForAdding/menuRulesForAddingRepo'
import { authSettingsRepo } from '../authSettings/authSettingsRepo'
import { menuRepo } from 'src/models/menu/menuRepo'
import { useFictiveUrlStore } from 'stores/fictiveUrlStore'
import {
  RouteLocationNormalizedLoaded,
  Router,
  useRoute,
  useRouter,
} from 'vue-router'
import { SalesPoint } from 'src/models/salesPoint/salesPoint'
import { Company } from 'src/models/company/company'
import { CityType } from 'src/models/companyGroup/companyGroup'
import { cloneDeep } from 'lodash'
import {
  RouterResolver,
  RouterResolverFields,
} from 'src/models/utils/routerResolver'
import { cityRouteParamKey, companyRouteParamKey } from 'src/router/mainRoutes'

export type AppManagerConfig = {
  companyGroupId?: string | null
  initMenuPage?: boolean
  router?: Router
  route?: RouteLocationNormalizedLoaded
}

let interval: NodeJS.Timeout | null = null

export class AppManager {
  config: AppManagerConfig
  fictiveUrlStore = useFictiveUrlStore()
  private route: RouteLocationNormalizedLoaded
  private router: Router
  private routerResolverFields = new RouterResolverFields()
  private getCompanyFromLocalStorageCache: Company | null = null

  constructor(config: AppManagerConfig) {
    this.config = config
    this.router = config.router || useRouter()
    this.route = config.route || useRoute()
  }

  async initApp() {
    this.setScrollSettings()
    let companyGroupId = this.config.companyGroupId
    const _value = LocalStorage.getItem('Company-Group')
    if (_value && !companyGroupId) companyGroupId = String(_value)
    if (companyGroupId) {
      store.setCompanyGroup(String(companyGroupId))
    }
    if (!authentication.user && store.tableMode) {
      await authRepo.initAnonymousUser()
    }
    const initialCityId = LocalStorage.getItem('city')
    await Promise.all([this.tryAuth(), this.getCurrentCompanyGroup()])
    this.checkSelectedCity(true)

    if (initialCityId !== LocalStorage.getItem('city')) {
      await this.getCurrentCompanyGroup()
      this.checkSelectedCity()
    }
    this.checkSelectedCompany(true)

    new RouterResolver({
      ...this.routerResolverFields,
      route: this.route,
      router: this.router,
    }).resolve()

    await Promise.all([
      uiSettingsRepo.fetchSettings(),
      appSettingsRepo.getLinksSettings(),
      authSettingsRepo.getAuthSettings(),
      companyGroupRepo.getRequiredFieldsSettings(),
    ]).then(() => {
      if (
        companyGroupRepo.item?.externalId === 'tochka_vkusa' &&
        !document.body.classList.contains('bebas-font')
      ) {
        document.body.classList.add('bebas-font')
      }

      if (companyRepo.item?.externalId)
        store.setCompanyGroup(companyRepo.item?.externalId)
    })
    if (authentication.user) {
      void this.setDeviceMeta()
      void this.setOnline()
    } else if (store.qrData) {
      store.authModal = true
    }
    this.setDefaultCompany()

    if (store.tableMode) {
      void uiSettingsRepo.fetchSettings()
      const group =
        this.config.companyGroupId ||
        LocalStorage.getItem('Company-Group') ||
        null
      if (!group) return
      const res = await qrMenuSettingsRepo.qrMenuData(String(group))
      padRepo.item = res.pad
      companyGroupRepo.item = res.company_group
      store.qrMenuData = res
      void cartRepo.setParams({
        type: CartType.TABLE,
        pad: padRepo.item?.id,
        sales_point: padRepo.item?.salesPoint?.id,
      })
      store.getCompanyGroup(String(companyGroupRepo.item?.externalId))
      if (padRepo.item)
        void padRepo.synchronizeOrdersForRestaurant(padRepo.item)
    } else if (authentication.user?.isAnonymous) {
      authentication.logout()
    }
    if (this.config.initMenuPage) {
      await this.loadMenuPage()
    }
  }

  handleInitialMenuItem = async () => {
    if (this.fictiveUrlStore.initialMenuItem) {
      store.openMenuItemModal()
      await menuItemRepo.retrieve(this.fictiveUrlStore.initialMenuItem, {
        sales_point: salesPointRepo.item?.id,
      })
      await menuRulesForAddingRepo.list({
        menu_item: menuItemRepo.item?.id,
      })
      this.fictiveUrlStore.initialMenuItem = null
    }
  }

  handleInitialMenuGroupItem = async () => {
    if (this.fictiveUrlStore.initialMenuGroupItem) {
      const res =
        menuRepo.item?.groups?.find((v) =>
          [v.id, v.alias].includes(this.fictiveUrlStore.initialMenuGroupItem),
        ) || null
      if (res) {
        this.fictiveUrlStore.setVisibleMenuGroup(res)
        this.fictiveUrlStore.visibleMenuGroupIdManualSet = true
        this.fictiveUrlStore.scrollToGroup(res)
      }
      this.fictiveUrlStore.initialMenuGroupItem = null
    }
  }

  setScrollSettings() {
    const q = useQuasar()
    window.addEventListener('scroll', () => {
      store.verticalScroll = window.scrollY
    })
    if (q.platform.is.win) {
      const body = document.getElementsByTagName('body')
      if (body.length) body[0].classList.add('custom-scroll-bar')
    }
  }

  updateLocalStorageCity(city: CityType | null | undefined) {
    if (city) {
      LocalStorage.set('cityAlias', city.alias || city.uuid)
      LocalStorage.set('city', city.uuid)
    } else {
      LocalStorage.remove('cityAlias')
      LocalStorage.remove('city')
    }
  }

  updateLocalStorageCompany(company: Company | null | undefined) {
    if (company) {
      LocalStorage.set('cartCompanyAlias', company.alias || company.id)
      LocalStorage.set('cartCompany', company.id)
    } else {
      LocalStorage.remove('cartCompanyAlias')
      LocalStorage.remove('cartCompany')
    }
  }

  checkSelectedCity(parseFromRoute = false) {
    let setWithCityPage = false
    const cities = companyGroupRepo.item?.cityData.results || []
    if (cities.length < 2) return
    else setWithCityPage = true

    const localStorageCityAlias = LocalStorage.getItem('cityAlias')
    const localStorageCityId = LocalStorage.getItem('city')
    const cityFromRoute = this.route.params[cityRouteParamKey]

    let localStorageCityUpdated = false
    if (parseFromRoute && cityFromRoute) {
      const foundCity = cities.find(
        (v) => v.alias === cityFromRoute || v.uuid === cityFromRoute,
      )
      if (foundCity) {
        this.updateLocalStorageCity(foundCity)
        if (companyGroupRepo.item)
          companyGroupRepo.item.cityData.current = foundCity
        localStorageCityUpdated = true
      }
    }

    if (!localStorageCityUpdated) {
      const foundCity = cities.find(
        (v) =>
          v.alias === localStorageCityAlias || v.uuid === localStorageCityId,
      )
      if (foundCity) {
        this.updateLocalStorageCity(foundCity)
        if (companyGroupRepo.item)
          companyGroupRepo.item.cityData.current = foundCity
      }
    }

    if (!LocalStorage.getItem('cityAlias')) {
      this.updateLocalStorageCity(
        companyGroupRepo.item?.cityData.current || cities[0],
      )
    }

    this.routerResolverFields.withCityPage = setWithCityPage
  }

  checkSelectedCompany(parseFromRoute = false) {
    let setWithCompanyPage = false
    const companies = companyGroupRepo.item?.companies || []
    if (companies.length < 2) return
    else setWithCompanyPage = true

    const localStorageCompanyAlias = LocalStorage.getItem('cartCompanyAlias')
    const localStorageCompanyId = LocalStorage.getItem('cartCompany')
    const companyFromRoute = this.route.params[companyRouteParamKey]

    let localStorageCompanyUpdated = false
    if (parseFromRoute && companyFromRoute) {
      const foundCompany = companies.find(
        (v) => v.alias === companyFromRoute || v.id === companyFromRoute,
      )
      if (foundCompany) {
        this.updateLocalStorageCompany(foundCompany)
        localStorageCompanyUpdated = true
      } else {
        this.updateLocalStorageCompany(companies[0])
        localStorageCompanyUpdated = true
      }
    }

    if (!localStorageCompanyUpdated) {
      const foundCompany = companies.find(
        (v) =>
          v.alias === localStorageCompanyAlias ||
          v.id === localStorageCompanyId,
      )
      if (foundCompany) {
        this.updateLocalStorageCompany(foundCompany)
        localStorageCompanyUpdated = true
      }
    }
    if (!localStorageCompanyAlias && !localStorageCompanyUpdated) {
      this.updateLocalStorageCompany(companies[0])
    }

    this.routerResolverFields.withCompanyPage = setWithCompanyPage
  }

  setDefaultCompany() {
    if (companyGroupRepo.item) {
      if (
        companyGroupRepo.item &&
        companyGroupRepo.item?.companies.length > 1
      ) {
      } else {
        companyRepo.item = companyGroupRepo.item.companies[0]
        companyRepo.cartCompany = companyGroupRepo.item.companies[0]
      }
    }
  }

  detectPageType(): RouterResolverFields {
    this.checkSelectedCity()
    this.checkSelectedCompany()
    return cloneDeep(this.routerResolverFields)
  }

  async tryAuth() {
    try {
      await authentication.validateTokens()
      await authentication.me()
    } catch {}
  }

  async setDeviceMeta() {
    if (!authentication.user) return
    await customerRepo.setDeviceMeta(authentication.user?.id, {
      device_id: 1,
      app_build_version: 1,
      app_version: 1,
      device_name: window.navigator.userAgent,
      system: 3,
      mac: window.navigator.userAgent,
      timezone: `${moment().format('Z')} ${
        Intl.DateTimeFormat().resolvedOptions().timeZone
      }`,
    })
  }

  async setOnline() {
    if (interval) clearInterval(interval)
    else void customerRepo.setOnline(window.navigator.userAgent)
    interval = setInterval(() => {
      if (document.hidden) return
      void customerRepo.setOnline(window.navigator.userAgent)
      if (store.webSocket?.ws?.readyState === 3) {
        let wsUrl: string = `wss://loyalhub.ru/ws/customers/${authentication.user?.id}/`
        if (store.tableMode && padRepo.item) {
          wsUrl = `wss://loyalhub.ru/ws/pads/${padRepo.item.id}/`
        }
        store.setWebSocket(wsUrl)
      }
    }, 30000)
  }

  getCurrentCompanyGroup = async () => {
    try {
      await companyGroupRepo.current()
    } catch {
      authentication.tokens = new authentication.tokensClass(null, null)
      authentication.setApiHeader()
      localStorage.setItem('access', '')
      localStorage.setItem('refresh', '')
    }
  }

  async loadMenuPage() {
    cartRepo.item = null
    const currentPoint = this.findCurrentSalesPoint()
    await this.loadCart()
    if (currentPoint) {
      void store.loadCatalog(currentPoint).then(() => {
        void this.handleInitialMenuItem()
        void this.handleInitialMenuGroupItem()
      })
    }

    void newsRepo
      .list({
        company_group: companyGroupRepo.item?.id,
        active: true,
        type: NewsType.DEFAULT,
        city:
          localStorage.getItem('city') ||
          companyGroupRepo.item?.cityData.current?.uuid,
      })
      .then((res) => {
        newsRepo.news = res.items
      })
    void newsRepo
      .list({
        company_group: companyGroupRepo.item?.id,
        active: true,
        type: NewsType.PROMOTION,
        city:
          localStorage.getItem('city') ||
          companyGroupRepo.item?.cityData.current?.uuid,
      })
      .then((res) => {
        newsRepo.promotions = res.items
      })
    if (
      authentication.user?.registeredAt === null &&
      !authentication.user.isAnonymous
    ) {
      store.registrationModal = true
    }
  }

  getCompanyFromLocalStorage(ignoreCache = false) {
    if (this.getCompanyFromLocalStorageCache && !ignoreCache)
      return this.getCompanyFromLocalStorageCache
    const companyId = LocalStorage.getItem('cartCompany') || null
    if (!companyId) return null
    const found = companyGroupRepo.item?.companies.find(
      (v) => v.id === companyId && v.salesPoints?.length,
    )
    this.getCompanyFromLocalStorageCache = found || null
    return this.getCompanyFromLocalStorageCache
  }

  findCurrentSalesPoint() {
    let currentPoint: SalesPoint | null | undefined = null
    const found = this.getCompanyFromLocalStorage()
    if (found && found.salesPoints?.length) return found.salesPoints[0]

    if (store.tableMode) {
      currentPoint = padRepo.item?.salesPoint
    } else if (cartRepo.item) {
      currentPoint = cartRepo.item?.salesPoint
    } else if (companyGroupRepo.item?.companies?.[0]?.salesPoints?.length) {
      currentPoint = companyGroupRepo.item.companies[0].salesPoints[0]
    }
    return currentPoint || null
  }

  async loadCart() {
    if (authentication.user) {
      if (store.qrData) {
        await cartRepo.setParams({
          sales_point: store.qrData.data?.salesPoint?.id,
          type: CartType.TABLE,
          pad: store.qrData.data?.pad?.id,
          comment: cartRepo.item?.comment || undefined,
        })
      }
      await cartRepo.current(undefined, store.qrData?.data?.pad?.id)
    } else {
      cartRepo.item = null
    }
    return cartRepo.item
  }
}
