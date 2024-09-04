<template>
  <div
    :style="`border: 1px #${$uiSettings.item?.dividerColor.color} solid`"
    class="pa-10 column full-width box-shadow items-center border-radius mt-lg-15 mt-md-12 mt-xs-8 gap-6"
  >
    <div class="column gap-2 items-center">
      <div class="row items-center gap-4">
        <div
          class="bg-primary row items-center justify-center"
          style="border-radius: 50%; height: 30px; width: 30px"
        >
          <CIcon color="on-primary" name="fa-regular fa-xmark" size="20px" />
        </div>
        <div class="header3 bold">Заказ отменен</div>
      </div>
      <div class="body text-on-background-color">
        Не волнуйтесь, деньги не списались
      </div>
    </div>
    <q-separator class="full-width" color="divider-color" />
    <div class="column gap-3 text-center">
      <CIconButton
        circle
        color="backing-color"
        icon="fa-regular fa-rotate-right"
        icon-color="on-backing-color"
        icon-size="26px"
        size="50px"
        @click="
          $router.push({
            name: 'home',
          })
        "
      />
      <div class="secondary-text text-on-background-color">
        Вернуться в меню
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CIconButton from 'src/components/template/buttons/CIconButton.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
</script>
