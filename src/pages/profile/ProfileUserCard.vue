<template>
  <div
    v-if="authentication.user"
    class="row gap-5 full-width border-radius pa-10 justify-between items-start card-element no-wrap"
  >
    <div class="row gap-13 items-center no-wrap">
      <div class="user-icon-block row ">

        <CustomIcon :color="'#' + $uiSettings.item?.backgroundColor.color" :svg="sexSvg" height="65px"
                    width="60px" />
      </div>

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
import CustomIcon from 'components/icons/CustomIcon.vue';
import { computed } from 'vue';
import { SexType } from 'src/models/customer/customer';


const sexSvg = computed(() => {
  return authentication.user?.sex === SexType.MALE ? '<svg viewBox="0 0 129 128" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_335_104" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="2" y="2" width="125" height="124"><circle cx="64.5" cy="64" r="61.75" fill="#D9D9D9"/></mask><g mask="url(#mask0_335_104)"><path d="M52.2357 27.3091C46.7586 31.0672 45.2868 37.0173 45.5564 40.1838C45.9014 44.0561 46.7532 49.0967 46.7532 49.0967C46.7532 49.0967 45.0658 49.9417 45.0658 53.3418C45.6534 61.8769 48.7478 58.1934 49.3839 61.9365C50.9149 70.9537 54.4136 69.3481 54.4136 74.2693C54.4136 82.4664 50.7478 86.299 39.303 90.8424C27.8204 95.4057 15.9821 101.147 15.9821 111.089V158.83H113.018V111.089C113.018 101.147 101.174 95.4057 89.6861 90.8473C78.2413 86.3039 74.5862 82.4763 74.5862 74.2743C74.5862 69.3531 78.0741 70.9587 79.6105 61.9415C80.252 58.1984 83.341 61.8818 83.9394 53.3468C83.9394 49.9467 82.2467 49.1016 82.2467 49.1016C82.2467 49.1016 83.0984 44.0611 83.4381 40.1888C83.7885 36.1275 81.2925 27.4583 71.039 24.7988C69.2439 23.1087 68.0309 20.4195 73.5512 17.7203C61.4756 17.1983 58.667 23.0242 52.2357 27.3091Z" fill="#B4BBD1"/></g></svg>'
    : '<svg viewBox="0 0 128 129" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_335_73)"><path d="M90.7303 79.1299L77.6265 75.8657L76.8705 72.8501C85.9108 71.3339 90.5626 68.6352 90.7679 68.5159C91.2535 68.233 91.5546 67.7186 91.5957 67.1597C91.6333 66.6008 91.3835 66.0523 90.9423 65.7013C90.8809 65.6537 84.7684 60.6243 84.7684 43.1988C84.7684 28.5026 81.3172 21.0506 74.507 21.0506H73.498C71.042 18.6859 69.1985 17.6432 64.2456 17.6432C57.8185 17.6432 43.7227 24.0799 43.7227 43.1988C43.7227 60.6243 37.6103 65.6537 37.5658 65.6877C37.111 66.0284 36.8544 66.5702 36.8817 67.1359C36.9125 67.705 37.2203 68.2161 37.7095 68.509C37.9147 68.6317 42.5221 71.3439 51.6171 72.8568L50.8611 75.8655L37.7574 79.1299C29.1856 81.2664 23.1998 88.9057 23.1998 97.7173C23.1998 98.6577 23.9661 99.421 24.9101 99.421H103.581C104.525 99.421 105.291 98.651 105.291 97.7106C105.291 88.9057 99.3055 81.2664 90.7303 79.1299Z" fill="#B4BBD1"/><path fill-rule="evenodd" clip-rule="evenodd" d="M104.427 95.7761C102.039 90.1675 97.2304 84.8442 88.5328 82.4717L89.4721 79.0283C100.243 81.9664 105.933 89.0332 108.405 96.1816C109.632 99.7294 110.067 103.293 109.96 106.387C109.865 109.153 109.33 111.678 108.427 113.508L109.186 114.639C105.681 116.99 102.212 119.017 98.7886 120.752C90.1931 125.568 78.1589 129.66 64.0324 129.553C49.9067 129.66 37.8732 125.567 29.278 120.752C25.8548 119.018 22.385 116.99 18.8807 114.639L19.639 113.508C18.7361 111.678 18.2015 109.153 18.106 106.387C17.9991 103.293 18.4344 99.7294 19.6612 96.1816C22.1329 89.0332 27.8228 81.9664 38.5942 79.0283L39.5334 82.4717C30.8329 84.845 26.0241 90.1712 23.6372 95.7818C46.5714 94.0713 94.0887 91.2348 100.962 93.5536C102.386 94.034 103.524 94.8097 104.427 95.7761Z" fill="#B4BBD1"/></g><defs><clipPath id="clip0_335_73"><rect y="0.754364" width="128" height="128" rx="64" fill="white"/></clipPath></defs></svg>'
})

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
  background-color: var(--secondary);
  overflow: hidden !important;
}
</style>
