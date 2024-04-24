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

export type AppManagerConfig = {
  companyGroupId?: string | null
  initMenuPage?: boolean
}

let interval: NodeJS.Timeout | null = null

export class AppManager {
  config: AppManagerConfig

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
    if (this.config.initMenuPage) {
      await this.loadMenuPage()
    }
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
        pad: padRepo.item.id,
        sales_point: padRepo.item.salesPoint?.id,
      })
      store.getCompanyGroup(String(companyGroupRepo.item?.externalId))
    } else if (authentication.user?.isAnonymous) {
      authentication.logout()
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
    const city = localStorage.getItem('city')
    if ((companyGroupRepo.item?.cityData.results?.length || 0) <= 1) {
      store.cityCheckModal = false
      return
    }
    if (!city) {
      store.cityCheckModal = true
      return
    }
    if (!companyGroupRepo.item?.cityData.results.find((v) => v.uuid === city)) {
      store.cityCheckModal = true
    }
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
      void customerRepo.setOnline(window.navigator.userAgent)
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
    let currentPoint = cartRepo.item
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
    if (currentPoint) void store.loadCatalog(currentPoint)

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
