<template>
  <div
    :style="`border: 1px #${$uiSettings.item?.secondaryColor.color} solid`"
    class="pa-10 column full-width box-shadow items-center border-radius mt-lg-15 mt-md-12 mt-xs-8 gap-6"
  >
    <div class="column gap-2 text-center">
      <div class="text-primary header3 bold">Заказ не оплачен</div>
      <div class="body text-on-background-color">
        Повторите попытку оплаты заказа
      </div>
    </div>
    <q-separator color="divider-color" class="full-width" />
    <div class="row justify-center full-width gap-8">
      <div v-if="showRetry" class="column gap-3 text-center">
        <CIconButton
          @click="$emit('retry')"
          icon="fa-regular fa-rotate-right"
          size="50px"
          color="backing-color"
          icon-color="on-backing-color"
          circle
          icon-size="26px"
        />
        <div class="secondary-text text-on-background-color">
          Повторить <br />
          оплату
        </div>
      </div>
      <!-- <div class="column gap-3 text-center">
        <CIconButton
          @click="$emit('cancel')"
          icon="fa-regular fa-xmark"
          size="50px"
          color="backing-color"
          circle
          icon-color="on-backing-color"
          icon-size="26px"
        />
        <div class="secondary-text text-on-background-color">
          Отменить <br />
          заказ
        </div>
      </div> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
import CIconButton from 'src/components/template/buttons/CIconButton.vue'

defineProps<{
  showRetry?: boolean
}>()

defineEmits<{
  (evt: 'retry'): void
  (evt: 'cancel'): void
}>()
</script>
