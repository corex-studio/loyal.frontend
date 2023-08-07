<template>
  <div>
    <q-breadcrumbs separator="" class="mb-15 mt-8">
      <CHover v-slot="{ hover }">
        <q-breadcrumbs-el
          :label="'Главная'"
          class="caption-text pb-2"
          :class="hover ? 'text-primary' : 'text-on-background-color'"
          :to="{ name: 'home' }"
        />
      </CHover>
      <q-icon
        class="px-3 text-on-background-color"
        name="fal fa-chevron-right"
        style="font-size: 10px !important"
      />
      <q-breadcrumbs-el
        :label="'Профиль'"
        style="opacity: 0.6"
        class="caption-text"
        :class="'text-on-background-color'"
      />
    </q-breadcrumbs>
    <div
      class="row bg-primary py-15 px-10 justify-between items-center border-radius"
    >
      <div class="row no-wrap items-center gap-5">
        <div
          style="width: 50px; height: 50px"
          class="bg-background-color border-radius row items-center justify-center"
        >
          <CIcon size="20px" name="fa-light fa-user" />
        </div>
        <div class="column gap-4 text-on-primary">
          <div class="header3">
            {{
              [
                authentication.user?.firstName,
                authentication.user?.lastName,
              ].join(' ')
            }}
          </div>
          <div class="secondary-text">{{ authentication.user?.phone }}</div>
        </div>
      </div>
      <div
        style="width: 40px; height: 40px"
        class="row justify-center items-center bell-icon border-radius cursor-pointer"
      >
        <CIcon color="on-primary" name="fa-light fa-bell" />
      </div>
    </div>
    <div class="row no-wrap full-width mt-25 gap-40">
      <ProfileMenu />
      <div class="col">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CHover from 'src/components/template/helpers/CHover.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { authentication } from 'src/models/authentication/authentication'
import ProfileMenu from './ProfileMenu.vue'
import { onMounted } from 'vue'
import { companyRepo } from 'src/models/company/companyRepo'

onMounted(() => {
  if (companyRepo.item) companyRepo.companyForProfile = companyRepo.item
})
</script>

<style lang="scss" scoped>
.bell-icon {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
