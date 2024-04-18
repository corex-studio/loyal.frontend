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
import { Cart } from '../carts/cart'

const metrika = useYandexMetrika()

export const ecommerceImpressions = (items: MenuItem[]) => {
  const data: EcommerceImpressions = {
    currencyCode: 'RUB',
    impressions: {
      products: items.map((v) => {
        return {
          id: typeof v.product === 'string' ? v.product : v.product?.id || '',
          name: v.name || '',
          price: v.sizes[0].price || undefined,
          category: menuRepo.item?.groups?.find((el) => el.id === v.group)
            ?.name,
          position: menuRepo.item?.groups
            ?.find((el) => el.id === v.group)
            ?.items.findIndex((el) => el.id === v.id),
        }
      }),
    },
  }
  void metrika.ecommerceImpressions(data)
}

export const ecommerceClick = (item: MenuItem) => {
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
          position: cartRepo.item?.cartItems.findIndex(
            (el) => el.id === item.id,
          ),
        },
      ],
    },
  }
  void metrika.ecommerceRemove(data)
}

export const ecommercePurchase = (item: Cart) => {
  const data: EcommercePurchase = {
    currencyCode: 'RUB',
    click: {
      purchase: {
        id: item.id,
      },
      products: item.cartItems.map((v) => {
        return {
          id: v.id,
          name: v.size.name || '',
          price: v.discountedTotalSum || undefined,
          position: item.cartItems.findIndex((el) => el.id === item.id),
        }
      }),
    },
  }
  metrika.ecommercePurchase(data)
}
