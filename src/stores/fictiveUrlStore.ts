import { defineStore } from 'pinia'
import { ref, toRef } from 'vue'
import { MenuItem } from 'src/models/menu/menuItem/menuItem'
import { menuRepo } from 'src/models/menu/menuRepo'
import { menuItemRepo } from 'src/models/menu/menuItem/menuItemRepo'
import { MenuGroup } from 'src/models/menu/menuGroups/menuGroup'
import { menuGroupRepo } from 'src/models/menu/menuGroups/menuGroupRepo'
import { useRoute } from 'vue-router'

export const useFictiveUrlStore = defineStore('fictiveUrlStore', () => {
  const _visibleMenuGroupId = ref<string | null>(null)
  const _visibleMenuGroupAlias = ref<string | null>(null)

  const lastFictiveUrl = ref('')
  const visibleMenuGroupIdManualSet = ref(false)
  const initialMenuItem = ref<string | null>(null)
  const initialMenuGroupItem = ref<string | null>(null)

  const visibleMenuGroupId = toRef(() => _visibleMenuGroupId.value)
  const visibleMenuGroupAlias = toRef(() => _visibleMenuGroupAlias.value)
  const currentNewsItem = ref('')

  const route = useRoute()

  const getInitialUrl = () => {
    const cityFromParams = route.params._cityId
    const companyFromParams = route.params._companyId
    let url = '/'
    if (cityFromParams) url += String(cityFromParams) + '/'
    if (companyFromParams) url += String(companyFromParams) + '/'
    return url
  }

  const setFictiveNewsUrl = () => {
    if (!currentNewsItem.value) return
    let url = getInitialUrl()
    if (currentNewsItem.value) {
      url += `news/${currentNewsItem.value}`
    }
    if (lastFictiveUrl.value === url) return
    lastFictiveUrl.value = url
    if (location.pathname !== url)
      history.pushState({}, '', url)
    clearNewsData()
  }

  const setFictiveCategoryUrl = () => {
    let url = getInitialUrl()
    if (visibleMenuGroupAlias.value) {
      url += `categories/${visibleMenuGroupAlias.value}`
    } else if (visibleMenuGroupId.value) {
      url += `categories/${visibleMenuGroupId.value}`
    }
    if (lastFictiveUrl.value === url) return
    lastFictiveUrl.value = url
    if (location.pathname !== url)
    history.pushState({}, '', url)
  }

  const setFictiveProductUrl = (menuItem: MenuItem) => {
    const menuGroupItem = menuRepo.item?.groups?.find(
      (v) => v.id === menuItemRepo.item?.group,
    )
    const pk = menuItem.alias || menuItem.id
    let url = getInitialUrl()
    if (menuGroupItem)
      url += `categories/${menuGroupItem.alias || menuGroupItem.id}/`
    url += `products/${pk}`
    if (url === lastFictiveUrl.value) return
    lastFictiveUrl.value = url
    if (location.pathname !== url) {
      history.pushState({}, '', url)
    }
  }

  const extractIdsFromUrl = (
    url: string,
  ): {
    categoryId: string | null
    productId: string | null
    newsId: string | null
  } => {
    let categoryId: string | null = null
    let productId: string | null = null
    let newsId: string | null = null
    const newsMatch = url.match(/\/news\/([^/]+)/)
    if (newsMatch) {
      newsId = newsMatch[1]
    }
    const categoryMatch = url.match(/\/categories\/([^/]+)/)
    if (categoryMatch) {
      categoryId = categoryMatch[1]
    }
    const productMatch = url.match(/\/categories\/[^/]+\/products\/([^/]+)/)
    if (productMatch) {
      productId = productMatch[1]
    } else {
      const productOnlyMatch = url.match(/\/products\/([^/]+)/)
      if (productOnlyMatch) {
        productId = productOnlyMatch[1]
      }
    }
    return { categoryId, productId, newsId }
  }

  const setVisibleMenuGroup = (item: MenuGroup | null) => {
    _visibleMenuGroupId.value = item?.id || null
    _visibleMenuGroupAlias.value = item?.alias || null
  }

  const scrollToGroup = (scrollTo: MenuGroup) => {
    const groupElement = document.getElementById(scrollTo.id)
    if (groupElement) {
      const y = groupElement.getBoundingClientRect().top + window.scrollY - 100
      menuGroupRepo.scrollingToGroup = true
      window.scrollTo({ top: y, behavior: 'smooth' })
      setTimeout(() => {
        const elementIndex = menuGroupRepo.elementsInViewport.findIndex(
          (el) => el === scrollTo.id,
        )
        if (elementIndex > -1)
          menuGroupRepo.elementsInViewport = [
            menuGroupRepo.elementsInViewport[elementIndex],
            ...menuGroupRepo.elementsInViewport.filter(
              (_, index) => index !== elementIndex,
            ),
          ]
        menuGroupRepo.scrollingToGroup = false
      }, 600)
    }
  }

  const clearNewsData = () => {
    currentNewsItem.value = ''
  }

  const clearMenuGroupData = () => {
    setVisibleMenuGroup(null)
  }
  const clearMenuItemData = () => {
    initialMenuItem.value = ''
  }

  return {
    lastFictiveUrl,
    visibleMenuGroupId,
    visibleMenuGroupAlias,
    visibleMenuGroupIdManualSet,
    initialMenuItem,
    initialMenuGroupItem,
    currentNewsItem,
    extractIdsFromUrl,
    setFictiveCategoryUrl,
    setFictiveProductUrl,
    setVisibleMenuGroup,
    scrollToGroup,
    setFictiveNewsUrl,
    clearNewsData,
    clearMenuGroupData,
    clearMenuItemData
  }
})
