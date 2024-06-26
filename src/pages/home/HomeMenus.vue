<template>
  <div>
    <template v-if="(!$salesPoint.menuLoading || $menu.item) && menuItems">
      <div
        v-for="(el, index) in menuItems"
        :key="index"
        class="full-width pt-md-20 pt-xs-10"
        :id="el.id"
        ref="menuGroupRefs"
      >
        <div class="header bold mb-lg-15 mb-md-15 mb-xs-8">
          {{ el.name }}
        </div>

        <div v-if="el.items.length" class="row full-width">
          <GridContainer
            :items="el.items"
            :lg="4"
            :xl="4"
            :md="3"
            :sm="2"
            :xs="2"
            :gap="$q.screen.gt.md ? '20px' : $q.screen.md ? '16px' : '8px'"
          >
            <template v-slot:item="{ item }">
              <MenuItemCard :item="item as MenuItem" />
            </template>
          </GridContainer>
        </div>
        <div v-else>Пусто</div>
      </div>
    </template>
    <div v-else class="full-width">
      <q-skeleton type="text" width="210px" height="45px" class="mb-10 mt-18" />
      <GridContainer
        :items="[1, 2, 3, 4, 5, 6, 7, 8]"
        :lg="4"
        :xl="4"
        :md="3"
        :sm="2"
        :xs="2"
        :gap="$q.screen.gt.md ? '30px' : $q.screen.md ? '16px' : '8px'"
      >
        <template v-slot:item="{ item }">
          <MenuItemSkeleton :id="item" />
        </template>
      </GridContainer>
    </div>
  </div>
</template>
<script lang="ts" setup>
import MenuItemCard from 'src/components/cards/MenuItemCard.vue'
import MenuItemSkeleton from 'src/components/cards/MenuItemSkeleton.vue'
import GridContainer from 'src/components/containers/GridContainer.vue'
import { ecommerceImpressions } from 'src/models/ecommerceEvents/ecommerceEvents'
import { MenuItem } from 'src/models/menu/menuItem/menuItem'
import { menuItemRepo } from 'src/models/menu/menuItem/menuItemRepo'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { scroll } from 'quasar'
import { Fn, useElementBounding, useEventBus, useEventListener } from '@vueuse/core'
import { menuRepo } from 'src/models/menu/menuRepo'
import { maxBy } from 'lodash'
import getVerticalScrollPosition = scroll.getVerticalScrollPosition
import { useFictiveUrlStore } from 'stores/fictiveUrlStore'
import { useRoute } from 'vue-router'
import { onCloseProductModalKey } from 'src/services/eventBusKeys'

const { getScrollTarget } = scroll
const scrollBodyTatget = getScrollTarget(document.body)
const menuGroupRefs = ref<HTMLDivElement[]>([])
const menuGroupsBounding = ref<
  Record<number, ReturnType<typeof useElementBounding>>
>({})

const cleanups: Fn[] = []
const fictiveUrlStore = useFictiveUrlStore()

onMounted(async () => {
  try {
    await initMenuGroupsBounding()
    cleanups.push(
      useEventListener(document, 'scroll', setCurrentActiveMenuGroupId),
    )
    useEventBus(onCloseProductModalKey).on(() => setCurrentActiveMenuGroupId())
  } catch {
    console.error('menu groups ref is empty')
  }
})

type VisibleElement = {
  index: number
  visibleHeight: number
  fromTop: number
  fromBottom: number
}

const setCurrentActiveMenuGroupId = () => {
  const visible: VisibleElement[] = []
  for (const [i, _v] of Object.entries(menuGroupsBounding.value)) {
    const v = _v as unknown as Record<keyof typeof _v, number>
    const top = v.top
    const bottom = v.bottom
    const fromBottom = window.innerHeight - v.bottom
    let visibleHeight = 0
    if (top > 0 && fromBottom > 0) {
      visibleHeight = window.innerHeight - top - fromBottom
    } else if (top > 0) {
      visibleHeight = window.innerHeight - top
    } else if (bottom > 0) {
      visibleHeight = window.innerHeight - fromBottom
    } else if (top < 0 && fromBottom < 0) {
      visibleHeight = window.innerHeight
    }
    visibleHeight = visibleHeight < 0 ? 0 : visibleHeight
    if (visibleHeight)
      visible.push({
        index: Number(i),
        fromBottom,
        fromTop: top,
        visibleHeight,
      })
  }
  _setCurrentActiveMenuGroupId(visible)
}

const _setCurrentActiveMenuGroupId = (visibleItems: VisibleElement[]) => {
  if (fictiveUrlStore.visibleMenuGroupIdManualSet) return
  const scrollPosition = getVerticalScrollPosition(scrollBodyTatget)
  if (!visibleItems.length || scrollPosition < 20) {
    fictiveUrlStore.setVisibleMenuGroup(null)
  } else if (scrollPosition < 80) {
    fictiveUrlStore.setVisibleMenuGroup(menuItems.value.at(visibleItems[0].index) || null)
  } else {
    const filtered = visibleItems.filter((v) => v.visibleHeight > 80)
    const item = maxBy(filtered, (v) => v.fromTop)
    if (item && !fictiveUrlStore.visibleMenuGroupIdManualSet) {
      fictiveUrlStore.setVisibleMenuGroup(menuItems.value.at(item.index) || null)
    }
  }
}

const initMenuGroupsBounding = async () => {
  return new Promise((resolve, reject) => {
    let attempts = 0
    const interval = setInterval(() => {
      if (attempts > 40) {
        if (interval) clearInterval(interval)
        reject()
      }
      if (menuGroupRefs.value.length) {
        for (const [index, menuGroupRef] of menuGroupRefs.value.entries()) {
          menuGroupsBounding.value[index] = useElementBounding(menuGroupRef)
        }
        if (interval) clearInterval(interval)
        resolve(void 0)
      } else {
        attempts++
      }
    }, 50)
  })
}

const menuItems = computed(() => {
  return menuRepo.item?.groups?.filter((v) => v.items.length) || []
})

let timeout: NodeJS.Timeout | null = null

watch(
  () => menuItemRepo.visibleItems.length, // todo check on work
  () => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      void ecommerceImpressions(menuItemRepo.visibleItems)
    }, 500)
  },
)

const stopWatchUrlHandle = watch(
  computed(() => `${fictiveUrlStore.visibleMenuGroupId}${fictiveUrlStore.visibleMenuGroupAlias}`),
  () => {
    if (!fictiveUrlStore.initialMenuItem)
    fictiveUrlStore.setFictiveCategoryUrl()
  },
)

onBeforeUnmount(() => {
  cleanups.forEach((v) => v())
  stopWatchUrlHandle()
})
</script>

<style lang="scss" scoped>
.inactive-company {
  border: 1px var(--on-background-color) solid;
}

.active-company {
  width: fit-content;
  border: 2px var(--primary) solid;
}
</style>
