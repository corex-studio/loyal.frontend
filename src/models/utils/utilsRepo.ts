import { Utils } from './utils';
import BaseRepo from 'src/corexModels/apiModels/baseRepo';
import { utilsApi } from './utilsApi';
import { reactive } from 'vue';

export class UtilsRepo extends BaseRepo<Utils> {
  api = utilsApi;

  async suggestAddresses(search: string) {
    const res = await this.api.suggest(search);
    res.forEach((v) => v.coords.reverse());
    return res;
  }

  // async suggestAddresses(search: string): Promise<Array<Address>> {
  //   const res: Address[] = await this.api.send({
  //     method: 'GET',
  //     action: 'addresses/suggest',
  //     params: {
  //       search: search,
  //     },
  //   });
  //   return res;
  // }
}

export const utilsRepo = reactive(new UtilsRepo());
