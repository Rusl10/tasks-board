import { Point } from '../types';
import './CanvasBackground.css';

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
    <div
      className="canvas-background"
      style={{
        transform: `scale(${scale})`,
        backgroundPosition: `${canvasPosition.x / scale}px ${
          canvasPosition.y / scale
        }px`,
        right: insetBottomRight,
        bottom: insetBottomRight,
      }}
    ></div>
  );
}
