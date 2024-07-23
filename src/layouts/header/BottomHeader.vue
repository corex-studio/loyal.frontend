<template>
  <div ref="bottomHeader" class="row full-width bg-background-color">
    <div class="row no-wrap items-center full-width">
      <div
        :style="
          $cart.item || categories?.length
            ? `height: ${$q.screen.gt.sm ? '48' : '42'}px`
            : ''
        "
        class="row full-width border-radius no-wrap body items-center gap-10 content-row relative-position"
      >
        <Transition name="fade">
          <div v-if="showLeftBlurer" class="left-blurer"></div>
        </Transition>
        <Transition name="fade">
          <div v-if="showRightBlurer" class="right-blurer"></div>
        </Transition>
        <div
          ref="scrollArea"
          v-dragscroll
          class="row gap-sm-14 gap-xs-8 no-wrap items-center no-scrollbar "
          style="overflow-x: scroll"
          @dragscrollend="onDragEnd"
          @dragscrollstart="onDragStart"
        >
          <div
            v-if="categories && (!$salesPoint.menuLoading || $menu.item)"
            class="gap-lg-7 gap-xs-6 gap-md-8 no-wrap items-center no-scrollbar row"
            style="transition: 0.25s all ease"
          >
            <div
              v-for="(el, index) in categories"
              :key="index"
              ref="groupButtons"
            >
              <GroupButton
                :key="key"
                :is-selected="fictiveUrlStore.visibleMenuGroupId === el.id"
                :item="el"
              />
            </div>
          </div>
          <template v-if="$salesPoint.menuLoading && !$menu.item">
            <q-skeleton
              v-for="(el, index) in [1, 2, 3, 4, 5, 6, 7]"
              :key="index"
              class="mt-5"
              style="margin-bottom: 13px; width: 180px"
            >
            </q-skeleton>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import GroupButton from './GroupButton.vue'
import { useRoute, useRouter } from 'vue-router'
import { menuRepo } from 'src/models/menu/menuRepo'
import { dragscroll } from 'vue-dragscroll'
import { store } from 'src/models/store'
import { debounce } from 'quasar'
import { useFictiveUrlStore } from 'stores/fictiveUrlStore'

const vDragscroll = dragscroll
const bottomHeader = ref<Element | null>(null)
const key = ref(0)
const route = useRoute()
const groupButtons = ref<HTMLDivElement[]>([])
const scrollArea = ref<HTMLDivElement>()
const offsetForScroll = ref(0)
const fictiveUrlStore = useFictiveUrlStore()
const router = useRouter()
const showLeftBlurer = ref(false)
const showRightBlurer = ref(true)


const categories = computed(() => {
  return menuRepo.item?.groups?.filter((v) => v.items.length)
})

const selectedIndex = computed(() => {
  return (
    categories.value?.findIndex((v) => v.id === fictiveUrlStore.visibleMenuGroupId) ?? -1
  )
})

watch(selectedIndex, (i) => {
  if (i < 0 || !groupButtons.value.length) return
  offsetForScroll.value = groupButtons.value[i].offsetLeft || 0
  scrollToSelectedIndex()
})

const _scrollToSelectedIndex = () => {
  scrollArea.value?.scrollTo({
    left: offsetForScroll.value,
    behavior: 'smooth'
  })
}

const scrollToSelectedIndex = debounce(_scrollToSelectedIndex, 150)

watch(
  () => route.name,
  () => {
    if (router.isIncludesRouteName(['home', 'qrHome'])) {
      key.value++
    }
  }
)
let dragTimeout: NodeJS.Timeout | null = null

const onDragStart = () => {
  if (dragTimeout) clearTimeout(dragTimeout)
  store.groupDragged = false
  dragTimeout = setTimeout(() => {
    store.groupDragged = true
  }, 100)
}

const onDragEnd = () => {
  if (dragTimeout) clearTimeout(dragTimeout)
  setTimeout(() => (store.groupDragged = false))
}

const handleBlurersStates = () => {
  scrollArea.value?.addEventListener('scroll', () => {
    if (!scrollArea.value) return
    const delta = scrollArea.value?.scrollWidth - scrollArea.value.scrollLeft
    showRightBlurer.value = delta - scrollArea.value?.offsetWidth >= 15
    showLeftBlurer.value = scrollArea.value && scrollArea.value.scrollLeft > 0
  })
}

onMounted(() => {
  handleBlurersStates()
})


</script>

<style lang="scss" scoped>
.left-blurer {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 130px;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(90deg, var(--background-color) 0%, rgba(255, 255, 255, 0) 50%);
}

.right-blurer {
  position: absolute;
  right: 0;
  top: 0;
  pointer-events: none;
  height: 100%;
  width: 130px;
  z-index: 1;
  background: linear-gradient(270deg, var(--background-color) 0%, rgba(255, 255, 255, 0) 50%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
