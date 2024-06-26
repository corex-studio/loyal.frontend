import { AvailableHours } from './../carts/cart'
import { Menu, MenuRaw } from './../menu/menu'
import { AvailablePaymentType, PaymentSettings, SalesPoint } from './salesPoint'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { salesPointApi } from './salesPointApi'
import { reactive } from 'vue'
import { Schedule, ScheduleDay, ScheduleRaw } from './schedule/schedule'
import { Image, ImageRaw } from '../image/image'
import { cartRepo } from '../carts/cartRepo'
import { store } from '../store'
import { PaymentObjectType, PaymentType } from 'src/models/order/order'
import { PadBaseOrderType } from 'src/models/pads/pad'
import { QrMenuWorkingMode } from 'src/models/qrMenuSettings/qrMenuSettingsRepo'

export class SalesPointRepo extends BaseRepo<SalesPoint> {
  api = salesPointApi
  menuLoading = false
  paymentSettings: PaymentSettings | null = null
  externalPaymentTypes: AvailablePaymentType[] = []

  get paymentTypes() {
    const result: PaymentObjectType[] = []
    if (this.paymentSettings?.online_payment_enabled)
      result.push({
        label: 'Онлайн',
        type: PaymentType.ONLINE,
        class: 'bg-online-button-color text-on-online-button-color',
        icon: 'fa-light fa-ruble-sign',
      })
    if (salesPointRepo.paymentSettings?.card_enabled)
      result.push({
        label: 'Картой при получении',
        type: PaymentType.CARD,
        class: 'bg-card-button-color text-on-card-button-color',
        icon: 'fa-light fa-credit-card',
      })
    if (salesPointRepo.paymentSettings?.cash_enabled)
      result.push({
        label: 'Наличными при получении',
        type: PaymentType.CASH,
        class: 'bg-cash-button-color text-on-cash-button-color',
        icon: 'fa-light fa-money-bill',
      })
    if (
      salesPointRepo.paymentSettings?.pay_later_enabled &&
      store.qrMenuData?.pad?.baseOrderType === PadBaseOrderType.TABLE &&
      store.qrMenuData.settings.working_mode === QrMenuWorkingMode.RESTAURANT
    )
      result.push({
        label: 'Внести в счет',
        type: PaymentType.PAY_LATER,
        class: 'bg-cash-button-color text-on-cash-button-color',
        icon: 'fa-light fa-money-bill',
      })

    return result
  }

  async status(sales_point?: string): Promise<boolean> {
    const res: {
      order_creation_available: boolean
    } = await this.api.send({
      method: 'GET',
      action: 'status',
      id: sales_point,
    })

    return res.order_creation_available
  }

  async getExternalPaymentTypes() {
    const res: {
      results: AvailablePaymentType[]
    } = await this.api.send({
      method: 'GET',
      action: 'external_payment_types',
      id: this.item?.id,
    })

    this.externalPaymentTypes = res.results
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
  async setSchedule(data: ScheduleDay[]): Promise<Schedule> {
    const res: ScheduleRaw = await this.api.send({
      method: 'POST',
      action: 'set_schedule',
      id: this.item?.id,
      data: {
        days: data.map((v) => v.toJson()),
      },
    })
    return new Schedule(res)
  }

  async addImage(image: File, isMain = false): Promise<ImageRaw> {
    const data = new FormData()
    data.append('image', image)
    data.append('main_image', String(isMain))

    return await this.api.send({
      method: 'POST',
      action: 'add_image',
      id: this.item?.id,
      data,
    })
  }

  async deleteImage(image: Image): Promise<ImageRaw> {
    return await this.api.send({
      method: 'POST',
      action: 'delete_image',
      id: this.item?.id,
      data: { image: image.id },
    })
  }

  async getMenu(id: string): Promise<Menu> {
    this.menuLoading = true
    const res: MenuRaw = await this.api.send({
      method: 'GET',
      action: 'menu',
      id,
      params: {
        cart: cartRepo.item?.id || undefined,
        pad: store.qrData?.data?.pad?.id || undefined,
        delivery_type: store.qrData
          ? 'table'
          : cartRepo.item?.type || undefined,
      },
    })
    this.menuLoading = false
    return new Menu(res)
  }

  async getAvailablePayments(salesPointId?: string): Promise<PaymentSettings> {
    const res: PaymentSettings = await this.api.send({
      method: 'GET',
      action: 'get_available_payments',
      id: salesPointId,
      params: {
        cart: cartRepo.item?.id || undefined,
        delivery_type: cartRepo.item?.type || undefined,
      },
    })
    salesPointRepo.paymentSettings = res
    return res
  }

  async getAvailableWorkingHours(
    date: string | null,
    salesPointId?: string,
  ): Promise<AvailableHours> {
    const res: AvailableHours = await this.api.send({
      method: 'GET',
      action: 'available_working_hours',
      id: salesPointId,
      params: { date },
    })
    return res
  }
}

export const salesPointRepo = reactive(new SalesPointRepo())
