import { EventBusKey } from '@vueuse/core'
import { Company } from 'src/models/company/company'
import { Order } from 'src/models/order/order'

export const selectCompanyKey: EventBusKey<{ company: Company }> =
  Symbol('selectCompanyKey')

export const orderUpdatedKey: EventBusKey<{ order: Order }> =
  Symbol('orderUpdatedKey')

export const onCloseProductModalKey: EventBusKey<{ order: Order }> =
  Symbol('onCloseProductModalKey')

export const initMetrikaKey: EventBusKey<{ order: Order }> =
  Symbol('initMetrikaKey')
