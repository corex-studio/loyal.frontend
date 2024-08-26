<template>

  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue && asModal"
        class="c-swipe-modal-backdrop"
        style="background-color: rgba(255,255,255,0.9)"
        @click.self="noClose ? void 0 : closeModal()"
        ref="backdropRef"
      >
        {{breakPointInPx}}
      </div>
    </Transition>
    <Teleport :to="backdropRef" :disabled="!backdropRef || !asModal">
      <dialog
        v-if="!asModal || modelValue || alwaysVisibleOnBreakpoint"
        ref="dialogRef"
        class="c-swipe-modal bg-background-color"
        :class="{ 'as-modal': asModal, [propsClasses]: $props.class }"
        :style="{
          ...$props.style,
          transform: !alwaysVisibleOnBreakpoint ? 'translateY(100%)' : '',
          borderRadius,
        }"
        :open="modelValue || !asModal || alwaysVisibleOnBreakpoint"
      >
        <div
          class="full-width flex flex-center py-8"
          style="cursor: grab"
          data-grab-immediately="true"
        >
          <div
            style="
              width: 32px;
              height: 4px;
              border-radius: 2px;
              background: #ccc;
              z-index: -1;
            "
          ></div>
        </div>
        <div
          ref="contentRef"
          class="c-swipe-modal-content"
          :style="{
            overflow:
              preventContentScrollingIfClosed && !isFullHeight ? 'hidden' : '',
          }"
        >
          <slot></slot>
        </div>
      </dialog>
    </Teleport>
  </Teleport>
</template>
<script lang="ts" setup>
import { computed, nextTick, onUpdated, ref, watch } from 'vue'
import {
  Arrayable,
  Fn,
  MaybeComputedElementRef,
  MaybeElement,
  useElementBounding,
  useEventListener,
} from '@vueuse/core'
import gsap from 'gsap'
import { isApple } from 'src/services/isApple'
import { useQuasar } from 'quasar'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'

const props = withDefaults(
  defineProps<{
    asModal?: boolean
    noClose?: boolean
    class?: string | Record<string, any>
    style?: Record<string, any>
    allowOpenFullHeight?: boolean
    breakpoint?: number | string
    alwaysVisibleOnBreakpoint?: boolean
    preventContentScrollingIfClosed?: boolean
    fullHeight?: string
  }>(),
  { asModal: true, fullHeight: '98dvh' },
)

const animationTime = 0.22

const _noClose = computed(
  () => !props.asModal || props.noClose || props.alwaysVisibleOnBreakpoint,
)

const propsClasses = computed(() => {
  if (!props.class) return ''
  if (typeof props.class === 'string') return props.class
  return Object.keys(props.class)
    .filter((k) => (props.class as Record<string, boolean>)[k])
    .join(' ')
})

const modelValue = defineModel<boolean>()
const dialogRef = ref<HTMLDialogElement | null>(null)
const backdropRef = ref<HTMLDivElement | null>(null)
const contentRef = ref<HTMLDivElement | null>(null)

const bounding = useElementBounding(
  dialogRef as unknown as MaybeComputedElementRef<HTMLElement>,
)
const bodyBounding = useElementBounding(document.body)
const contentBounding = useElementBounding(
  contentRef as unknown as MaybeComputedElementRef<MaybeElement>,
)

const isContentScrolling = ref(false)
const isFullHeight = ref(false)
const isDragging = ref(false) // следует ли модалка за пальцем
const isOpened = ref(false)
const isMoving = ref(false) // дрыгает ли человек пальцем

const initialHeight = ref(0)
const lastSwipeX = ref(0)
const lastSwipeY = ref(0)
const initialY = ref(0)
const fromInitialYDiff = ref(0) // меняется, если isDragging
const realFromInitialYDiff = ref(0) // меняется всегда
const currentSpeed = ref(0)

const lastDistanceData = ref({
  timestamp: 0,
  distance: 0,
})

const q = useQuasar()

const cleanups: Fn[] = []

const breakPointInPx = computed(() => {
  let bp = props.breakpoint
  const windowHeight = window.innerHeight
  if (typeof bp == undefined) {
    const percentFromBody = windowHeight * 0.7
    if (contentBounding.height.value > percentFromBody) return percentFromBody
  }
  if (typeof bp === 'number') return bp
  else if (typeof bp === 'string') {
    if (bp.endsWith('px')) return Number(bp.replace('px', ''))
    if (bp.endsWith('%')) {
      return (bodyBounding.height.value * Number(bp.replace('%', ''))) / 100
    }
  }
  return bp ? Number(bp) : windowHeight * 0.7
})

