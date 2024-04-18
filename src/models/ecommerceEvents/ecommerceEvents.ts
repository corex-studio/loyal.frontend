import { useYandexMetrika } from 'yandex-metrika-vue3'
import {
  EcommerceAdd,
  EcommerceClick,
  EcommerceDetail,
  EcommerceImpressions,
  EcommercePurchase,
  EcommerceRemove,
} from 'yandex-metrika-vue3/src/types'
import { MenuItem } from '../menu/menuItem/menuItem'
import { menuRepo } from '../menu/menuRepo'

const metrika = useYandexMetrika()

export const ecommerceImpressions = (data: EcommerceImpressions) => {
  metrika.ecommerceImpressions(data)
}

export const ecommerceClick = (item: MenuItem) => {
  console.log(metrika)

  const data: EcommerceClick = {
    currencyCode: 'RUB',
    click: {
      products: [
        {
          id:
            typeof item.product === 'string'
              ? item.product
              : item.product?.id || '',
          name: item.name || '',
          price: item.sizes[0].price || undefined,
          category: menuRepo.item?.groups?.find((el) => el.id === item.group)
            ?.name,
          position: menuRepo.item?.groups
            ?.find((el) => el.id === item.group)
            ?.items.findIndex((el) => el.id === item.id),
        },
      ],
    },
  }
  void metrika.ecommerceClick(data)
}

export const ecommerceDetail = (item: MenuItem) => {
  const data: EcommerceDetail = {
    currencyCode: 'RUB',
    detail: {
      products: [
        {
          id:
            typeof item.product === 'string'
              ? item.product
              : item.product?.id || '',
          name: item.name || '',
          price: item.sizes[0].price || undefined,
          category: menuRepo.item?.groups?.find((el) => el.id === item.group)
            ?.name,
          position: menuRepo.item?.groups
            ?.find((el) => el.id === item.group)
            ?.items.findIndex((el) => el.id === item.id),
        },
      ],
    },
  }
  void metrika.ecommerceDetail(data)
}

export const ecommerceAdd = (data: EcommerceAdd) => {
  metrika.ecommerceAdd(data)
}

export const ecommerceRemove = (data: EcommerceRemove) => {
  metrika.ecommerceRemove(data)
}

export const ecommercePurchase = (data: EcommercePurchase) => {
  metrika.ecommercePurchase(data)
}
