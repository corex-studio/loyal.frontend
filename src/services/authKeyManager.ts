import { authRepo } from 'src/models/authentication/authRepo'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

class AuthHelper {
  constructor() {}

  async getAuthKey() {
    if (window.location.protocol === 'http:') return ''
    const time = (await this.getServerTime())
      .replaceAll('-', '')
      .replaceAll(' ', '')
      .replaceAll(':', '')
    const token =
      'HIio68cvfayezE4dH6Yu0!nG=-3CpY0p?No7pLaCfEmxmmWkNcoSbaZ3bEOXhOU2tuCWAm!/iFOZG17gmcMXo?O5QiSEasbeKQ-h!zcDiW!u?54dze1L?X?NUj=gvlTWoatklgPi0u3!JbUly2ljZ7X3834pPFhUeygUmXflHU=aG-qK6qsL8jf2om2VywtxMo79B/WaJuc2yWFYX?R4t4mSZ5XFPHQ5MaAG2Crsu6swb7!VM8LaNPwglOT2130W'
    try{
      const msgBuffer = new TextEncoder().encode(time + token)
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    } catch (e) {
      console.log(e)
      return ''
    }

  }

  async getFingerPrint() {
    const fp = await FingerprintJS.load()
    return (await fp.get()).visitorId
  }

  private async getServerTime() {
    const res = await authRepo.getServerTime()
    return res.server_time
  }
}

export const authHelper = new AuthHelper()
