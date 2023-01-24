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
      :style="`max-width: ${width}; min-height: ${height}; height: ${heightPercent} `"
      style="
        width: 100%;
        display: flex;
        border-radius: 15px;
        box-shadow: 0px 0px 13px rgba(65, 39, 130, 0.2) !important;
        background-color: #f8f8f8;
      "
      class="relative-position no-overflow no-shadow"
    >
      <div
        :class="[
          !noPadding ? 'pt-15 pb-15 px-10' : dialogClass,
          withOverflow ? '' : '',
        ]"
        style="
          overflow: auto;
          width: 100%;
          max-height: inherit;
          border-radius: 0;
        "
      >
        <q-btn
          v-if="!noClose"
          icon="close"
          style="
            position: absolute;
            right: -7px;
            top: -7px;
            background: white;
            border-radius: 10px;
            width: 30px;
            height: 30px;
            box-shadow: none;
            z-index: 2;
          "
          class="pa-7 closeBtn"
          flat
          dense
          v-close-popup
        />

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
});
defineEmits(['update:modelValue']);
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
