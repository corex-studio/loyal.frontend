import { LocalStorage, useQuasar } from 'quasar'
import { store } from '../store'
import { companyGroupRepo } from '../companyGroup/companyGroupRepo'
import { uiSettingsRepo } from '../uiSettings/uiSettingsRepo'
import { cartRepo } from '../carts/cartRepo'
import { appSettingsRepo } from '../appSettings/appSettingsRepo'
import { authentication } from '../authentication/authentication'
import { useFavicon } from '@vueuse/core'
import { newsRepo } from '../news/newsRepo'
import { NewsType } from '../news/news'
import { companyRepo } from '../company/companyRepo'

export type AppManagerConfig = {
  companyGroupId?: string | null
  initMenuPage?: boolean
}

export class AppManager {
  config: AppManagerConfig
  icon = useFavicon()

  constructor(config: AppManagerConfig) {
    this.config = config
  }
  async initApp() {
    this.setScrollSettings()
    let companyGroupId = this.config.companyGroupId
    const _value = LocalStorage.getItem('Company-Group')
    if (_value && !companyGroupId) companyGroupId = String(_value)
    if (companyGroupId) store.setCompanyGroup(String(companyGroupId))
    await Promise.all([
      this.tryAuth(),
      this.getCurrentCompanyGroup(),
      uiSettingsRepo.fetchSettings(),
      appSettingsRepo.getLinksSettings(),
      companyGroupRepo.getRequiredFieldsSettings(),
    ]).then(() => {
      this.changeFavicon(companyGroupRepo.item?.image?.thumbnail)
      if (companyRepo.item?.externalId)
        store.setCompanyGroup(companyRepo.item?.externalId)
    })
    this.setDefaultCompany()
    if (this.config.initMenuPage) {
      void this.loadMenuPage()
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

  loadMenuPage() {
    const currentPoint = cartRepo.item
      ? cartRepo.item?.salesPoint
      : companyGroupRepo.item?.companies[0]?.salesPoints &&
        companyGroupRepo.item?.companies[0]?.salesPoints.length
      ? companyGroupRepo.item?.companies[0]?.salesPoints[0]
      : null
    if (currentPoint) void store.loadCatalog(currentPoint)
    if (authentication.user) void cartRepo.current()

    if (!newsRepo.news.length) {
      void newsRepo
        .list({
          company_group: companyGroupRepo.item?.id,
          active: true,
          type: NewsType.DEFAULT,
        })
        .then((res) => {
          newsRepo.news = res.items
        })
    }
    if (!newsRepo.promotions.length) {
      void newsRepo
        .list({
          company_group: companyGroupRepo.item?.id,
          active: true,
          type: NewsType.PROMOTION,
        })
        .then((res) => {
          newsRepo.promotions = res.items
        })
    }
    if (authentication.user?.registeredAt === null) {
      store.registrationModal = true
    }
  }

  changeFavicon(src?: string) {
    if (!src) return
    this.icon.value = src
  }
}
