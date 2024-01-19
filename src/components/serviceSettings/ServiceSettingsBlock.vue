<template>
  <div
    @click="openDialog()"
    class="row no-wrap justify-between items-center cursor-pointer button px-8"
  >
    <div
      class="row no-wrap gap-4 body items-center text-on-background-color"
      style="overflow: hidden"
    >
      <div v-if="!$cart.item" class="row no-wrap gap-4 items-center">
        <!-- <q-icon size="22px" :name="'fa-regular fa-location-dot'" /> -->
        <CustomIcon width="28px" height="28px" name="bagOnTime.svg" />

        <div style="line-height: 15px" class="bold">
          Выберите способ получения
        </div>
      </div>
      <template v-else>
        <div class="row no-wrap gap-md-4 gap-xs-2 items-center">
          <!-- <q-icon
            color="on-background-color"
            size="22px"
            :name="'fa-regular fa-box'"
          /> -->
          <CustomIcon width="28px" height="28px" name="bagOnTime.svg" />

          <div class="bold text-primary">
            {{ $cart.item.currentDeliveryType }}
          </div>
        </div>

        <div v-if="$q.screen.gt.md" class="row no-wrap gap-4 items-center">
          <div class="rounded-separator"></div>
          <div class="ellipsis-2-lines">{{ $cart.item.currentAddress }}</div>
        </div>
      </template>
    </div>
    <CIcon
      v-if="$q.screen.gt.md"
      size="22px"
      color="secondary-button-color"
      name="fa-regular fa-angle-right"
    />
  </div>
</template>
<script lang="ts" setup>
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { store } from 'src/models/store'
import CIcon from '../template/helpers/CIcon.vue'
import CustomIcon from '../template/helpers/CustomIcon.vue'
import { authentication } from 'src/models/authentication/authentication'

const openDialog = () => {
  if (!authentication.user) {
    store.authModal = true
    return
  }
  if (!companyGroupRepo.item) return
  if (companyGroupRepo.item?.companies.length > 1) {
    store.selectCompanyModal = true
  } else {
    store.serviceSettingsModal = true
  }
}
</script>

<style lang="scss" scoped>
.button {
  border-radius: 100px !important;
  border: 1px solid var(--secondary-button-color);
  height: 44px;
  max-width: 490px;
  width: 100% !important;
}

.rounded-separator {
  width: 4px;
  height: 4px;
  min-width: 4px;
  max-width: 4px;
  background-color: var(--secondary-button-color);
  border-radius: 50%;
}
</style>
