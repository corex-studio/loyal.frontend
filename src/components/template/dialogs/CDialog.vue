<template>
  <q-dialog
    class="no-shadow"
    :position="position"
    :persistent="persistent"
    :square="square"
    :modelValue="modelValue"
    :no-backdrop-dismiss="noBackdropDismiss"
    @update:modelValue="noClose ? void 0 : $emit('update:modelValue')"
    :class="{ 'maximize-modal': maximize }"
  >
    <q-card
      :style="`max-width: ${width}; min-height: ${height}; max-height: ${height}; height: ${heightPercent}; border-radius:${
        position === 'bottom' ? bottomBorderRadius() : ''
      } ${cardStyles || ''}`"
      style="width: 100%; display: flex; transition: 0.2s"
      class="relative-position no-overflow column no-wrap no-shadow bg-background-color"
      :class="{ 'border-radius': position !== 'bottom' }"
    >
      <div
        v-if="$slots.header"
        class="row full-width items-center header3 bold px-md-15 px-xs-8 bg-background-color text-on-background-color mt-15"
      >
        <slot name="header"></slot>
      </div>
      <div
        :class="[
          !noPadding ? 'pb-md-15 pb-xs-12 px-md-15 px-xs-8' : dialogClass,
          noPadding ? '' : $slots.header ? 'pt-10' : 'pt-md-15 pt-xs-12',
        ]"
        :style="`${disableOverflow ? '' : `overflow-y:${noOverflow ? 'hidden' : 'auto'}; overflow-x: hidden;`}
          width: 100%;
          height: 100%;
          max-height: inherit;
           ${contentWrapperStyles || ''}
          `"
      >
        <div
          style="position: absolute; z-index: 1"
          :style="{
            top: $q.screen.gt.sm ? '-24px' : '-40px',
            right: $q.screen.gt.sm ? '-29px' : '5px',
          }"
        >
          <CIcon
            v-if="!noClose && !hideClose"
            class="cursor-pointer"
            hoverColor="primary"
            color="white"
            name="fa-light fa-xmark"
            size="32px"
            v-close-popup
          />
        </div>
        <slot></slot>
        <q-card-actions
          :align="alignActions"
          v-if="!hideActions && $slots['card-actions']"
        >
          <slot name="card-actions"></slot>
        </q-card-actions>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import CIcon from '../helpers/CIcon.vue'
import { watch } from 'vue'

const props = defineProps({
  hideActions: Boolean,
  alignActions: {
    type: String,
    default: 'center',
  },
  modelValue: Boolean,
  square: Boolean,
  width: {
    type: String,
    default: '654px',
  },
  height: {
    type: String,
  },
  position: {
    type: String,
    default: 'standard',
  },
  noClose: Boolean,
  hideClose: Boolean,
  noBackdropDismiss: Boolean,
  persistent: Boolean,
  noPadding: Boolean,
  dialogClass: String,
  image: String,
  imageClass: String,
  imageWidth: String,
  noOverflow: Boolean,
  heightPercent: String,
  withOverflow: Boolean,
  maximize: Boolean,
  cardStyles: String,
  contentWrapperStyles: String,
  disableOverflow: Boolean,
})
defineEmits(['update:modelValue'])

const bottomBorderRadius = () => {
  return `${uiSettingsRepo.item?.borderRadius}px ${uiSettingsRepo.item?.borderRadius}px 0 0`
}

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  },
)
</script>

<style lang="scss" scoped>
.no-overflow {
  overflow: unset !important;
}

.closeBtn :deep(.q-btn__content .q-icon) {
  position: absolute;
}

.closeBtn::before {
  box-shadow: -1px 1px 8px rgb(0 0 0 / 10%) !important;
}

.closeBtn :deep(.q-btn__content .q-icon):hover {
  color: $accent3;
  transition: 0.25s;
}

.closeBtn :deep(.q-btn__content .q-icon) {
  color: $secondary;
  transition: 0.25s;
}
</style>
