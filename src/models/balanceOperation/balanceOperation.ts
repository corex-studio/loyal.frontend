import moment from 'moment'
import { BaseModel } from 'src/corexModels/apiModels/baseModel'
import { Customer, CustomerRaw } from '../customer/customer'

export type BalanceOperationRaw = {
  uuid?: string | null
  customer?: CustomerRaw
  type?: string
  balance?: number
  sum?: number
  title?: string | null
  message?: string | null
  description?: string | null
  order?: string | null
  created_by?: string | null
  event?: string | null
  created_at?: string | null
}

export class BalanceOperation implements BaseModel {
  id: string | undefined
  customer: Customer | null
  type: string | null
  balance: number
  sum: number
  title: string | null
  message: string | null
  description: string | null
  order: string | null
  createdBy: string | null
  event: string | null
  createdAt: string | null

  constructor(raw: BalanceOperationRaw) {
    this.id = raw.uuid || undefined
    this.customer = raw.customer ? new Customer(raw.customer) : null
    this.type = raw.type || null
    this.balance = raw.balance || 0
    this.sum = raw.sum || 0
    this.title = raw.title || null
    this.message = raw.message || null
    this.description = raw.description || null
    this.order = raw.order || null
    this.createdBy = raw.created_by || null
    this.event = raw.event || null
    this.createdAt = raw.created_at
      ? moment
          .utc(raw.created_at, 'YYYY-MM-DD HH:mm:ss')
          .local()
          .format('DD.MM.YYYY HH:mm')
      : null
  }

  toJson(): Record<string, any> {
    return {
      // id: this.id,
    }
  }
}
