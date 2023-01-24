<template>
  <div
    class="full-width c-expansion"
    :class="`${localShowed && underlineExpanded ? 'expanded' : ''} ${
      colorExpanded && localShowed
        ? `bg-${colorExpanded}`
        : bgColor
        ? `bg-${bgColor}`
        : 'bg-transparent'
    } ${expandedClasses && localShowed ? expandedClasses : ''}`"
    :style="`background-color: ${colorExpanded}`"
    style="transition: all 0.4s ease-out"
  >
    <div
      @click="toggle(true)"
      :class="`${headClasses} ${customHead ? '' : 'cursor-pointer'}`"
      class="row items-center no-wrap"
    >
      <template v-if="!customHead">
        <CIcon
          v-if="icon"
          :name="icon"
          :color="localShowed || active ? textColorExpanded : textColor"
        />
        <div
          v-if="showStatus && !status"
          style="height: 8px; width: 8px"
          class="bg-red rounded-borders mr-2 pr-4 ml-3"
        ></div>
        <div
          class="expansionLabel row items-center"
          :class="`${
            localShowed || active
              ? `text-${textColorExpanded} `
              : `text-${textColor}`
          } ${labelClasses}`"
          :style="labelStyle"
          v-if="label && !onlyIcons && !miniState"
        >
          {{ label }}
        </div>
        <div class="flex column self-end flex-grow-1 ml-3">
          <CIcon
            class="self-end"
            :size="expandIconSize"
            :color="localShowed || active ? textColorExpanded : textColor"
            v-if="!onlyIcons && !miniState && !dontOpen"
            :name="expandIcon ? expandIcon : 'fal fa-chevron-down'"
            style="transition: 0.2s"
            :style="`${localShowed ? 'transform: rotateZ(180deg);' : ''}
          `"
          />
        </div>
      </template>
      <template v-else>
        <div class="row full-width" :class="customHeadClasses">
          <slot name="head"></slot>
          <CIcon
            class="self-end"
            :size="expandIconSize"
            :color="expandIconColor_"
            v-if="!onlyIcons && !miniState && !dontOpen && customHeadExpandIcon"
            :name="expandIcon ? expandIcon : 'fal fa-chevron-down'"
            style="transition: 0.2s"
            :style="`${localShowed ? 'transform: rotateZ(180deg);' : ''}
          `"
          />
        </div>
      </template>
    </div>
    <div
      ref="toggleItem"
      style="display: none; transition: all 0.2s ease-in"
      class="full-width c-expansion-content"
    >
      <transition>
        <div
          style="display: inline-block; width: 100%"
          :class="noPadding ? '' : 'px-2'"
        >
          <slot></slot>
        </div>
      </transition>
    </div>
    <q-separator
      style="transition: all 0.2s ease-in"
      v-if="separator"
      :color="separatorColor_"
      :class="{ 'mt-5': localShowed }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watchEffect } from 'vue'
import CIcon from '../helpers/CIcon.vue'

const props = defineProps({
  noPadding: Boolean,
  icon: String,
  label: String,
  labelClasses: String,
  labelStyle: String,
  onlyIcons: Boolean,
  defaultOpened: Boolean,
  miniState: Boolean,
  textColorExpanded: {
    type: String,
    default: 'black',
  },
  colorExpanded: {
    type: String,
    default: 'transparent',
  },
  textColor: {
    type: String,
    default: 'black',
  },
  underlineExpanded: Boolean,
  dontOpen: Boolean,
  separator: Boolean,
  separatorColor: {
    type: String,
    default: 'secondary1',
  },
  separatorColorExpanded: {
    type: String,
    default: 'accent4',
  },
  headClasses: String,
  grouped: Boolean,
  showed: Boolean,
  active: Boolean,
  status: Boolean,
  showStatus: Boolean,
  transitionTime: {
    type: String,
    default: '200',
  },
  expandIcon: String,
  expandIconSize: String,
  customHead: Boolean,
  noExpandedColor: Boolean,
  bgColor: String,
  expandText: Object as () => ExpandText,
  leftExpandText: Boolean,
  expandIconColor: Object as () => ExpandIconColor,
  expandedClasses: String,
  badge: Boolean,
  customHeadExpandIcon: Boolean,
  customHeadClasses: String,
  defaulOpenedAnimated: Boolean,
})

type ExpandText = {
  opened: string
  closed: string
}

type ExpandIconColor = {
  opened: string
  closed: string
}

const emit = defineEmits(['click'])

const toggleItem = ref<HTMLDivElement>()

onMounted(() => {
  if (props.defaultOpened && !localShowed.value) {
    toggle()
  }
})

const expandIconColor_ = computed(() => {
  if (localShowed.value || props.active) {
    if (props.expandIconColor) {
      return props.expandIconColor?.opened
    } else return props.textColorExpanded
  } else {
    if (props.expandIconColor) {
      return props.expandIconColor?.closed
    } else return props.textColor
  }
})

const localShowed = ref(false)

const toggle = (click = false) => {
  if (click) emit('click')
  if (click && props.grouped) return
  if (props.dontOpen || (props.miniState && !localShowed.value)) return
  if (toggleItem.value && toggleItem.value.firstElementChild) {
    if (!localShowed.value) {
      toggleItem.value.style.overflow = 'hidden'
      toggleItem.value.style.display = 'block'
      toggleItem.value.style.height = '0px'
      toggleItem.value.style.height = `${toggleItem.value?.firstElementChild?.clientHeight}px`
      localShowed.value = true
    } else {
      toggleItem.value.style.overflow = 'hidden'
      toggleItem.value.style.height = `${toggleItem.value?.firstElementChild?.clientHeight}px`
      window.getComputedStyle(toggleItem.value, null).getPropertyValue('height')
      toggleItem.value.style.height = '0px'
      localShowed.value = false
    }
    setTimeout(() => {
      toggleItem.value?.style.removeProperty('height')
      toggleItem.value?.style.removeProperty('overflow')
      if (toggleItem.value && localShowed.value) {
        toggleItem.value.style.removeProperty('display')
      } else if (toggleItem.value) {
        toggleItem.value.style.display = 'none'
      }
    }, 210)
  }
}

const separatorColor_ = computed(() => {
  if (props.separatorColor && !props.separatorColorExpanded) {
    return props.separatorColor
  } else if (props.separatorColorExpanded && localShowed.value) {
    return props.separatorColorExpanded
  }
  return props.separatorColor
})

watchEffect(() => {
  if (props.miniState && localShowed.value) {
    toggle()
  }
  if (props.grouped) {
    if (props.showed && !localShowed.value) toggle()
    if (!props.showed && localShowed.value) toggle()
  }
})
//
</script>

<style scoped lang="scss">
.expansionLabel {
  position: relative;
}

.c-expansion .expansionLabel::before {
  background-color: #3e9e9b;
  bottom: 0;
  content: '';
  display: block;
  height: 1px;
  margin-top: 3px;
  position: absolute;
  transition: 0.3s;
  width: 0;
}

.c-expansion.expanded > div > .expansionLabel::before {
  background-color: #3e9e9b;
  transition: 0.3s;
  width: 100%;
}
</style>
