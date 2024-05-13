<template>
  <div class="bg-modal-header-color text-on-modal-header-color mb-2">
    <div class="c-container items-center px-4 py-5 row gap-5">
      <CompanyLogoView />

      <div class="row gap-3 items-baseline">
        <div class="header light">{{ $company.item?.name || 'Мой счет' }}</div>
        <q-separator
          vertical
          color="on-modal-header-color"
          style="opacity: 0.85"
        />
        <div style="opacity: 0.85; font-weight: 300; font-size: 15px">
          {{ $pad.item?.name || 'Меню' }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CompanyLogoView from 'components/CompanyLogoView.vue'
</script>
