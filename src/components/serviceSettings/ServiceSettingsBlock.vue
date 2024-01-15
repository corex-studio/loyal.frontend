<template>
  <div
    @click="openDialog()"
    class="row no-wrap gap-20 body cursor-pointer border-radius items-center bg-primary text-on-primary"
    style="overflow: hidden"
    :style="`padding: 0 ${$q.screen.gt.md ? '40' : '20'}px; height: ${
      $q.screen.gt.md ? '48px' : '44px'
    } `"
  >
    <div v-if="!$cart.item" class="row no-wrap gap-4 items-center">
      <q-icon size="20px" :name="'fa-regular fa-location-dot'" />
      <div>Выбрать способ получения</div>
    </div>
    <template v-else>
      <div class="row no-wrap gap-4 items-center">
        <div class="border-radius px-4 py-3 bg-on-primary">
          <q-icon color="primary" size="20px" :name="'fa-regular fa-box'" />
        </div>
        <div>{{ $cart.item.currentDeliveryType }}</div>
      </div>
      <!-- v-if="$q.screen.gt.md" -->
      <div class="row no-wrap gap-4 items-center">
        <div class="border-radius bg-on-primary px-4 py-3">
          <q-icon
            size="20px"
            color="primary"
            :name="'fa-regular fa-location-dot'"
          />
        </div>
        <div class="ellipsis-2-lines">{{ $cart.item.currentAddress }}</div>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { store } from 'src/models/store'

const openDialog = () => {
  if (!companyGroupRepo.item) return
  if (companyGroupRepo.item?.companies.length > 1) {
    store.selectCompanyModal = true
  } else {
    store.serviceSettingsModal = true
  }
}
</script>
