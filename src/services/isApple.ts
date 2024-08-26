import { QVueGlobals, useQuasar } from 'quasar'

export const isApple = (quasar?: QVueGlobals) => {
  const q = quasar ? quasar : useQuasar()
  const is = q.platform.is
  return is.ios || is.ipad || is.iphone || is.ipod || is.mac || is.safari
}
