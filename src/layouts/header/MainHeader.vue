<template>
  <div ref="header" style="position: sticky; top: 0; z-index: 10">
    <q-header
      v-if="!isArrangementPage"
      :class="{ 'box-shadow': $store.verticalScroll > 70 }"
      class="text-on-background-color transition bg-background-color"
    >
      <div class="column c-container">
        <div
          v-if="!$store.tableMode"
          :style="`height: ${$q.screen.lt.md ? '66' : '72'}px`"
          class="row justify-between gap-lg-8 gap-xs-6 items-center no-wrap full-width"
        >
          <div
            :class="
              $companyGroup.item && $companyGroup.item.companies.length < 2
                ? $q.screen.lt.lg
                  ? 'col-shrink'
                  : 'col'
                : 'col-shrink'
            "
            class="row gap-6 no-wrap items-center"
          >
            <CIcon
              v-if="$q.screen.lt.lg"
              class="mr-5 cursor-pointer"
              color="on-background-color"
              hover-color="primary"
              name="fa-regular fa-bars"
              size="24px"
              @click="$store.openLeftDrawer()"
            />
            <CompanyLogoView />
            <CButton
              v-if="
                $companyGroup.item &&
                $companyGroup.item.companies.length > 1 &&
                !$store.tableMode
              "
              text-button
              text-color="secondary-text"
              @click="$store.selectCompanyModal = true"
            >
              <div
                v-if="$q.screen.gt.lg"
                class="row no-wrap gap-2 items-center"
              >
                <CIcon
                  color="secondary-text"
                  name="fa-regular fa-angle-left"
                  size="21px"
                />
                <div class="body bold mt-1">Все заведения</div>
              </div>
              <CIcon v-else name="fa-regular fa-angle-down" size="24px" />
            </CButton>
            <div
              v-if="
                $companyGroup.item &&
                $companyGroup.item.companies.length < 2 &&
                $q.screen.gt.md
              "
              ref="multipleCompaniesSpot"
              class="ml-xl-15 ml-lg-10 ml-xs-0 ml-md-5 col"
            ></div>
          </div>
          <teleport
            :disabled="
              !multipleCompaniesSpot ||
              ($companyGroup.item && $companyGroup.item.companies.length > 1) ||
              $q.screen.lt.lg
            "
            :to="multipleCompaniesSpot"
          >
            <div
              :class="$q.screen.lt.lg ? 'justify-end' : $companyGroup.item"
              class="row no-wrap items-center col gap-lg-8 gap-xs-6"
              style="width: inherit"
            >
              <CButton
                v-if="$q.screen.gt.md"
                color="input-color"
                height="44px"
                outlined
                style="border-radius: 100px !important"
                @click="openCitySelectorModal()"
              >
                <div
                  class="row gap-4 items-center no-wrap body text-on-input-color"
                >
                  <CIcon
                    color="on-input-color"
                    name="fa-regular fa-city"
                    size="22px"
                  />
                  <div class="mt-1 bold">
                    {{
                      $companyGroup.item?.cityData.current?.name ||
                      'Калининград'
                    }}
                  </div>
                  <CIcon
                    v-if="
                      $companyGroup.item &&
                      $companyGroup.item?.cityData.results.length > 1
                    "
                    class=""
                    color="on-input-color"
                    hover-color="primary"
                    name="fa-regular fa-angle-down"
                    size="22px"
                  />
                </div>
              </CButton>
              <ServiceSettingsBlock />
            </div>
          </teleport>
          <div
            v-if="authentication.user"
            class="row no-wrap items-center gap-lg-8 gap-xs-6 mt-md-2 mt-xs-8 secondary-text"
            style="height: 48px; width: fit-content"
          >
            <template v-if="$q.screen.gt.md">
              <div
                class="column full-height justify-between cursor-pointer items-center no-wrap relative-position"
                @click="
                  $cart.loading
                    ? void 0
                    : $store.openCartDrawer()
                "
              >
                <template v-if="!$cart.loading">
                  <q-badge
                    v-if="$cart.item?.cartItemsQuantitySum"
                    class="cart-badge row justify-center"
                    color="primary"
                  >{{ $cart.item?.cartItemsQuantitySum }}
                  </q-badge
                  >
                  <CIcon
                    color="on-background-color"
                    name="fa-regular fa-basket-shopping"
                    size="23px"
                  />
                </template>
                <q-spinner v-else color="on-background-color" size="23px" />
                <div class="bold">Корзина</div>
              </div>

              <div
                v-if="$uiSettings.item?.useBonuses"
                class="column full-height justify-between cursor-pointer items-center no-wrap relative-position"
                @click="$store.bonusesDrawer = true"
              >
                <q-badge
                  v-if="previewBalance"
                  class="balance-badge row justify-center"
                  color="primary"
                >{{ previewBalance }}
                </q-badge
                >
                <CIcon
                  color="on-background-color"
                  name="fa-regular fa-gift"
                  size="23px"
                />
                <div class="bold">Бонусы</div>
              </div>
            </template>
            <div
              v-if="$q.screen.gt.md"
              class="column full-height justify-between cursor-pointer items-center no-wrap"
              @click="
                $router.push({
                  name: 'profilePage',
                })
              "
            >
              <CIcon
                :size="$q.screen.gt.sm ? '23px' : '32px'"
                color="on-background-color"
                name="fa-regular fa-face-smile"
              />
              <div v-if="$q.screen.gt.sm" class="bold">Профиль</div>
            </div>
          </div>
          <div
            v-else
            :style="`height: ${$q.screen.gt.sm ? '44' : '40'}px`"
            class="auth-button cursor-pointer text-primary body bold row items-center px-xs-10 px-lg-15"
            @click="$store.authModal = true"
          >
            Войти
          </div>
        </div>
        <BottomHeader
          v-if="
            $route.matched.some((v) =>
              $router.isIncludesRouteName(['qrHome', 'home'], String(v.name)),
            )
          "
        />
      </div>
    </q-header>
    <ArrangementHeader v-else-if="$q.screen.gt.sm" />
    <BonusesInDevModal v-model="$store.bonusesModal" />
    <CitySelectorModal v-model="$store.citySelectorModal" />
    <CityCheckModal v-model="$store.cityCheckModal" />
  </div>
