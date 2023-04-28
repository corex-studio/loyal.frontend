import { CompanyGroupRaw, CompanyGroup } from './companyGroup';
import { BaseModelApi } from 'src/corexModels/apiModels/baseModelApi';

export class CompanyGroupApi extends BaseModelApi<CompanyGroup> {
  routeName = 'company_groups'
  fromJson = (json: CompanyGroupRaw) => new CompanyGroup(json)
}

export const companyGroupApi = new CompanyGroupApi();
