<template>
  <div
    :style="`height: ${$q.screen.lt.md ? '42' : '44'}px`"
    class="row no-wrap justify-between items-center cursor-pointer button bg-input-color px-8 col"
    @click="openDialog()"
  >
    <div
      class="row no-wrap gap-4 body items-center text-on-input-color"
      style="overflow: hidden"
    >
      <div
        v-if="!$cart.item"
        class="row no-wrap gap-4 items-center"
        style="overflow: inherit"
      >
        <CIcon
          color="on-input-color"
          name="fa-regular fa-bag-shopping"
          size="22px"
        />
        <div class="bold nowrap-content" style="line-height: 15px">
          {{
            $q.screen.lt.lg ? 'Способ получения' : 'Выберите способ получения'
          }}
        </div>
      </div>
      <template v-else>
        <div class="row no-wrap gap-md-4 gap-xs-2 items-center">
          <CIcon
            color="on-input-color"
            name="fa-regular fa-bag-shopping"
            size="22px"
          />
          <div class="bold text-primary" style="white-space: nowrap">
            {{ $cart.item.currentDeliveryType }}
          </div>
        </div>
        <div
          class="row no-wrap gap-4 items-center"
          style="overflow: inherit !important"
        >
          <div class="rounded-separator"></div>
          <div class="nowrap-content">{{ $cart.item.currentAddress }}</div>
        </div>
      </template>
    </div>
    <CIcon
      v-if="$cart.item?.type !== CartType.TABLE"
      color="on-input-color"
      hover-color="primary"
      name="fa-regular fa-angle-right"
      size="22px"
    />
  </div>
</template>
<script lang="ts" setup>
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { store } from 'src/models/store'
import CIcon from '../template/helpers/CIcon.vue'
import { authentication } from 'src/models/authentication/authentication'
import { CartType } from 'src/models/carts/cart'
import { cartRepo } from 'src/models/carts/cartRepo'
import { companyRepo } from 'src/models/company/companyRepo'

const openDialog = () => {
  if (cartRepo.item?.type === CartType.TABLE) return
  if (!authentication.user) {
    store.authModal = true
    return
  }
  if (!companyGroupRepo.item) return
  if (companyGroupRepo.item?.companies.length > 1) {
    companyRepo.cartCompany = companyRepo.item
  }
  store.serviceSettingsModal = true
}
</script>

<style lang="scss" scoped>
.button {
  border-radius: 100px !important;
  max-width: 430px;
  border: 1px solid var(--divider-color);
}

.rounded-separator {
  width: 4px;
  height: 4px;
  min-width: 4px;
  max-width: 4px;
  background-color: var(--on-background-color);
  border-radius: 50%;
}

.nowrap-content {
  white-space: nowrap;
  overflow: hidden;
  width: fit-content;
  text-overflow: ellipsis;
}
</style>
