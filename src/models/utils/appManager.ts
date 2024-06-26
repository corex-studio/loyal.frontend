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
import { isCityPage } from 'src/router/helpers'
import { useRoute, useRouter } from 'vue-router'

export type AppManagerConfig = {
  companyGroupId?: string | null
  initMenuPage?: boolean
}

let interval: NodeJS.Timeout | null = null

export class AppManager {
  config: AppManagerConfig
  fictiveUrlStore = useFictiveUrlStore()
  private route = useRoute()
  private router = useRouter()

  constructor(config: AppManagerConfig) {
    this.config = config
  }
  async initApp() {
    this.setScrollSettings()
    let companyGroupId = this.config.companyGroupId
    const _value = LocalStorage.getItem('Company-Group')
    if (_value && !companyGroupId) companyGroupId = String(_value)
    if (companyGroupId) store.setCompanyGroup(String(companyGroupId))
    if (!authentication.user && store.tableMode) {
      await authRepo.initAnonymousUser()
    }
    await Promise.all([
      this.tryAuth(),
      this.getCurrentCompanyGroup(),
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
      if (
        companyGroupRepo.item?.id === '556af59a-eca0-49fc-b8d0-e22d4ad11d2f'
      ) {
        void 0
      }

      if (companyRepo.item?.externalId)
        store.setCompanyGroup(companyRepo.item?.externalId)
    })
    this.checkSelectedCity()
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
      if (padRepo.item) void padRepo.synchronizeOrders(padRepo.item)
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

  checkSelectedCity() {
    // todo refactor
    const paramsCity = this.route.params._cityId
    const localStorageCity =
      localStorage.getItem('cityAlias') || localStorage.getItem('city')
    const city = localStorageCity || (paramsCity ? String(paramsCity) : null)

    const cities = companyGroupRepo.item?.cityData.results || []
    const foundCity = city ? companyGroupRepo.item?.findByAliasOrId(city) : null
    if (cities.length <= 1) {
      store.cityCheckModal = false
      if (isCityPage(this.route)) void this.router.replaceToWithoutCityPage()
    } else if (!city) {
      store.cityCheckModal = true
    } else if (!foundCity) {
      store.cityCheckModal = true
      void this.router.replaceToWithoutCityPage()
    } else if (cities.length > 1) {
      if (
        !isCityPage(this.route) ||
        (isCityPage(this.route) && this.route.params._cityId !== city)
      ) {
        if (foundCity?.alias) {
          localStorage.setItem('city', foundCity.uuid)
          localStorage.setItem('cityAlias', foundCity.alias || city)
        }
      }
      if (foundCity.uuid !== localStorage.getItem('city')) {
        localStorage.setItem('city', foundCity.uuid)
        localStorage.setItem('cityAlias', foundCity.alias || foundCity.uuid)
      }
      void this.router.replaceToWithCityPage()
    }
    if (this.route.params._cityId) {
      const currentId = String(this.route.params._cityId)
      const city = companyGroupRepo.item?.findByAliasOrId(currentId)
      if (city && companyGroupRepo.item) {
        localStorage.setItem('city', city?.uuid || '')
        localStorage.setItem('cityAlias', city?.alias || currentId)
        companyGroupRepo.item.cityData.current = city
      }
      if (cities.length > 1) void this.router.replaceToWithCityPage()
    }
    // if (cities.length > 1 && !isCityPage(this.route)) void this.router.replaceToWithCityPage()
    if (cities.length <= 1 && isCityPage(this.route)) void  this.router.replaceToWithoutCityPage()


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
    let currentPoint = store.tableMode
      ? padRepo.item?.salesPoint
      : cartRepo.item
        ? cartRepo.item?.salesPoint
        : companyGroupRepo.item?.companies[0]?.salesPoints &&
            companyGroupRepo.item?.companies[0]?.salesPoints.length
          ? companyGroupRepo.item?.companies[0]?.salesPoints[0]
          : null
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
    }
    if (cartRepo.item) currentPoint = cartRepo.item.salesPoint
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
}
