import { Point } from "../types"

type GridBackgroundProps = {
  offset: Point
  scale: number
}

export default function GridBackground({offset, scale}: GridBackgroundProps): JSX.Element {
  const insetBottomRight = `-${(100 / scale - 100)}%`;
  return (
    <div
      style={{
        backgroundImage: 'url(https://example-use-pan.vercel.app/assets/grid-10dccd16.svg)',
        transformOrigin: "0px 0px",
        transform: `scale(${scale})`,
        backgroundPosition: `${offset.x / scale}px ${offset.y / scale}px`,
        position: 'absolute',
        top: "0px",
        left: "0px",
        right: insetBottomRight,
        bottom: insetBottomRight
      }}
    ></div>
  )
}
