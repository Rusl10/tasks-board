import { Point } from '../types';

type CanvasBackgroundProps = {
  canvasPosition: Point;
  scale: number;
};

export function CanvasBackground({
  canvasPosition,
  scale,
}: CanvasBackgroundProps): JSX.Element {
  const insetBottomRight = `-${100 / scale - 100}%`;
  return (
    <div className="wrapper">
      <div
        style={{
          backgroundImage:
            'url(https://example-use-pan.vercel.app/assets/grid-10dccd16.svg)',
          transform: `scale(${scale})`,
          backgroundPosition: `${canvasPosition.x / scale}px ${
            canvasPosition.y / scale
          }px`,
          backgroundColor: 'rgba(31, 41, 55, 1)',
          maskPosition: 'absolute',
          zIndex: -1,
          position: 'absolute',
          transformOrigin: 'top left',
          top: '0px',
          left: '0px',
          right: insetBottomRight,
          bottom: insetBottomRight,
        }}
      ></div>
    </div>
  );
}
