import { useCallback, useEffect, useRef, useState } from 'react';
import { Point } from './types';
import { Canvas } from './components/Canvas';
import { CardsField } from './components/CardsField';
import { useLatest } from './hooks/useLatest';
import { createInitialCard, DEFAULT_ELEMENT_SIZE } from './utils/index';
import { ICard } from './types/index';
import { nanoid } from 'nanoid';
import './App.css';

type ScaleOpts = {
  direction: 'up' | 'down';
  interval: number;
  mousePos: Point;
};

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;

export const App = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [canvasPosition, setCanvasPosition] = useState<Point>({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [cards, setCards] = useState(() => [createInitialCard()]);
  const [isNewCardMode, setIsNewCardMode] = useState(false);
  const latestIsNewCardModeRef = useLatest(isNewCardMode);
  const latestCanvasPositionRef = useLatest(canvasPosition);
  useEffect(() => {
    const prevMousePosition = {
      x: 0,
      y: 0,
    };
    const handleMouseMove = (e: MouseEvent) => {
      const mouseMovePageX = e.pageX;
      const mouseMovePageY = e.pageY;
      const deltaX = mouseMovePageX - prevMousePosition.x;
      const deltaY = mouseMovePageY - prevMousePosition.y;
      prevMousePosition.x = mouseMovePageX;
      prevMousePosition.y = mouseMovePageY;
      setCanvasPosition((prevPosition) => {
        return {
          x: prevPosition.x + deltaX,
          y: prevPosition.y + deltaY,
        };
      });
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button > 0) return;
      if (latestIsNewCardModeRef.current) {
        const newCard: ICard = {
          text: '',
          id: nanoid(),
          left:
            -latestCanvasPositionRef.current.x +
            e.clientX -
            DEFAULT_ELEMENT_SIZE / 2,
          top:
            -latestCanvasPositionRef.current.y +
            e.clientY -
            DEFAULT_ELEMENT_SIZE / 2,
          height: DEFAULT_ELEMENT_SIZE,
          width: DEFAULT_ELEMENT_SIZE,
        };
        setCards((prev) => {
          return [...prev, newCard];
        });
        setIsNewCardMode(false);
      } else {
        prevMousePosition.x = e.pageX;
        prevMousePosition.y = e.pageY;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const updateScale = ({ direction, interval, mousePos }: ScaleOpts) => {
      console.log('updateScale canvasPosition', canvasPosition);
      const changeCanvPosOnScale = (scale, currentScale) => {
        const distanceByX = mousePos.x - latestCanvasPositionRef.current.x;
        const distanceByY = mousePos.y - latestCanvasPositionRef.current.y;
        const scaledDistanceByX = (distanceByX / currentScale) * scale;
        const scaledDistanceByY = (distanceByY / currentScale) * scale;
        console.log('scaledDistanceByX', scaledDistanceByX);
        console.log('scaledDistanceByY', scaledDistanceByY);
        setCanvasPosition({
          x: mousePos.x - scaledDistanceByX,
          y: mousePos.y - scaledDistanceByY,
        });
      };
      setScale((currentScale) => {
        let scale: number;

        if (direction === 'up' && currentScale + interval < MAX_SCALE) {
          scale = currentScale + interval;
          changeCanvPosOnScale(scale, currentScale);
        } else if (direction === 'up') {
          scale = MAX_SCALE;
          changeCanvPosOnScale(scale, currentScale);
        } else if (
          direction === 'down' &&
          currentScale - interval > MIN_SCALE
        ) {
          scale = currentScale - interval;
          changeCanvPosOnScale(scale, currentScale);
        } else if (direction === 'down') {
          scale = MIN_SCALE;
          changeCanvPosOnScale(scale, currentScale);
        } else {
          scale = currentScale;
        }

        return scale;
      });
    };
    const handleWheelEvent = (e: WheelEvent) => {
      updateScale({
        direction: e.deltaY > 0 ? 'down' : 'up',
        interval: 0.1,
        mousePos: {
          x: e.pageX,
          y: e.pageY,
        },
      });
    };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('wheel', handleWheelEvent);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('wheel', handleWheelEvent);
    };
  }, []);
  const changeCardsArrayCb = useCallback((modifiedCard: ICard) => {
    setCards((prev) =>
      prev.map((card) => {
        if (card.id === modifiedCard.id) {
          return modifiedCard;
        }
        return card;
      })
    );
  }, []);

  const onRemoveHandler = useCallback((id: string) => {
    setCards((prev) => prev.filter((prevItem) => prevItem.id !== id));
  }, []);
  const buttonText = isNewCardMode ? 'Отменить' : 'Добавить карточку';
  return (
    <div ref={ref}>
      <button
        onMouseDown={(e) => {
          e.stopPropagation();
          setIsNewCardMode(!isNewCardMode);
        }}
      >
        {buttonText}
      </button>
      <CardsField
        canvasPosition={canvasPosition}
        scale={scale}
        cards={cards}
        changeCardsArrayCb={changeCardsArrayCb}
        onRemoveHandler={onRemoveHandler}
      />
      <Canvas canvasPosition={canvasPosition} scale={scale} />
    </div>
  );
};
