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
import { CartItem } from '../carts/cartItem/cartItem'
import { cartRepo } from '../carts/cartRepo'

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

export const ecommerceAdd = (item: MenuItem) => {
  const data: EcommerceAdd = {
    currencyCode: 'RUB',
    add: {
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
  void metrika.ecommerceAdd(data)
}

export const ecommerceRemove = (item: CartItem) => {
  const data: EcommerceRemove = {
    currencyCode: 'RUB',
    remove: {
      products: [
        {
          id: item.id,
          name: item.size.name || '',
          price: item.discountedTotalSum || undefined,
          // category: menuRepo.item?.groups?.find((el) => el.id === item.group)
          //   ?.name,
          position: cartRepo.item?.cartItems.findIndex(
            (el) => el.id === item.id,
          ),
        },
      ],
    },
  }
  void metrika.ecommerceRemove(data)
}

export const ecommercePurchase = (data: EcommercePurchase) => {
  metrika.ecommercePurchase(data)
}
