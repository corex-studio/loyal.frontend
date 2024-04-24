<template>
  <CDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="456px"
  >
    <template v-slot:header> {{ contact?.label }} </template>
    <div class="column text-on-background-color full-width gap-8">
      <div
        v-for="(el, index) in contactByField"
        :key="index"
        class="row items-center gap-5 body"
      >
        <div v-if="el.name" class="bold">{{ el.name }}:</div>
        <div>{{ el.value }}</div>
      </div>
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import CDialog from 'src/components/template/dialogs/CDialog.vue'
import { companyRepo } from 'src/models/company/companyRepo'
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  contact: {
    label: string
    type: 'phones' | 'emails' | 'messages'
  } | null
}>()

defineEmits<{
  (evt: 'update:modelValue', value: boolean): void
}>()

const contactByField = computed(() => {
  if (!props.contact) return
  return companyRepo.companyForProfile?.guestContacts[props.contact.type]
})
</script>
