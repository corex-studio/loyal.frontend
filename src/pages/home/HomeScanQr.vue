<template>
  <div class="c-container mb-md-20 mb-xs-10">
    <div
      class="qr-block bg-primary column gap-10 border-radius text-on-primary pa-8"
    >
      <div class="body">
        {{
          $uiSettings.item?.qrArrangementDescription ||
          'Вы можете отсканировать QR-код, чтобы сделать заказ'
        }}
      </div>
      <CButton
        @click="startScan()"
        label="Сканировать QR-код"
        color="background-color"
        text-color="on-background-color"
        width="100%"
        icon="fa-regular fa-qrcode"
        icon-color="primary"
        icon-size="20px"
        class="body"
      />
    </div>
  </div>
  <CDialog
    @update:model-value="startScanning = $event"
    :model-value="startScanning"
    position="bottom"
    no-padding
  >
    <div>
      <QrStream
        style="height: 400px; border-radius: 10px !important"
        @decode="onDecode"
      />
    </div>
  </CDialog>
</template>
<script lang="ts" setup>
import CButton from 'src/components/template/buttons/CButton.vue'
import CDialog from 'src/components/template/dialogs/CDialog.vue'
import { authentication } from 'src/models/authentication/authentication'
import { cartRepo } from 'src/models/carts/cartRepo'
import { store } from 'src/models/store'
import { qrDataRepo } from 'src/models/utils/qrData/qrDataRepo'
import { ref } from 'vue'
import { QrStream } from 'vue3-qr-reader'
import { CartType } from 'src/models/carts/cart'

const startScanning = ref(false)
const dataFromQr = ref<string | null>(null)

const startScan = () => {
  if (!authentication.user) {
    store.authModal = true
  } else {
    startScanning.value = true
  }
}

const onDecode = async (data: any) => {
  dataFromQr.value = data
  if (dataFromQr.value) {
    const idRegex = dataFromQr.value.match(/(?<=\/qr_data\/)[^/?]+/)?.[0]
    const typeRegex = dataFromQr.value.match(/(?<=type=)[^&]+/)?.[0]
    if (idRegex && typeRegex) {
      const parsedData = await qrDataRepo.parseQrData(idRegex, typeRegex)
      store.qrData = parsedData
      await cartRepo.setParams({
        sales_point: store.qrData.data?.salesPoint?.id,
        type: CartType.TABLE,
        pad: store.qrData.data?.pad?.id,
      })
      void cartRepo.current(undefined, store.qrData?.data?.pad?.id)
      if (store.qrData && store.qrData.data?.salesPoint?.id) {
        void store.loadCatalog(store.qrData.data?.salesPoint?.id)
      }
      startScanning.value = false
    }
  }
}
</script>

<style lang="scss" scoped>
.qr-block {
  width: 100%;
  max-width: 380px;
  align-self: flex-start;
}
</style>
