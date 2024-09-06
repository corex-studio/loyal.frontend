<template>
  <div v-if="item.label && item.link">
    <CButton
      :height="$q.screen.md ? '44px' : $q.screen.lt.md ? '40px' : '48px'"
      :label="item.label"
      block
      :loading="loading"
      @click="formatLink"
      class="col-grow body"
    />
  </div>
</template>

<script setup lang="ts">
import { OrderThemeRedirectSchema } from 'src/models/theme/schema/company_group_schema_schema'
import CButton from 'components/template/buttons/CButton.vue'
import { ref } from 'vue'
import { utilsRepo } from 'src/models/utils/utilsRepo'

const props = defineProps<{
  item: OrderThemeRedirectSchema
}>()

const loading = ref(false)

const formatLink = async () => {
  if (!props.item.link) return
  loading.value = true
  try {
    const result = await utilsRepo.formatLink(props.item.link)
    window.open(result.link, '_blank')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">

</style>
