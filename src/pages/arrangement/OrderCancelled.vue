<template>
  <div
    :style="`border: 1px #${$uiSettings.item?.secondaryColor.color} solid`"
    class="pa-10 column full-width box-shadow items-center border-radius mt-lg-15 mt-md-12 mt-xs-8 gap-6"
  >
    <div class="column gap-2 items-center">
      <div class="row items-center gap-4">
        <div
          style="border-radius: 50%; height: 30px; width: 30px"
          class="bg-primary row items-center justify-center"
        >
          <CIcon name="fa-regular fa-xmark" size="20px" color="on-primary" />
        </div>
        <div class="header3 bold">Заказ отменен</div>
      </div>
      <div class="body text-on-background-color">
        Не волнуйтесь, деньги не списались
      </div>
    </div>
    <q-separator color="divider-color" class="full-width" />
    <div class="column gap-3 text-center">
      <CIconButton
        icon="fa-regular fa-rotate-right"
        size="50px"
        icon-color="on-backing-color"
        color="backing-color"
        circle
        icon-size="26px"
      />
      <div class="secondary-text text-on-background-color">Повторить заказ</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CIconButton from 'src/components/template/buttons/CIconButton.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
</script>
