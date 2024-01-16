<template>
  <div class="column full-width">
    <div
      class="row c-container no-wrap justify-between items-center py-6 bg-background-color"
    >
      <div
        @click="
          $router.push({
            name: 'home',
          })
        "
        class="cursor-pointer"
      >
        <template v-if="$companyGroup.item?.externalId !== 'corex_demo'">
          <img
            v-if="
              $company.item?.image?.thumbnail || $company.item?.logo?.thumbnail
            "
            height="48"
            class="border-radius"
            style="object-fit: contain"
            :src="
              $company.item?.logo?.thumbnail || $company.item?.image?.thumbnail
            "
          />
        </template>
        <img
          v-else
          height="48"
          class="border-radius"
          style="object-fit: contain"
          src="~assets/tochkaLogo.png"
        />
      </div>
      <ArrangementStepper class="col-5" />
    </div>
    <q-separator color="divider-color" />
  </div>
</template>
<script lang="ts" setup>
import ArrangementStepper from './ArrangementStepper.vue'
</script>
