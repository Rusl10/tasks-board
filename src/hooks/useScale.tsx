import {RefObject, useState} from 'react'
import { Point } from '../types/index'
import useEventListener from './useEventListener'

type ScaleOpts = {
  direction: 'up' | 'down'
  interval: number
}

const MIN_SCALE = 0.5
const MAX_SCALE = 3

/**
 * Listen for `wheel` events on the given element ref and update the reported
 * scale state, accordingly.
 */
export default function useScale(ref: RefObject<HTMLElement | null>) {
  const [scale, setScale] = useState(1)
  const [mousePosOnScale, setMousePosOnScale] = useState<Point>({x: 0, y: 0});
  const updateScale = ({direction, interval, mousePos}: ScaleOpts) => {
    setScale((currentScale) => {
      let scale: number

      // Adjust up to or down to the maximum or minimum scale levels by `interval`.
      if (direction === 'up' && currentScale + interval < MAX_SCALE) {
        scale = currentScale + interval
        // сетим состояниие только при приближении или отдалении
        setMousePosOnScale({
          x: mousePos.x,
          y: mousePos.y
        })
      } else if (direction === 'up') {
        scale = MAX_SCALE
      } else if (direction === 'down' && currentScale - interval > MIN_SCALE) {
        scale = currentScale - interval
        setMousePosOnScale({
          x: mousePos.x,
          y: mousePos.y
        })
      } else if (direction === 'down') {
        scale = MIN_SCALE
      } else {
        scale = currentScale
      }

      return scale
    })
  }

  // Set up an event listener such that on `wheel`, we call `updateScale`.
  useEventListener(ref, 'wheel', (e) => {
    e.preventDefault()
    console.log('e.clientX', e.clientX);
    updateScale({
      direction: e.deltaY > 0 ? 'down' : 'up',
      interval: 0.1,
      mousePos: {
        x: e.pageX,
        y: e.pageY
      }
    })
  })

  return {scale, mousePosOnScale}
}
