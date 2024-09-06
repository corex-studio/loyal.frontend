import { OrderType } from 'src/models/menu/menuItem/menuRulesForAdding/menuRulesForAdding'

export type DeliveryTypeSchema = {
  delivery_type: OrderType
  chip: {
    label: string | null,
    color: string | null
  } | null
}


export type CompanyThemeSchema = {
  delivery_types: DeliveryTypeSchema[]
}