const emitScrollEnd = () => {
  const e = new Event('scrollend')
  if (scrollEndTimeout) clearTimeout(scrollEndTimeout)
  scrollEndTimeout = setTimeout(() => contentRef.value?.dispatchEvent(e), 100)
}
let scrollEndTimeout: NodeJS.Timeout | null = null
const setListeners = () => {
  void nextTick(() => {
    let target: Arrayable<keyof WindowEventMap> | null = null
    if (!backdropRef.value) {
      target = dialogRef
    } else target = backdropRef
    cleanups.push(useEventListener(target, 'touchmove', onTouchMove))
    cleanups.push(useEventListener(target, 'touchstart', onTouchStart))
    cleanups.push(useEventListener(target, 'touchend', onTouchEnd))

    cleanups.push(
      useEventListener(contentRef, 'scroll', () => {
        isContentScrolling.value = true

        if (isApple(q)) {
          emitScrollEnd()
          // debounce(emitScrollEnd, 50)
        }
      }),
    )
    cleanups.push(
      useEventListener(
        contentRef,
        'scrollend',
        () => (isContentScrolling.value = false),
      ),
    )
  })
}

const onTouchMove = (e: TouchEvent) => {
  if (!e.touches.length) return
  e.preventDefault()
  isMoving.value = true
  const evt = e.touches[0]
  currentSpeed.value = getSwipeSpeed(evt, e.timeStamp)
  const y = evt.clientY
  let diff = initialY.value - y
  if (Math.abs(diff) > 0 && !isDragging.value) {
    const isMinus = diff < 0
    const overValue = Math.abs(diff) * 0.1
    diff = 0
    diff += overValue
    if (isMinus) diff *= -1
  }
  realFromInitialYDiff.value = diff
  if (isFullHeight.value && isContentScrolling.value) return
  if (diff > 0 || isDragging.value) fromInitialYDiff.value = diff
}

const onTouchStart = (e: TouchEvent) => {
  if (!e.touches.length) return
  const evt = e.touches[0]
  initialY.value = evt.clientY
  lastSwipeX.value = evt.clientX
  lastSwipeY.value = evt.clientY
  lastDistanceData.value.timestamp = e.timeStamp
  const target = e.target as HTMLElement
  if (
    target.getAttribute('data-grab-immediately') ||
    target === backdropRef.value
  ) {
    isDragging.value = true
  }
}

const onTouchEnd = () => {
  if (!isMoving.value) {
    return
  }
  isMoving.value = false
  lastSwipeX.value = 0
  lastSwipeY.value = 0
  initialY.value = 0
  isDragging.value = false
  lastDistanceData.value.timestamp = 0
  lastDistanceData.value.distance = 0
  const contentScrollPosition = contentRef.value?.scrollTop || 0
  let isContentOnTop = false
  if (!contentRef.value) isContentOnTop = true
  else {
    isContentOnTop = contentScrollPosition <= 0
  }
  if (
    currentSpeed.value > 0.9 &&
    realFromInitialYDiff.value < -20 &&
    !_noClose.value &&
    !isFullHeight.value &&
    isContentOnTop
  ) {
    closeModal()
  } else if (isFullHeight.value) {
    if (isContentScrolling.value && !isContentOnTop) return
    const diffInPercentFromHeight = Math.abs(
      (realFromInitialYDiff.value / bounding.height.value) * 100,
    )
    if (diffInPercentFromHeight > 80) {
      closeModal()
    } else if (realFromInitialYDiff.value < -10) {
      if (isContentOnTop) {
        toggleFullHeight()
      }
    } else {
      toggleWithAnimation(true)
    }
  } else if (realFromInitialYDiff.value > 3 && props.allowOpenFullHeight) {
    toggleFullHeight()
  } else if (fromInitialYDiff.value < -100 && !_noClose.value) {
    closeModal()
  } else {
    toggleWithAnimation(true)
  }
}

const clearListeners = () => {
  cleanups.map((v) => v())
}

