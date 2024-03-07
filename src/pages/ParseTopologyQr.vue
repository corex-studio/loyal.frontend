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
// import { useQuasar } from 'quasar'
import { store } from 'src/models/store'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

// const q = useQuasar()

onMounted(async () => {
  loading.value = true
  const parsedData = await qrDataRepo.parseQrData(
    String(route.params.topologyItemId),
    String(route.query.type),
  )
  let correctUrl = false
  if (parsedData.data && parsedData.data.salesPoint) {
    try {
      const companyGroupAppSettings = await companyGroupRepo.getAppSettings(
        parsedData.data.salesPoint.companyGroup,
      )

      if (
        route.query.type === 'pad' &&
        parsedData.data.companyGroup?.externalId === 'ResidenceOfKings'
        // &&
        // q.platform.is.ios
      ) {
        store.qrData = parsedData
        // window.location.replace(
        //   `http://${window.location.host}/?group=${parsedData.data.companyGroup?.externalId}&padId=${parsedData.data.pad?.id}`,
        // )
        void router.push({
          path: '/',
          query: {
            group: parsedData.data.companyGroup?.externalId,
          },
        })
        return
      } else if (companyGroupAppSettings.app_redirect_link) {
        window.location.replace(companyGroupAppSettings.app_redirect_link)
        correctUrl = true
      }
    } catch {}
  }
  if (!correctUrl) void router.push({ name: '404page' })
})
</script>
