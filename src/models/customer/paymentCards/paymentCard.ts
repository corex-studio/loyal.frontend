import { BaseModel } from 'src/corexModels/apiModels/baseModel'

export enum BankType {
  SBER = 'sber',
  ALPHA = 'alpha',
  ALPHA_V2 = 'alpha_v2',
  CLOUDPAYMENTS = 'cloudpayments',
  PAYSELECTION = 'payselection',
}

export enum CardType {
  VISA = 'Visa',
  MASTERCARD = 'MasterCard',
  MIR = 'MIR',
}

export const cardTypeNames = {
  [CardType.MASTERCARD]: 'MasterCard',
  [CardType.MIR]: 'Мир',
  [CardType.VISA]: 'Visa',
}

export type PaymentCardRaw = {
  uuid?: string | null
  exp_date: string | null
  type: CardType
  starts_with: string | null
  ends_with: string | null
  active: boolean
  company_bank: string | null
  bank: BankType
  disabled: boolean
}

export class PaymentCard implements BaseModel {
  id: string | undefined
  expDate: string | null
  type: CardType
  startsWith: string | null
  endsWith: string | null
  active: boolean
  companyBank: string | null
  bank: BankType
  disabled: boolean

  constructor(raw: PaymentCardRaw) {
    this.id = raw.uuid || undefined
    this.expDate = raw.exp_date
    this.type = raw.type
    this.startsWith = raw.starts_with
    this.endsWith = raw.ends_with
    this.active = raw.active
    this.companyBank = raw.company_bank
    this.bank = raw.bank
    this.disabled = raw.disabled
  }

  toJson(): Record<string, any> {
    return {
      // id: this.id,
    }
  }
}
