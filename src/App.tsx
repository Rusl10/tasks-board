import { useCallback, useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import { Point } from './types';
import { CanvasBackground } from './components/CanvasBackground';
import { CardsField } from './components/CardsField';
import { useLatest } from './hooks/useLatest';
import { createInitialCard, DEFAULT_ELEMENT_SIZE } from './utils/index';
import { ICard } from './types/index';
import './App.css';

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const SCALE_INTERVAL = 0.1;

export const App = () => {
  const [cards, setCards] = useState(() => [createInitialCard()]);
  const [canvasPosition, setCanvasPosition] = useState<Point>({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const ref = useRef<HTMLDivElement | null>(null);
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
        const distanceX = e.clientX - latestCanvasPosition.current.x;
        const distanceY = e.clientY - latestCanvasPosition.current.y;

        const cardX = distanceX / latestScale.current;
        const cardY = distanceY / latestScale.current;

        const newCard: ICard = {
          text: '',
          id: nanoid(),
          left: cardX - DEFAULT_ELEMENT_SIZE / 2,
          top: cardY - DEFAULT_ELEMENT_SIZE / 2,
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
    const element = ref.current;

    if (!element) {
      return;
    }

    const handleWheel = (e: WheelEvent) => {
      const currentScale = latestScale.current;
      const direction = e.deltaY > 0 ? 'down' : 'up';

      let newScale =
        direction === 'up'
          ? currentScale + SCALE_INTERVAL
          : currentScale - SCALE_INTERVAL;
      newScale = Math.min(MAX_SCALE, Math.max(newScale, MIN_SCALE));

      const oldScaleDistanceX = e.clientX - latestCanvasPosition.current.x;
      const oldScaleDistanceY = e.clientY - latestCanvasPosition.current.y;

      const newScaleDistanceX = (oldScaleDistanceX / currentScale) * newScale;
      const newScaleDistanceY = (oldScaleDistanceY / currentScale) * newScale;

      setScale(newScale);
      setCanvasPosition({
        x: e.clientX - newScaleDistanceX,
        y: e.clientY - newScaleDistanceY,
      });
    };

    element.addEventListener('wheel', handleWheel);

    return () => element.removeEventListener('wheel', handleWheel);
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
    <div style={{ position: 'relative' }} ref={ref}>
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