const getSwipeSpeed = (evt: Touch, timestamp: number) => {
  const xKek = (evt.clientX - lastSwipeX.value) ** 2
  const yKek = (evt.clientY - lastSwipeY.value) ** 2
  const distance = Math.sqrt(xKek + yKek)
  const currentDistanceData = { timestamp: timestamp, distance }
  const time = currentDistanceData.timestamp - lastDistanceData.value.timestamp
  const distanceDiff = Math.abs(
    currentDistanceData.distance - lastDistanceData.value.distance,
  )
  lastDistanceData.value = currentDistanceData
  lastSwipeY.value = evt.clientY
  lastSwipeX.value = evt.clientX
  return distanceDiff / (time || 1)
}

const onOpen = () => {
  if (isOpened.value) return
  isOpened.value = true
  fromInitialYDiff.value = 0
  realFromInitialYDiff.value = 0
  if (!props.alwaysVisibleOnBreakpoint)
    initialHeight.value = breakPointInPx.value
  void nextTick(() => {
    if (!dialogRef.value) return
    dialogRef.value.style.height = initialHeight.value + 'px'
  })
  toggleWithAnimation(true)
  setListeners()
  document.body.style.overflow = 'hidden'
}

const onClose = () => {
  if (!isOpened.value) return
  isOpened.value = false
  clearListeners()
  document.body.style.overflow = ''
  isFullHeight.value = false
}

const closeModal = () => {
  if (!props.asModal) return
  runCloseAnimation()
  onClose()
}


onUpdated(() => {
  if (props.alwaysVisibleOnBreakpoint && breakPointInPx.value) {
    initialHeight.value = breakPointInPx.value
    onOpen()
  }
})

const toggleWithAnimation = async (newModelValue: boolean) => {
  // console.trace('toggleWithAnimation')
  void nextTick(async () => {
    if (!dialogRef.value) return
    const styles = dialogRef.value.style

    await nextTick(() => {
      gsap.to(dialogRef.value, {
        transform: `translateY(${newModelValue ? '0' : '100'}%)`,
        duration: animationTime,
      })
    })

    setTimeout(() => {
      styles.transition = ''
      styles.transform = ''
      fromInitialYDiff.value = 0
      realFromInitialYDiff.value = 0
     if (modelValue.value === newModelValue) return
      modelValue.value = newModelValue
    }, animationTime * 1000)
  })
}

const runCloseAnimation = async () => {
  void toggleWithAnimation(false)
}

const toggleFullHeight = async () => {
  if (!dialogRef.value) return
  const styles = dialogRef.value.style
  await nextTick(() => {
    if (dialogRef.value) {
      gsap.to(dialogRef.value, {
        height: bounding.height.value + 'px',
        duration: animationTime,
      })
    }
    {
      fromInitialYDiff.value = 0
      realFromInitialYDiff.value = 0
    }
  })
  if (!isFullHeight.value && !props.allowOpenFullHeight)
    initialHeight.value = bounding.height.value
  gsap.to(dialogRef.value, {
    height: isFullHeight.value ? initialHeight.value + 'px' : props.fullHeight,
    duration: animationTime,
  })
  await nextTick(() => {
    setTimeout(() => {
      styles.transition = ''
      if (isFullHeight.value) styles.height = initialHeight.value + 'px'
      isFullHeight.value = !isFullHeight.value
    }, animationTime * 1000)
  })
}

watch(modelValue, (v) => {
  if (v) onOpen()
  else onClose()
})

watch(fromInitialYDiff, (v) => {
  if (!dialogRef.value) return
  gsap.to(dialogRef.value, {
    transform: `translateY(${v * -1}px)`,
    duration: animationTime,
  })
})

const contentScrollTo = (value: ScrollToOptions) => {
  if (!contentRef.value) return
  contentRef.value.scrollTo(value)
}

const borderRadius = computed(() => {
  const v = uiSettingsRepo.item?.borderRadius || 0
  return `${v}px ${v}px 0 0`
})

defineExpose({
  open: onOpen,
  toggleFullHeight,
  isOpened,
  isFullHeight,
  contentScrollTo,
  contentRef,
})
</script>
<style lang="scss" scoped>
.c-swipe-modal {
  padding: 0;
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 99999;
  border: unset;

  &:after {
    content: '';
    background: inherit;
    width: inherit;
    height: 400%;
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: -1;
  }
}

.c-swipe-modal-backdrop {
  background: rgba(0, 0, 0, 0.8);
  position: absolute;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
  z-index: 10000;
}

.c-swipe-modal-content {
  overflow-y: auto;
  max-height: calc(100% - 36px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
