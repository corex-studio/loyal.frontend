export type CSwipeModalRef = {
  open: () => void
  toggleFullHeight: () => boolean
  contentScrollTo: (value: ScrollToOptions) => void
  isOpened: boolean
  isFullHeight: boolean
  contentRef: HTMLDivElement
  $el: HTMLDivElement
}
