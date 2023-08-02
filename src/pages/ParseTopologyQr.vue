<template>
  <div>
    <div v-if="loading" class="absolute-full flex items-center justify-center">
      <q-spinner-puff color="black" size="25%" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { qrDataRepo } from 'src/models/utils/qrData/qrDataRepo'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  const parsedData = await qrDataRepo.parseQrData(
    String(route.params.topologyItemId),
    String(route.query.type)
  )

  if (parsedData.data && parsedData.data.salesPoint) {
    try {
      const companyGroupAppSettings = await companyGroupRepo.getAppSettings(
        parsedData.data.salesPoint.companyGroup
      )
      if (companyGroupAppSettings.app_redirect_link) {
        window.open(companyGroupAppSettings.app_redirect_link)
      }
    } catch {}
  }
  loading.value = false
  void router.push({ name: '404page' })
})
</script>
