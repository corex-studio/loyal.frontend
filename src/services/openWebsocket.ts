import { useWebSocket, UseWebSocketOptions } from '@vueuse/core'
import { MaybeRefOrGetter } from '@vueuse/shared'

export const openWebsocket = (
  url: MaybeRefOrGetter<string | URL | undefined>,
  options?: UseWebSocketOptions,
) => {
  const defaultOptions: UseWebSocketOptions = {
    autoReconnect: {
      delay: 1000,
    },
  }
  // let _url = clone(url)
  // if (process.env.DEV && _url.startsWith('wss://')) {
  //   _url = _url.replace('wss://', 'ws://')
  // }
  const currentOptions = Object.assign(defaultOptions, options || {})
  return useWebSocket(url, currentOptions)
}
