import { CompanyGroup, TermsOfServiceInfo } from './companyGroup';
import BaseRepo from 'src/corexModels/apiModels/baseRepo';
import { companyGroupApi } from './companyGroupApi';
import { reactive } from 'vue';

export class CompanyGroupRepo extends BaseRepo<CompanyGroup> {
  api = companyGroupApi;

  async getTermsOfServiceInfo(header: string) {
    const res: TermsOfServiceInfo = await this.api.send({
      method: 'GET',
      action: 'terms_of_service_info',
      headers: {
        'Company-Group': header,
      },
    });

    return res;
  }
}

export const companyGroupRepo = reactive(new CompanyGroupRepo());
