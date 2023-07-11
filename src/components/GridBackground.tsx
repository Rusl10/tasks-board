import { Point } from "../types"

type GridBackgroundProps = {
  offset: Point
  scale: number
}

export default function GridBackground({offset, scale}: GridBackgroundProps): JSX.Element {
  // console.log('GridBackground render')
  const inset = `-${(100 / scale - 100) / 2}%`
  // console.log('canvasPosition in gridBD', offset)
  return (
    <div
      style={{
        backgroundImage: 'url(https://example-use-pan.vercel.app/assets/grid-10dccd16.svg)',
        transform: `scale(${scale})`,
        backgroundPosition: `${offset.x}px ${offset.y}px`,
        position: 'absolute',
        inset,
      }}
    ></div>
  )
}
