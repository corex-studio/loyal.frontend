import { Table } from './table';
import BaseRepo from 'src/corexModels/apiModels/baseRepo';
import { tableApi } from './tableApi';
import { reactive } from 'vue';

export class TableRepo extends BaseRepo<Table> {
  api = tableApi;
}

export const tableRepo = reactive(new TableRepo());
