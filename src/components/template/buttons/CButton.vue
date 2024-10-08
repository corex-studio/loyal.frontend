<template>
  <q-btn
    :class="{
      borderedButton: outline,
      block: textButton && !to,
      underline: underline,
      'underline-fixed': underlined,
      'text-button': textButton,
      outlined: outlined,
    }"
    :color="_color"
    :disabled="_disabled"
    :loading="loading"
    :outline="outline"
    :ripple="ripple"
    :style="`width:${_width}; height:${_height};font-size:${textSize}; padding:${
      textButton || noPadding ? '0px;' : '4px 16px;'
    } ${absolute ? 'position: absolute !important;' : ''} ${loading || iconLoading ? 'cursor: progress;' : ''}`"
    :text-color="_textColor"
    :to="to"
    :unelevated="unelevated"
    class="c-btn border-radius2"
    @click="clickHandler"
    @mouseleave="_hover = false"
    @mouseover="_hover = true"
  >
    <slot name="append"></slot>
    <div
      :class="`${contentClass ? contentClass : ''} ${
        contentFullWidth ? 'full-width' : ''
      }`"
      :style="
        contentColumn
          ? `display: flex; flex-direction: column; align-items: center; justify-content: space-between; height: 100%; ${
              breakSpaces ? 'white-space: break-spaces;' : ''
            }`
          : `display: flex; align-items: center; ${
              breakSpaces ? 'white-space: break-spaces;' : ''
            }`
      "
      class="button-label"
    >
      <div v-if="icon" :class="`mr-${iconGap_}`">
        <q-icon
          v-if="icon && !iconLoading"
          :color="iconColor"
          :name="icon"
          :style="`font-size:${iconSize} !important;`"
          class="transition-1"
        />
        <q-spinner v-if="iconLoading" />
      </div>
      <span
        v-if="label"
        :class="
          ellipsis
            ? ellipsis > 1
              ? `ellipsis-${ellipsis}-lines`
              : 'ellipsis'
            : ''
        "
        :style="{
          'line-height': labelLineHeight ? labelLineHeight : 'inherit',
        }"
        style="width: 100%"
      >{{ label }}</span
      >
      <slot></slot>
      <div v-if="iconRight" :class="`ml-${iconGap_}`">
        <q-icon
          v-if="iconRight && !iconLoading"
          :color="iconColor"
          :name="iconRight"
          :style="`font-size:${iconSize} !important;`"
        />
        <q-spinner v-if="iconLoading" />
      </div>
    </div>
    <slot name="custom-icons"></slot>
  </q-btn>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const emit = defineEmits(['click'])

const props = defineProps({
  ripple: {
    default: false,
    type: Boolean
  },
  flat: Boolean,
  round: Boolean,
  unelevated: {
    default: true,
    type: Boolean
  },
  outline: Boolean,
  outlined: Boolean,
  color: {
    default: 'button-color',
    type: String
  },
  icon: String,
  iconRight: String,
  textColor: {
    default: 'on-button-color',
    type: String
  },
  to: [String, Object],
  loading: Boolean,
  hoverColor: {
    type: String
  },
  iconColor: String,
  hoverTextColor: String,
  disabled: Boolean,
  height: String,
  width: {
    default: 'unset',
    type: String
  },
  textSize: String,
  iconSize: {
    default: '16px',
    type: String
  },
  label: [Number, String],
  textButton: Boolean,
  iconNoGutters: Boolean,
  contentColumn: Boolean,
  noPadding: Boolean,
  block: Boolean,
  underline: Boolean,
  underlined: Boolean,
  absolute: Boolean,
  contentFullWidth: Boolean,
  contentClass: String,
  breakSpaces: Boolean,
  ellipsis: Number,
  iconGap: [Number, String],
  labelLineHeight: String,
  iconLoading: Boolean
})

const _hover = ref(false)

const iconGap_ = computed(() => {
  if (props.iconNoGutters) return '0'
  if (!props.iconGap) return '3'
  if (Number.isNaN(Number(props.iconGap)))
    console.warn(
      'Icon gap prop expected number or numerical string, got string'
    )
  return props.iconGap
})

const _color = computed(() => {
  if (_hover.value && props.hoverColor) {
    return props.hoverColor
  } else if (props.textButton) {
    return 'transparent'
  } else if (_hover.value && props.color === 'primary') {
    return 'primary'
  } else if (_hover.value && props.color === 'primary') {
    return 'primary'
  } else {
    return props.color
  }
})

const _textColor = computed(() => {
  if (_hover.value && props.hoverTextColor) {
    return props.hoverTextColor
  } else if (_hover.value && props.color === 'secondary1') {
    return 'primary'
  } else if (_hover.value && props.textButton) {
    return 'primary'
  } else {
    return props.textColor
  }
})

const _height = computed(() => {
  let height
  if (props.textButton && !props.height) {
    height = 'unset'
  } else if (!props.height) {
    height = '42px'
  } else {
    height = props.height
  }
  if (
    height !== 'unset' &&
    height.slice(height.length - 2, height.length) !== 'px'
  ) {
    return (height += 'px')
  } else {
    return height
  }
})

const _width = computed(() => {
  let width = props.textButton ? 'unset' : props.width
  if (props.block) {
    return '100%'
  }
  if (width === 'inherit') return width
  if (
    width !== 'unset' &&
    width !== 'auto' &&
    width.slice(width.length - 2, width.length) !== 'px' &&
    width.slice(width.length - 1) !== '%'
  ) {
    return (width += 'px')
  } else {
    return width
  }
})

const _disabled = computed(() => {
  if (props.disabled) return true
  else return null
})

const clickHandler = () => {
  if (props.iconLoading) return
  emit('click')
}
</script>

<style lang="scss">
.c-btn {
  max-width: unset;
  min-height: unset;
  border-radius: 4px;
  transition: 0.3s ease-in-out;
  text-transform: unset !important;
  white-space: pre;
  font-weight: 400;
  position: relative;
}

.c-btn span {
  height: 100%;
}

.outlined {
  border: 1px solid var(--divider-color);
}

.c-btn .left-icon {
  margin-right: 6px !important;
}

.c-btn .right-icon {
  margin-left: 6px !important;
}

.borderedButton:hover {
  color: $accent4 !important;
}

.borderedButton:hover:before {
  border: 1px solid $accent4;
  transition: 0.3s;
}

.c-btn--outline:before:not(.underline) {
  border: 1px solid $secondary !important;
}

.c-btn:disabled:not(.block):not(.bg-secondary2) {
  //filter: contrast(100%);
  background: var(--secondary) !important;
  color: var(--on-secondary) !important;
  opacity: 1 !important;
}

.c-btn.underline:after {
  content: '';
  display: block;
  position: absolute;
  bottom: 0;
  width: 0%;
  height: 1px;
  transition: 0.3s;
}

.c-btn.underline:hover:after {
  width: 100%;
  transition: 0.3s;
}

.c-btn.underline-fixed:after {
  content: '';
  display: block;
  position: absolute;
  bottom: 0;
  width: 100% !important;
  height: 1px;
  transition: 0.3s;
}

.ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.c-btn.ellipsis {
  div {
    @extend .ellipsis;
  }

  span {
    @extend .ellipsis;
  }
}

.text-button .q-focus-helper {
  display: none;
}
</style>
