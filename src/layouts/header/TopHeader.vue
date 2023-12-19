<template>
  <div class="row justify-center bg-background-color c-container gap-14 py-8">
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
        class="bg-primary"
      ></div>
      <CButton
        @click="el.click()"
        text-button
        class="subtitle-text"
        text-color="on-backhround-color"
        :label="el.label"
      />
      <!-- {{ el.label }} -->
    </div>
  </div>
  <q-separator color="divider-color" />
</template>
<script lang="ts" setup>
import CButton from 'src/components/template/buttons/CButton.vue'
import { authentication } from 'src/models/authentication/authentication'
import { store } from 'src/models/store'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()

const route = useRoute()

const blocks = computed(() => {
  return [
    {
      label: 'Контакты',
      click: () => {
        scrollToBlock('footer')
      },
    },
    {
      label: 'О нас',
      hidden: !authentication.user,
      click: () => {
        router.push({
          name: 'aboutUs',
        })
      },
    },
    // {
    //   label: 'Вакансии',
    //   click: () => {
    //     return
    //   },
    // },
    {
      label: 'Разработчик',
      click: () => {
        window.open('https://corex.studio/', '_blank')
      },
    },
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
