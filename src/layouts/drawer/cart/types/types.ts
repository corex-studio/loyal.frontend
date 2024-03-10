import { DeliveryAreaSettings } from 'src/models/deliveryAreas/deliveryAreaSettings/deliveryAreaSettings'

export type DeliverySteps = {
  currentStep: DeliveryAreaSettings | null
  nextStep: DeliveryAreaSettings | null
  minimalRequiredSum: number
  steps: {
    orderSum: number
    deliveryPrice: number
    leftOffset: number
    hidden?: boolean
  }[]
}
