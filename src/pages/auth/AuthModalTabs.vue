<template>
  <div
    class="flex no-wrap"
    :class="{
      'column reverse gap-4': $q.screen.lt.md,
      'row gap-8': !$q.screen.lt.md,
    }"
  >
    <CButton
      v-for="tab in props.tabs"
      :key="tab.authType"
      @click="model = tab.authType"
      height="50px"
      width="100%"
      :label="tab.label"
      class="subtitle-text"
      :color="model === tab.authType ? 'primary' : 'secondary-button-color'"
      :icon="tab.icon"
      :text-color="
        model === tab.authType ? 'on-primary' : 'on-secondary-button-color'
      "
    />
  </div>
</template>

<script lang="ts" setup>
import CButton from 'src/components/template/buttons/CButton.vue'
import { AuthType } from 'src/models/authSettings/authSettings'
import { defineModel } from 'vue'

const model = defineModel<AuthType | null>()

const props = defineProps<{
  tabs: {
    label: string
    icon?: string
    authType: AuthType
  }[]
}>()
</script>
