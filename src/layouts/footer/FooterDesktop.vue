<template>
  <div class="row full-width">
    <div class="column col-8 justify-between">
      <div class="row gap-40">
        <div v-if="$menuGroup.items.length" class="column">
          <div class="bold mb-10 text-on-backing-color">Меню</div>
          <div class="row text-black3 gap-25">
            <div class="column gap-7">
              <div
                v-for="(item, index) in $menuGroup.items.filter(
                  (_, ind) => ind < 10
                )"
                :key="index"
              >
                <CButton
                  @click="scrollToGroup(item)"
                  text-button
                  class="secondary-text"
                  :label="item.name"
                  text-color="on-backing-color"
                />
              </div>
            </div>
            <div class="column gap-7" style="min-width: 100px">
              <div
                v-for="(item, index) in $menuGroup.items.filter(
                  (_, ind) => ind >= 10 && ind < 20
                )"
                :key="index"
              >
                <CButton
                  @click="scrollToGroup(item)"
                  text-button
                  class="secondary-text"
                  :label="item.name"
                  text-color="black"
                />
              </div>
            </div>
          </div>
        </div>

        <divs>
          <div class="bold mb-10 text-on-backing-color">Навигация</div>
          <div class="column text-black3 gap-7">
            <div
              v-for="(item, index) in navigation"
              :key="index"
              class="text-on-backing-color"
            >
              {{ item }}
            </div>
          </div>
        </divs>
      </div>
      <div class="column gap-8 text-on-backing-color">
        © Все права защищены 2023

        <div>
          Если вы тоже хотите стать обладателем системы лояльности, переходите
          сюда
        </div>
      </div>
    </div>
    <div class="col-grow text-on-backing-color">
      <div class="header mb-10">Скачать приложение</div>
      <div class="column text-black3 mb-15">
        <div class="row full-width gap-10">
          <div class="column gap-5">
            <div
              style="width: 99px; height: 99px"
              class="rounded-15 bg-black"
            ></div>
            <img width="99px" src="~assets/downloadApple.png" />
          </div>
          <div class="column gap-10">
            <div
              style="width: 99px; height: 99px"
              class="rounded-15 bg-black"
            ></div>
            <img width="99px" src="~assets/downloadGoogle.png" />
          </div>
        </div>
      </div>

      <div class="column gap-8">
        <div class="bold">Контакты</div>
        <div>+7 999 566 67 67</div>
        example@gmail.com
        <div class="row no-wrap gap-7">
          <img
            class="cursor-pointer"
            width="31px"
            src="~assets/telegramLogo.png"
          />
          <img class="cursor-pointer" width="31px" src="~assets/VKLogo.png" />
          <img
            class="cursor-pointer"
            width="31px"
            src="~assets/whatsAppLogo.png"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CButton from 'src/components/template/buttons/CButton.vue'
import { MenuGroup } from 'src/models/menu/menuGroups/menuGroup'

const navigation = [
  'Новости',
  'Акции',
  'Контакты',
  'О разработчике',
  'Политика конфиденциальности',
  'Пользовательское соглашение',
  'cookie',
]

const scrollToGroup = (v: MenuGroup) => {
  const groupElement = document.getElementById(v.id)
  if (groupElement)
    groupElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    })
}
</script>
