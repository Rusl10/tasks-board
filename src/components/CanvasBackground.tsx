import { Point } from '../types/index';

interface ICanvasProps {
  canvasPosition: Point;
  scale: number;
}

export function CanvasBackground({ canvasPosition, scale }: ICanvasProps) {
  /* old */
  // const inset = `-${(100 / scale - 100) / 2}%`;
  /* new */
  const inset = `-${100 / scale - 100}%`;

  return (
    <div
      style={{
        backgroundImage:
          'url(https://example-use-pan.vercel.app/assets/grid-10dccd16.svg)',
        transform: `scale(${scale})`,
        backgroundPosition: `${canvasPosition.x / scale}px ${
          canvasPosition.y / scale
        }px`,
        backgroundColor: 'rgba(31, 41, 55, 1)',
        position: 'absolute',
        zIndex: -1,
        /* old */
        // inset,
        /* new */
        transformOrigin: 'top left',
        top: 0,
        left: 0,
        right: inset,
        bottom: inset,
      }}
    ></div>
  );
}
