import { ProductRaw, Product } from './product';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';

export class ProductApi extends BaseModelApi<Product> {
  routeName = 'products'
  fromJson = (json: ProductRaw) => new Product(json)
}

export const productApi = new ProductApi();
