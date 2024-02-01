<template>
  <div class="c-container">
    <div class="row justify-between items-center bg-background-color py-6">
      <div class="row items-center gap-10">
        <div
          v-for="(el, index) in blocks.filter((v) => !v.hidden)"
          :key="index"
          class="row items-center gap-14"
        >
          <div
            v-if="index"
            style="
              min-width: 7px;
              min-height: 7px;
              max-width: 7px;
              max-height: 7px;
              border-radius: 50%;
            "
            class="bg-secondary-button-color"
          ></div>
          <CButton
            @click="el.click()"
            text-button
            text-color="on-background-color"
          >
            <div class="body bold">{{ el.label }}</div></CButton
          >
        </div>
      </div>
      <TopHeaderDeliveryInfo />
      <TopHeaderSocials />
    </div>
    <q-separator color="divider-color" />
  </div>
</template>
<script lang="ts" setup>
import CButton from 'src/components/template/buttons/CButton.vue'
import { authentication } from 'src/models/authentication/authentication'
import { store } from 'src/models/store'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TopHeaderSocials from './TopHeaderSocials.vue'
import TopHeaderDeliveryInfo from './TopHeaderDeliveryInfo.vue'

const router = useRouter()

const route = useRoute()

const blocks = computed(() => {
  return [
    {
      label: 'О нас',
      hidden: !authentication.user,
      click: () => {
        router.push({
          name: 'aboutUs',
        })
      },
    },
    {
      label: 'Контакты',
      click: () => {
        scrollToBlock('footer')
      },
    },
    // {
    //   label: 'Разработчик',
    //   click: () => {
    //     window.open('https://corex.studio/', '_blank')
    //   },
    // },
    {
      label: 'Мобильное приложение',
      click: () => {
        scrollToBlock('footer')
      },
    },
  ]
})

const scrollToBlock = (v: string, tab?: string) => {
  if (route.name !== 'home') {
    void router.push({
      name: 'home',
    })
    setTimeout(() => {
      scrollToBlock(v, tab)
    }, 300)
  } else {
    const groupElement = document.getElementById(v)
    if (groupElement) {
      if (tab) store.offersTab = tab
      const y = groupElement.getBoundingClientRect().top + window.scrollY - 120
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }
}
</script>
