import { Company, GuestContact } from './company'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { companyApi } from './companyApi'
import { reactive } from 'vue'
import { AvailablePaymentType, PaymentSettings } from '../salesPoint/salesPoint'
import { Image, ImageRaw } from '../image/image'
import { LocalStorage } from 'quasar'

export class CompanyRepo extends BaseRepo<Company> {
  api = companyApi
  availablePaymentTypes: AvailablePaymentType[] = []
  companyForProfile: Company | null = null
  private _cartCompany: Company | null = null

  get cartCompany() {
    return this._cartCompany
  }

  set cartCompany(v) {
    if (v?.id) {
      LocalStorage.set('cartCompany', v.id)
      LocalStorage.set('cartCompanyAlias', v.alias || v.id)
    }
    else {
      LocalStorage.remove('cartCompany')
      LocalStorage.remove('cartCompanyAlias')
    }
    this._cartCompany = v
  }

  async addImage(
    company: Company,
    image: File,
    isMain = false,
  ): Promise<ImageRaw> {
    const data = new FormData()
    data.append('image', image)
    data.append('main_image', String(isMain))

    return await this.api.send({
      method: 'POST',
      action: 'add_image',
      id: company.id,
      data,
    })
  }

  async deleteImage(company: Company, image: Image): Promise<ImageRaw> {
    return await this.api.send({
      method: 'POST',
      action: 'delete_image',
      id: company.id,
      data: { image: image.id },
    })
  }

  async setGuestContacts(data: GuestContact) {
    return await this.api.send({
      method: 'POST',
      action: 'set_guest_contacts',
      id: this.item?.id,
      data: data.toJson(),
    })
  }

  async getAvailablePaymentTypes() {
    const res: {
      results: AvailablePaymentType[]
    } = await this.api.send({
      method: 'GET',
      action: 'available_payment_types',
      id: this.item?.id,
    })

    this.availablePaymentTypes = res.results
    return res.results
  }

  async setPaymentSettings(data: PaymentSettings) {
    await this.api.send({
      method: 'POST',
      action: 'set_payment_settings',
      id: this.item?.id,
      data,
    })
  }

  async loadMenus() {
    await this.api.send({
      method: 'POST',
      action: 'load_menus',
      id: this.item?.id,
    })
  }

  async loadNomenclature() {
    await this.api.send({
      method: 'POST',
      action: 'load_nomenclature',
      id: this.item?.id,
    })
  }
}

export const companyRepo = reactive(new CompanyRepo())