</template>

<script lang="ts" setup>
import CButton from 'src/components/template/buttons/CButton.vue'
import { authentication } from 'src/models/authentication/authentication'
import ServiceSettingsBlock from 'src/components/serviceSettings/ServiceSettingsBlock.vue'
import { store } from 'src/models/store'
import { useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import ArrangementHeader from 'src/pages/arrangement/ArrangementHeader.vue'
import BottomHeader from './BottomHeader.vue'
import BonusesInDevModal from 'src/components/template/dialogs/BonusesInDevModal.vue'
import CitySelectorModal from 'src/components/template/dialogs/CitySelectorModal.vue'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import CompanyLogoView from 'components/CompanyLogoView.vue'
import CityCheckModal from 'src/components/template/dialogs/CityCheckModal.vue'

const route = useRoute()
const header = ref<HTMLDivElement>()
const multipleCompaniesSpot = ref<HTMLDivElement>()

const isArrangementPage = computed(() => {
  return route.path.includes('arrangement')
})

const previewBalance = computed(() => {
  if (!authentication.user || !authentication.user.wallets.length) return
  return authentication.user.wallets[0].balance > 999
    ? '999+'
    : authentication.user.wallets[0].balance
})

const openCitySelectorModal = () => {
  if (!companyGroupRepo.item) return
  if (companyGroupRepo.item?.cityData.results.length > 1) {
    store.citySelectorModal = true
  }
}

onMounted(() => {
  store.headerHeight = header.value?.clientHeight || 0
  setTimeout(() => {
    document.addEventListener('resize', () => {
      store.headerHeight = header.value?.clientHeight || 0
    })
  }, 50)
})
</script>

<style lang="scss" scoped>
.q-header {
  position: relative;
}

.auth-button {
  border: 2px solid var(--primary);
  border-radius: 100px;
}

.cart-badge {
  position: absolute;
  top: -10px;
  right: 5px;
  border-radius: 100px;
  font-size: 12px;
  height: 18px;
  min-width: 18px;
  z-index: 1;
}

.balance-badge {
  position: absolute;
  top: -10px;
  left: 31px;
  border-radius: 100px;
  font-size: 12px;
  height: 18px;
  min-width: 18px;
  z-index: 1;
}
</style>
