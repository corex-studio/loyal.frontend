<template>
  <div
    v-if="authentication.user"
    class="row gap-5 full-width border-radius pa-10 justify-between items-start card-element no-wrap"
  >
    <div class="row gap-13 items-center no-wrap">
      <div class="user-icon-block row justify-center items-center">
        <q-icon
          :name="authentication.user.sex === SexType.MALE ? 'fa-regular fa-person' : 'fa-regular fa-person-dress'"
          color="on-backing-color" size="30px"></q-icon>
      </div>
      <!--      <q-img-->
      <!--        :src="authentication.user.image?.thumbnail || $store.images.empty"-->
      <!--        fit="cover"-->
      <!--        height="58px"-->
      <!--        style="border-radius: 50%"-->
      <!--        width="58px"-->
      <!--      >-->
      <!--        <template v-slot:error>-->
      <!--          <span>-->
      <!--            <q-img-->
      <!--              :src="$store.images.empty"-->
      <!--              fit="cover"-->
      <!--              height="54px"-->
      <!--              style="border-radius: 50%"-->
      <!--              width="54px"-->
      <!--            ></q-img>-->
      <!--          </span>-->
      <!--        </template>-->
      <!--      </q-img>-->
      <div class="column gap-3">
        <div class="header3 bold">
          {{ authentication.user.fullName }}
        </div>
        <div class="body" style="opacity: 0.7">
          {{ authentication.user.phone }}
        </div>
      </div>
    </div>
    <div class="row items-center gap-7 no-wrap">
      <CIcon
        class="cursor-pointer"
        color="secondary"
        hover-color="primary"
        name="fa-regular fa-pen"
        size="20px"
        @click="$emit('editProfile', true)"
      />
      <CIcon
        class="cursor-pointer"
        color="secondary"
        hover-color="primary"
        name="fa-regular fa-trash"
        size="20px"
        @click="
          $router.push({
            name: 'deleteAccountPage',
            params: {
              companyGroup: $companyGroup.item?.externalId,
            },
          })
        "
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { authentication } from 'src/models/authentication/authentication'
import { SexType } from 'src/models/customer/customer';

defineEmits<{
  (evt: 'editProfile', val: boolean): void
}>()
</script>

<style lang="scss" scoped>
.card-element {
  border: 2px var(--primary) solid;
}

.user-icon-block {
  height: 58px;
  width: 58px;
  border-radius: 50%;
  background-color: var(--backing-color);
}
</style>
