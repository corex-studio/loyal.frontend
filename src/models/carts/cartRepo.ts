import { CartItem } from './cartItem/cartItem'
import { Order, OrderRaw, PaymentObjectType } from './../order/order'
import { AvailableHours, CalculationStatus, Cart, CartParams, CartRaw, CartType } from './cart'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { cartApi } from './cartApi'
import { reactive } from 'vue'
import { store } from '../store'
import { padRepo } from '../pads/padRepo'
import {
  DeliveryAreaSettings,
  DeliveryAreaSettingsRaw
} from 'src/models/deliveryAreas/deliveryAreaSettings/deliveryAreaSettings'
import { MenuItem, MenuItemRaw } from '../menu/menuItem/menuItem'

export class CartRepo extends BaseRepo<Cart> {
  api = cartApi
  loading = false
  setParamsLoading = false
  arrangeLoading = false
  promocodeError = false
  selectedPaymentType: PaymentObjectType | null = null
  upsales: MenuItem[] = []

  isItemInCart(id: string): CartItem | undefined {
    return this.item
      ? this.item?.cartItems
        .filter((el) => !el.attachedTo)
        .find((v) => v.size.menu_item === id)
      : undefined
  }

  async setParams(data: CartParams) {
    this.setParamsLoading = true
    if (!data.sales_point && this.item?.salesPoint?.id) {
      data.sales_point = this.item.salesPoint.id
    }
    if (store.tableMode) {
      data.type ? void 0 : (data.type = CartType.TABLE)
      data.pad ? void 0 : (data.pad = padRepo.item?.id)
    }
    if (!data.pad) {
      data.pad =
        store.qrData?.data?.pad?.id || store.qrMenuData?.pad?.id || undefined
    }
    const res: CartRaw = await this.api.send({
      method: 'PUT',
      action: 'set_params',
      data: { ...data }
    })

    this.item = new Cart(res)
    if (this.item.calculationStatus !== CalculationStatus.IN_PROGRESS) {
      this.setParamsLoading = false
    }
    return this.item
  }

  async getDeliverySettings(v: Cart) {
    const results = await this.api.send<{
      delivery_settings: DeliveryAreaSettingsRaw[]
    }>({
      method: 'GET',
      id: v.id,
      action: 'delivery_settings'
    })
    return results.delivery_settings.map((v) => new DeliveryAreaSettings(v))
  }

  getRelatedItems(v: CartItem) {
    return this.item?.cartItems.filter((el) => el.attachedTo === v.id)
  }

  isInCart(uuid?: string) {
    if (!uuid || !this.item) return false
    return this.item.cartItems.map((v) => v.size.uuid).includes(uuid)
  }

  async current(sales_point?: string, pad?: string | null) {
    this.loading = true
    const city = localStorage.getItem('city')
    try {
      const res: CartRaw = await this.api.send({
        method: 'GET',
        action: 'current',
        params: {
          sales_point,
          pad: pad || undefined,
          city
        }
      })
      this.item = new Cart(res)
    } catch {
      this.item = null
    }
    this.loading = false
    return this.item
  }

  async getAvailableHours(salesPointId?: string): Promise<AvailableHours> {
    return await this.api.send({
      method: 'GET',
      action: 'get_available_hours',
      params: {
        sales_point: salesPointId
      }
    })
  }

  async arrange(data: Record<string, any>): Promise<Order> {
    this.arrangeLoading = true
    const res: OrderRaw = await this.api.send({
      method: 'POST',
      action: 'arrange',
      data
    })
    this.arrangeLoading = false
    return new Order(res)
  }

  async clear() {
    const res: CartRaw = await this.api.send({
      method: 'PUT',
      action: `${this.item?.id}/clear`
    })
    return new Cart(res)
  }

  async getUpsales() {
    const res: {
      results: MenuItemRaw[]
    } = await this.api.send({
      method: 'GET',
      action: `${this.item?.id}/upsales`
    })
    this.upsales = res.results.map((v) => new MenuItem(v))
    return this.upsales
  }
}

export const cartRepo = reactive(new CartRepo())
