import { TableRaw, Table } from './table';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';

export class TableApi extends BaseModelApi<Table> {
  routeName = 'tables'
  fromJson = (json: TableRaw) => new Table(json)
}

export const tableApi = new TableApi();
