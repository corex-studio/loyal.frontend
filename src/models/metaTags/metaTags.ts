import { LocalStorage, useMeta } from 'quasar'
import { companyGroupRepo } from '../companyGroup/companyGroupRepo'
import { MetaOptions } from 'quasar/dist/types/meta'

export const setMeta = (initialMeta?: Record<string, any>) => {
  const currentCompany = companyGroupRepo.item?.companies.find(v => v.id === LocalStorage.getItem('cartCompany'))
  const siteData = localStorage.getItem('siteDataResponse')
  let siteName = currentCompany?.name || null
  let siteDescription = currentCompany?.description || null
  if ((siteData && !currentCompany) || (siteData && !companyGroupRepo.item?.companies.length)) {
    siteName = JSON.parse(siteData).title
    siteDescription = JSON.parse(siteData).description
  }
  const metaData: MetaOptions = {
    title: initialMeta?.title
      ? String(initialMeta?.title)
      : siteName || companyGroupRepo.item?.name || 'Loyalhub',
    // titleTemplate: (title: any) => `${title}`,
    meta: {
      description: {
        name: 'description',
        content: siteDescription,
      },
      keywords: { name: 'keywords', content: initialMeta?.keywords || '' },
    },
  }
  useMeta(metaData)
}
