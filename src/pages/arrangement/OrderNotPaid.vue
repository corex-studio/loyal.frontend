<template>
  <div
    :style="`border: 1px #${$uiSettings.item?.dividerColor.color} solid`"
    class="pa-10 column full-width box-shadow items-center border-radius mt-lg-15 mt-md-12 mt-xs-8 gap-6"
  >
    <div class="column gap-2 text-center">
      <div class="text-primary header3 bold">Заказ не оплачен</div>
      <div class="body text-on-background-color">
        <div>Заказ будет принят после подтверждения оплаты</div>
        <div>Повторите попытку оплаты</div>
      </div>
    </div>
    <q-separator class="full-width" color="divider-color" />
    <div class="row justify-center full-width gap-8">
      <div v-if="showRetry" class="column gap-3 text-center">
        <CIconButton
          :loading="retryLoading"
          circle
          color="backing-color"
          icon="fa-regular fa-rotate-right"
          icon-color="on-backing-color"
          icon-size="26px"
          size="50px"
          @click="$emit('retry')"
        />
        <div class="secondary-text text-on-background-color">
          Повторить <br />
          оплату
        </div>
      </div>

    </div>
  </div>
</template>
<script lang="ts" setup>
import CIconButton from 'src/components/template/buttons/CIconButton.vue'

defineProps<{
  showRetry?: boolean
  retryLoading?: boolean
}>()

defineEmits<{
  (evt: 'retry'): void
  (evt: 'cancel'): void
}>()
</script>
