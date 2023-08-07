import { authentication } from './authentication/authentication'
import { LocalStorage } from 'quasar'
import { reactive } from 'vue'
export class Store {
  salesPoint = 'd253cd53-044b-468d-8881-232f43715f5e'
  companyGroup = 'corex_demo'
  institution = '4a1d27e8-281e-42c5-95cc-6331a2e4cffa'
  authModal = false
  profileModal = false
  cartDrawer = false
  selectCompanyModal = false

  externalID = 'HooDoo'
  images = {
    empty: 'https://mtraktor.ru/images/no-image.png',
  }

  getCompanyGroup() {
    const currentCompanyGroup = LocalStorage.getItem('Company-Group')

    // const foundAvailableCompany = authRepo.availableCustomers.find(
    //   (v) => v.companyGroup.externalId === companyGroup
    // );
    // if (foundAvailableCompany)
    //   authentication.setCompanyGroupHeader(
    //     foundAvailableCompany.companyGroup.externalId
    //   );
    if (currentCompanyGroup)
      authentication.setCompanyGroupHeader(String(currentCompanyGroup))
    else {
      authentication.setCompanyGroupHeader(this.companyGroup)
    }
  }

  setCompanyGroup(v: string) {
    LocalStorage.set('Company-Group', v)
    authentication.setCompanyGroupHeader(v)

    window.location.reload()
  }
}

export const beautifyNumber = (x: number, toFixed = false) => {
  if (toFixed) x = Number(x.toFixed(2))
  const parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return parts.join('.')
}

export const store = reactive(new Store())
