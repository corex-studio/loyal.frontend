import { authentication } from './../../models/authentication/authentication'
import { Customer, CustomerRaw } from './../../models/customer/customer'
import { api } from 'boot/axios'
import { AxiosResponse, isAxiosError } from 'axios'

import { BaseAuthenticationTokens, TokensRaw } from './baseAuthenticationTokens'
import moment from 'moment'

export class BaseAuthentication {
  user: Customer | null = null
  tokens!: BaseAuthenticationTokens
  loading = false

  tokensClass = BaseAuthenticationTokens

  settings = {
    urls: {
      login: 'users/auth/',
      requestAuth: 'users/request_auth/',
      me: '/users/me/',
      register: '/users/',
      refresh: '/token/refresh/',
      changePassword: '/users/change_password/',
      setLanguage: 'users/set_language/',
      tgAuth: 'bot_actions/authorize_user/',
    },
    apiHeader: {
      key: 'Authorization',
      type: 'Bearer',
    },
    companyGroupHeader: {
      key: 'Company-Group',
    },
  }

  constructor() {
    this.setTokensAndHeaders()
  }

  async me() {
    this.setTokensAndHeaders()
    if (!this.tokens.accessIsValid) throw Error('Access token is not valid.')
    authentication.loading = true
    this.user = await this._loadUser()
    authentication.loading = false
    return this.user
  }

  async tgAuth(telegram_id: any) {
    try {
      const response: AxiosResponse<TokensRaw> = await api.post(
        this.settings.urls.tgAuth,
        { telegram_id },
      )
      this.tokens = new this.tokensClass(
        response.data.access,
        response.data.refresh,
      )
      this.setApiHeader()
      localStorage.setItem('access', response.data.access)
      localStorage.getItem('refresh', response.data.refresh)
      return
    } catch (e) {
      if (isAxiosError(e)) {
        if ([400, 401].includes(e.response?.status as number)) {
          this.tokens.removeTokens()
          window.location.reload()
        }
      }
      throw Error('Fail with telegram authentication.')
    }
  }

  async refresh(): Promise<void> {
    const result: AxiosResponse<TokensRaw> = await api.post(
      this.settings.urls.refresh,
      { refresh: this.tokens.refresh },
    )
    this.tokens = new this.tokensClass(result.data.access, result.data.refresh)
    this.setApiHeader()
  }

  async requestAuth(data: any) {
    try {
      const response: AxiosResponse<{
        success: boolean
        requested_at: string
        phone: string
        authorize_url?: string
        session?: { key: string; end_time: string }
      }> = await api.post(this.settings.urls.requestAuth, data)
      return response.data
    } catch {}
  }

  async login(data: any) {
    this.logout()
    try {
      const response: AxiosResponse<TokensRaw> = await api.post(
        this.settings.urls.login,
        data,
      )
      this.tokenAuth(response.data.access, response.data.refresh)

      return {
        user: this.user,
        tokens: this.tokens,
      }
    } catch (e) {
      throw Error('Fail login')
    }
  }

  async tokenAuth(access: string | null, refresh: string | null) {
    this.tokens = new this.tokensClass(access, refresh)
    this.setApiHeader()
    this.user = await this._loadUser()
  }

  async register(data: any) {
    this.logout()
    try {
      await api.post(this.settings.urls.register, data)
      return await this.login(data)
    } catch (e) {
      throw Error('Register fail')
    }
  }

  async changePassword(data: any) {
    try {
      return await api.post(this.settings.urls.changePassword, data)
    } catch (e) {
      throw Error('Change password fail')
    }
  }

  async setLanguage(language: string) {
    try {
      return await api.put(this.settings.urls.setLanguage, {
        language: language,
      })
    } catch (e) {
      throw Error('Language change fail')
    }
  }

  logout(): void {
    this.user = null
    this.tokens.removeTokens()
    Object.assign(api.defaults.headers, { Authorization: null })
  }

  setApiHeader(): void {
    const apiHeader = this.settings.apiHeader
    if (!this.tokens.access) return
    Object.assign(api.defaults.headers, {
      [apiHeader.key]: apiHeader.type
        ? `${apiHeader.type} ${this.tokens.access}`
        : this.tokens.access,
    })
  }

  setCompanyGroupHeader(v: string): void {
    Object.assign(api.defaults.headers, {
      [this.settings.companyGroupHeader.key]: v,
    })
  }

  async validateTokens(): Promise<void> {
    let shouldRefresh = false
    if (this.tokens.access) {
      const date = this.tokens.getJwtData(this.tokens.access).date
      if (moment.utc().add('1', 'day') >= date) {
        shouldRefresh = true
      }
    } else shouldRefresh = true
    if (shouldRefresh && this.tokens.refreshIsValid) {
      await this.refresh()
    }
  }

  private setTokensAndHeaders() {
    this.tokens = this.tokensClass.getFromStorage()
    this.setApiHeader()
  }

  private async _loadUser(): Promise<Customer> {
    try {
      const response: AxiosResponse<CustomerRaw> = await api.get(
        this.settings.urls.me,
      )
      return new Customer(response.data)
    } catch (e) {
      if (isAxiosError(e)) {
        if ([400, 401].includes(e.response?.status as number)) {
          this.tokens.removeTokens()
          window.location.reload()
        }
      }
      throw Error('Fail with load user.')
    }
  }
}
