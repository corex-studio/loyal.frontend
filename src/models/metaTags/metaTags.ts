import { useMeta } from 'quasar'

export const setMeta = (initialMeta?: Record<string, any>) => {
  const metaData = {
    title: initialMeta?.title ? String(initialMeta?.title) : 'Loyalhub',
    titleTemplate: (title: any) => `${title}`,
    meta: {
      description: {
        name: 'description',
        content: initialMeta?.description || '',
      },
      keywords: { name: 'keywords', content: initialMeta?.keywords },
    },
  }

  useMeta(metaData)
}
