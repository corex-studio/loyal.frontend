<template>
  <CIconButton
    @click.capture.stop="menu = !menu"
    :color="iconOnly ? 'transparent' : 'secondary-button-color'"
    class="menuButton"
    :class="
      iconOnly ? '' : 'bg-secondary-button-color border-radius box-shadow'
    "
    :style="[
      useHover && !hover && !menu && $q.screen.gt.md
        ? 'visibility: hidden; opacity: 0; transition: visibility 0s linear 100ms, opacity 150ms'
        : '',
    ]"
    :icon-color="iconColor ? iconColor : 'on-background-color'"
    :icon-size="iconSize ? iconSize : '26px'"
    :icon="icon ? icon : 'fa-regular fa-ellipsis-v'"
    no-padding
    :disabled="disabled"
  >
    <q-menu
      v-if="!hideMenu"
      class="px-5 pt-5 pb-5 box-shadow bg-background-color"
      style="gap: 12px"
      v-model="menu"
      :auto-close="autoclose"
      @update:model-value="$emit('updateMenu', $event)"
    >
      <div class="column">
        <div
          v-for="(item, index) in structure.filter((v) => !v.hidden)"
          :key="index"
        >
          <template v-if="!item.hidden">
            <q-separator v-if="index" class="my-4 mx-3" />
            <div
              v-if="item.title"
              :class="{ 'pt-3': !index }"
              class="bold pl-3 mb-3"
            >
              {{ item.title }}
            </div>
            <div class="column">
              <div
                @click="_item.click"
                class="actionRow px-4 cursor-pointer py-4"
                v-for="(_item, _index) in item.items.filter((el) => !el.hidden)"
                :key="_index"
              >
                <CButton
                  :icon="_item.icon"
                  icon-size="20px"
                  icon-color="on-background-color"
                  text-button
                  hover-text-color="on-background-color"
                  class="body"
                  :label="_item.title"
                  text-color="on-background-color"
                />
              </div>
            </div>
          </template>
        </div>
      </div>
    </q-menu>
  </CIconButton>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CIconButton from '../buttons/CIconButton.vue'
import CButton from '../buttons/CButton.vue'
import { MenuActionItems } from './menuActionsServices'

defineProps<{
  structure: MenuActionItems[]
  iconOnly?: boolean
  hover?: boolean | undefined
  useHover?: boolean
  disabled?: boolean
  icon?: string
  iconColor?: string
  iconSize?: string
  height?: string
  width?: string
  hideMenu?: boolean
  autoclose?: boolean
}>()

defineEmits<{
  (evt: 'updateMenu', value: boolean): void
}>()

const menu = ref(false)
</script>

<style scoped lang="scss">
.actionRow:hover {
  background: rgba(0, 0, 0, 0.029);
  border-radius: 4px;
}
</style>
