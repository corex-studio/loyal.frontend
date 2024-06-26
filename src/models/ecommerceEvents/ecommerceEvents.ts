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
      products: items.map((v, index) => {
        return {
          id: typeof v.product === 'string' ? v.product : v.product?.id || '',
          name: v.name || '',
          price: v.sizes[0].price || undefined,
          category: menuRepo.item?.groups?.find((el) => el.id === v.group)
            ?.name,
          position: index + 1,
        }
      }),
    },
  }
  void metrika.ecommerceImpressions(data)
}

export const ecommerceClick = (item: MenuItem) => {
  const index =
    menuRepo.item?.groups
      ?.find((el) => el.id === item.group)
      ?.items.findIndex((el) => el.id === item.id) || -1

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
          position: index > -1 ? index + 1 : undefined,
        },
      ],
    },
  }
  void metrika.ecommerceClick(data)
}

export const ecommerceDetail = (item: MenuItem) => {
  const index = menuRepo.item?.groups
      ?.find((el) => el.id === item.group)
      ?.items.findIndex((el) => el.id === item.id) || -1
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
          position: index > -1 ? index + 1 : undefined
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

export const ecommerceRemove = (item: CartItem | Cart) => {
  let data: EcommerceRemove | null = null
  if ('cartItems' in item) {
    data = {
      currencyCode: 'RUB',
      remove: {
        products: item.cartItems.map((el, index) => {
          return {
            id: el.id,
            name: el.size.name || '',
            price: el.discountedTotalSum || undefined,
            position: index,
          }
        }),
      },
    }
  } else {
    data = {
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
  }
  void metrika.ecommerceRemove(data)
}

export const ecommercePurchase = (item: Cart) => {
  const data: EcommercePurchase = {
    currencyCode: 'RUB',
    purchase: {
      actionField: {
        id: item.id,
      },
      products: item.cartItems.map((v, index) => {
        return {
          id: v.id,
          name: v.size.name || '',
          price: v.discountedTotalSum / v.quantity || undefined,
          quantity: v.quantity,
          position: index + 1,
        }
      }),
    },
  }
  metrika.ecommercePurchase(data)
}
