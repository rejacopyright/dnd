import { getEventCoordinates } from '@dnd-kit/utilities'

export const browser: any = () => {
  const userAgent: any = navigator?.userAgent
  let browserName: any

  if (userAgent?.match(/chrome|chromium|crios/i)) {
    browserName = 'chrome'
  } else if (userAgent?.match(/firefox|fxios/i)) {
    browserName = 'firefox'
  } else if (userAgent?.match(/safari/i)) {
    browserName = 'safari'
  } else if (userAgent?.match(/opr\//i)) {
    browserName = 'opera'
  } else if (userAgent?.match(/edg/i)) {
    browserName = 'edge'
  } else {
    browserName = undefined
  }

  return browserName
}

export const snapCenterToCursor: any = ({ activatorEvent, draggingNodeRect, transform }: any) => {
  const thisBrowser: any = browser()
  if (draggingNodeRect && activatorEvent && thisBrowser === 'chrome') {
    const activatorCoordinates: any = getEventCoordinates(activatorEvent)

    if (!activatorCoordinates) {
      return transform
    }

    const offsetX: any = activatorCoordinates?.x - draggingNodeRect?.left
    const offsetY: any = activatorCoordinates?.y - draggingNodeRect?.top

    return {
      ...transform,
      x: transform?.x + offsetX - draggingNodeRect?.width / 2,
      y: transform?.y + offsetY - draggingNodeRect?.height / 2,
    }
  }

  return transform
}

export const snapTopToCursor: any = (
  { activatorEvent, draggingNodeRect, transform }: any,
  top: number
) => {
  const thisBrowser: any = browser()
  if (draggingNodeRect && activatorEvent && thisBrowser === 'chrome') {
    const activatorCoordinates: any = getEventCoordinates(activatorEvent)

    if (!activatorCoordinates) {
      return transform
    }

    const offsetX: any = activatorCoordinates?.x - draggingNodeRect?.left
    const offsetY: any = activatorCoordinates?.y - draggingNodeRect?.top

    return {
      ...transform,
      x: transform?.x + offsetX - draggingNodeRect?.width / 2,
      y: transform?.y + offsetY - top,
    }
  }

  return transform
}

export const restrictToVerticalAxis: any = ({ transform }: any) => {
  return {
    ...transform,
    x: 0,
  }
}
