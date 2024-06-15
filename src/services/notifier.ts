import { Notyf } from 'notyf'

export const notifier = new Notyf({
  position: { x: 'center', y: 'top' },
  dismissible: true,
  duration: 4000,
  ripple: false,
  types: [
    // сюда можно писать новые типы, дока: https://www.npmjs.com/package/notyf
  ],
})
