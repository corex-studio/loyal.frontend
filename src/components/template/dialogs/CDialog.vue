<template>
  <q-dialog
    class="no-shadow"
    :position="position"
    :persistent="persistent"
    :square="square"
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue')"
  >
    <q-card
      :style="`max-width: ${width}; min-height: ${height}; max-height: ${height}; height: ${heightPercent}`"
      style="
        width: 100%;
        display: flex;
        box-shadow: 0px 0px 13px rgba(65, 39, 130, 0.2) !important;
      "
      class="relative-position no-overflow border-radius column no-wrap no-shadow bg-background-color"
    >
      <!-- bg-modal-header-color text-on-modal-header-color -->
      <div
        v-if="$slots.header"
        class="row full-width items-center header2 bold px-15 bg-background-color text-on-background-color mt-15"
      >
        <slot name="header"></slot>
      </div>
      <div
        :class="[
          !noPadding ? 'pb-15 px-15' : dialogClass,
          $slots.header ? (noPadding ? '' : 'pt-10') : 'pt-15 ',
        ]"
        :style="`overflow:${noOverflow ? 'hidden' : 'auto'};
          width: 100%;
          height: 100%;
          max-height: inherit;
          border-radius: 0;`"
      >
        <div style="position: absolute; top: -20px; right: -25px; z-index: 1">
          <CIcon
            v-if="!noClose"
            class="cursor-pointer"
            hoverColor="primary"
            color="white"
            name="fa-light fa-xmark"
            size="26px"
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
import CIcon from '../helpers/CIcon.vue'

defineProps({
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
  persistent: Boolean,
  noPadding: Boolean,
  dialogClass: String,
  image: String,
  imageClass: String,
  imageWidth: String,
  noOverflow: Boolean,
  heightPercent: String,
  withOverflow: Boolean,
})
defineEmits(['update:modelValue'])
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
