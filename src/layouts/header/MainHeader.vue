<template>
  <q-header class="text-black transition bg-background-color">
    <div class="c-container full-height column">
      <div
        style="height: 60px"
        class="row no-wrap items-center justify-between"
      >
        <div
          class="col-2 row cursor-pointer"
          @click="$router.push({ name: 'home' })"
        >
          <img height="55" :src="$uiSettings.item?.logo?.thumbnail" />
        </div>
        <div class="col-7 row gap-15 body">
          <CButton
            class="body"
            disabled
            label="Новости"
            text-button
            text-color="on-bottom-menu-color"
          />
          <CButton
            disabled
            class="body"
            label="Акции"
            text-button
            text-color="on-bottom-menu-color"
          />
          <CButton
            disabled
            class="body"
            label="Контакты"
            text-button
            text-color="on-bottom-menu-color"
          />

          <ServiceSettingsBlock v-if="authentication.user" />
        </div>
        <div class="row no-wrap gap-8">
          <CButton
            v-if="authentication.user"
            class="box-shadow"
            height="33px"
            style="border-radius: 100px"
            icon="fa-light fa-piggy-bank"
            color="background-color"
            text-color="primary"
            >{{
              authentication.user && authentication.user.wallets[0]
                ? authentication.user.wallets[0].balance
                : 'Бонусы'
            }}</CButton
          >

          <CButton
            @click="profileButtonClickHandler()"
            class="box-shadow"
            height="33px"
            color="background-color"
            text-color="primary"
            style="border-radius: 100px"
            icon="fa-light fa-user"
            :label="authentication.user ? 'Профиль' : 'Войти'"
          />
        </div>
      </div>
    </div>
    <q-separator class="divider-color" />
  </q-header>
</template>

<script setup lang="ts">
import CButton from 'src/components/template/buttons/CButton.vue'
import { authentication } from 'src/models/authentication/authentication'
import ServiceSettingsBlock from 'src/components/serviceSettings/ServiceSettingsBlock.vue'
import { store } from 'src/models/store'
import { useRouter } from 'vue-router'

const router = useRouter()

const profileButtonClickHandler = () => {
  if (authentication.user) {
    void router.push({ name: 'profilePage' })
  } else {
    store.authModal = true
  }
}
</script>

<style scoped lang="scss">
.q-header {
  position: relative;
}
</style>
