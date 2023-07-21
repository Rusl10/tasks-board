import { MouseEvent, useEffect, useRef } from "react"
import { Point } from "../types"

type GridBackgroundProps = {
  offset: Point
  scale: number
}

export default function GridBackground({offset, scale, mousePos}: GridBackgroundProps): JSX.Element {
  // console.log('GridBackground render')
  // const inset = `-${(100 / scale - 100) / 2}%`
  // TODO возможно 
  // console.log('mousePosRef', mousePosRef.current)
  const clientXInPercent = (mousePos.x )* 100 / window.innerWidth;
  const clientYInPercent = mousePos.y * 100 / window.innerHeight;
  console.log('clientXInPercent', clientXInPercent)
  console.log('clientYInPercent', clientYInPercent)
  // old version
  // const inset = `-${(100 / scale - 100) / 2}%`;
  // при быстром высокоамплутудном скролле туда-сюда перекрестие на мыши никуда не сползает
  // при движении колеса мыши по инерции ОДНОВРЕМЕННО с mouseMove сетка начинает сдвигаться,
  // учитываем случай с одновременной прокруткой и смещением курсора 
  const left = `-${(100 / scale - 100) * clientXInPercent / 100}%`;
  const right = `-${(100 / scale - 100) * (100 - clientXInPercent) / 100}%`;
  const top = `-${(100 / scale - 100) * clientYInPercent / 100}%`;
  const bottom = `-${(100 / scale - 100) * (100 - clientYInPercent) / 100}%`;
  return (
    <div
      style={{
        backgroundImage: 'url(https://example-use-pan.vercel.app/assets/grid-10dccd16.svg)',
        // используем в процентах, иначе по краям не заполняется сеткой
        transformOrigin: `${clientXInPercent}% ${clientYInPercent}%`,
        // transformOrigin: `${mousePos.x}px ${mousePos.y}px`,
        transform: `scale(${scale})`,
        backgroundPosition: `${offset.x / scale}px ${offset.y / scale}px`,
        position: 'absolute',
        // inset
        top,
        left,
        right,
        bottom
      }}
    ></div>
  )
}
