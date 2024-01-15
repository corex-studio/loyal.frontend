<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="650px"
    height="600px"
    no-padding
  >
    <div
      style="height: 600px; overflow-y: auto"
      class="column no-wrap border-radius full-width"
    >
      <q-img
        :src="
          $promotion.item
            ? $promotion.item.image?.thumbnail || $store.images.empty
            : $news.item?.image?.thumbnail || $store.images.empty
        "
        height="300px"
        style="min-height: 300px"
        fit="cover"
      >
        <template v-slot:error>
          <q-img
            :style="`border-radius: ${getBorderRadius}`"
            :src="$store.images.empty"
            fit="cover"
            height="300px"
          />
        </template>
      </q-img>
      <div
        class="column no-wrap col-grow justify-between gap-6 full-width bg-background-color text-on-background-color pa-15 relative-position"
      >
        <div class="column full-width gap-6 pb-15">
          <div class="header2 bold">
            {{ $promotion.item ? $promotion.item.name : $news.item?.title }}
          </div>
          <div v-if="$promotion.item" class="body">
            {{ $promotion.item.description }}
          </div>
          <div v-else v-html="$news.item?.fullDescription"></div>
        </div>
        <!-- <div>
          <CButton
            class="body"
            height="48px"
            width="320px"
            label="К покупкам"
            @click="$emit('update:modelValue', false)"
          />
        </div> -->
      </div>
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
// import CButton from 'src/components/template/buttons/CButton.vue'
import CDialog from 'src/components/template/dialogs/CDialog.vue'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { computed } from 'vue'

defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

const getBorderRadius = computed(() => {
  return `${uiSettingsRepo.item?.borderRadius}px ${uiSettingsRepo.item?.borderRadius}px 0 0`
})
</script>
