import { Product } from './product'
import BaseRepo from 'src/corexModels/apiModels/baseRepo'
import { productApi } from './productApi'
import { reactive } from 'vue'

export class ProductRepo extends BaseRepo<Product> {
  api = productApi
  filters: {
    search: string | null
  } = { search: null }
  selectedProducts: string[] = []
}

export const productRepo = reactive(new ProductRepo())
