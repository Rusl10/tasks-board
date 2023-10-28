import { useCallback, useEffect, useState } from 'react';
import { Point } from './types';
import { CardsField } from './components/CardsField';
import { CanvasBackground } from './components/CanvasBackground';
import { useLatest } from './hooks/useLatest';
import { createInitialCard, DEFAULT_ELEMENT_SIZE } from './utils/index';
import { ICard } from './types/index';
import { nanoid } from 'nanoid';
import './App.css';

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const SCALE_INTERVAL = 0.1;

export const App = () => {
  const [canvasPosition, setCanvasPosition] = useState<Point>({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [cards, setCards] = useState(() => [createInitialCard()]);
  const [isNewCardMode, setIsNewCardMode] = useState(false);

  const latestIsNewCardMode = useLatest(isNewCardMode);
  const latestCanvasPosition = useLatest(canvasPosition);
  const latestScale = useLatest(scale);

  useEffect(() => {
    const prevMousePosition = {
      x: 0,
      y: 0,
    };
    const handleMouseMove = (e: MouseEvent) => {
      const mouseMoveClientX = e.clientX;
      const mouseMoveClientY = e.clientY;
      const deltaX = mouseMoveClientX - prevMousePosition.x;
      const deltaY = mouseMoveClientY - prevMousePosition.y;
      prevMousePosition.x = mouseMoveClientX;
      prevMousePosition.y = mouseMoveClientY;

      setCanvasPosition((prevPosition) => {
        return {
          x: prevPosition.x + deltaX,
          y: prevPosition.y + deltaY,
        };
      });
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button > 0) return;

      if (latestIsNewCardMode.current) {
        const distanceByX = e.clientX - latestCanvasPosition.current.x;
        const distanceByY = e.clientY - latestCanvasPosition.current.y;
        const scaledDistanceByX = distanceByX / latestScale.current;
        const scaledDistanceByY = distanceByY / latestScale.current;
        const newCard: ICard = {
          text: '',
          id: nanoid(),
          left: scaledDistanceByX - DEFAULT_ELEMENT_SIZE / 2,
          top: scaledDistanceByY - DEFAULT_ELEMENT_SIZE / 2,
          height: DEFAULT_ELEMENT_SIZE,
          width: DEFAULT_ELEMENT_SIZE,
        };
        setCards((prev) => {
          return [...prev, newCard];
        });
        setIsNewCardMode(false);
      } else {
        prevMousePosition.x = e.clientX;
        prevMousePosition.y = e.clientY;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const handleWheelEvent = (e: WheelEvent) => {
      const direction = e.deltaY > 0 ? 'down' : 'up';
      const currentScale = latestScale.current;

      let newScale: number =
        direction === 'up'
          ? currentScale + SCALE_INTERVAL
          : currentScale - SCALE_INTERVAL;
      newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));

      const distanceByX = e.clientX - latestCanvasPosition.current.x;
      const distanceByY = e.clientY - latestCanvasPosition.current.y;

      const scaledDistanceByX = (distanceByX / currentScale) * newScale;
      const scaledDistanceByY = (distanceByY / currentScale) * newScale;

      setScale(newScale);
      setCanvasPosition({
        x: e.clientX - scaledDistanceByX,
        y: e.clientY - scaledDistanceByY,
      });
    };

    document.addEventListener('wheel', handleWheelEvent);

    return () => {
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

  const buttonText = isNewCardMode ? 'Cancel' : 'Add a new card';

  return (
    <div style={{ position: 'relative' }}>
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
      <CanvasBackground canvasPosition={canvasPosition} scale={scale} />
    </div>
  );
};
