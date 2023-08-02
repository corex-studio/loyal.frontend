import { CompanyRaw, Company } from './company';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';

export class CompanyApi extends BaseModelApi<Company> {
  routeName = 'companies';
  fromJson = (json: CompanyRaw) => new Company(json);
}

export const companyApi = new CompanyApi();
