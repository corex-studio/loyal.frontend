<template>
  <div
    @click="openDialog()"
    class="row no-wrap gap-20 body cursor-pointer border-radius items-center"
    style="overflow: hidden"
    :style="`padding: 0 ${$q.screen.gt.md ? '40' : '20'}px; height: ${
      $q.screen.gt.md ? '48px' : $q.screen.lt.md ? '36px' : '44px'
    } `"
    :class="
      $q.screen.gt.sm
        ? 'bg-primary text-on-primary'
        : 'text-on-background-color '
    "
  >
    <div v-if="!$cart.item" class="row no-wrap gap-4 items-center">
      <q-icon size="22px" :name="'fa-regular fa-location-dot'" />
      <div :class="{ bold: $q.screen.lt.md }">Выбрать способ получения</div>
    </div>
    <template v-else>
      <div class="row no-wrap gap-md-4 gap-xs-2 items-center">
        <div
          :class="{ 'bg-on-primary': $q.screen.gt.sm }"
          class="border-radius px-4 py-3"
        >
          <q-icon
            :color="$q.screen.gt.sm ? 'primary' : 'on-background-color'"
            size="22px"
            :name="'fa-regular fa-box'"
          />
        </div>
        <div :class="{ bold: $q.screen.lt.md }">
          {{ $cart.item.currentDeliveryType }}
        </div>
      </div>

      <div v-if="$q.screen.gt.md" class="row no-wrap gap-4 items-center">
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
