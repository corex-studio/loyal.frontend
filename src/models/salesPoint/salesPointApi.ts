import { SalesPointRaw, SalesPoint } from './salesPoint'
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi'

export class SalesPointApi extends BaseModelApi<SalesPoint> {
  routeName = 'sales_points'
  fromJson = (json: SalesPointRaw) => new SalesPoint(json)
}

export const salesPointApi = new SalesPointApi()
