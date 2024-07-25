import { useMeta } from 'quasar'
import { companyGroupRepo } from '../companyGroup/companyGroupRepo'

export const setMeta = (initialMeta?: Record<string, any>) => {
  const siteData = localStorage.getItem('siteDataResponse')
  let siteName = null
  let siteDescription = null
  if (siteData) {
    siteName = JSON.parse(siteData).title
    siteDescription = JSON.parse(siteData).description
  }
  const metaData = {
    title: initialMeta?.title
      ? String(initialMeta?.title)
      : siteName || companyGroupRepo.item?.name || 'Loyalhub',
    titleTemplate: (title: any) => `${title}`,
    meta: {
      description: {
        name: 'description',
        content: initialMeta?.description || siteDescription || '',
      },
      keywords: { name: 'keywords', content: initialMeta?.keywords || '' },
    },
  }

  useMeta(metaData)
}
