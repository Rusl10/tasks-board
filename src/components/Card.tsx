import {
  ChangeEvent,
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useLatest } from '../hooks/useLatest';
import { rafThrottle } from '../utils/index';
import { ICard, Point } from '../types';
import { registerResizeObserverCb } from '../utils/sizeObserver';
import './Card.css';

const MIN_TEXTAREA_HEIGHT = 18;

interface ICardProps {
  cardData: ICard;
  scale: number;
  changeCardsArray: (cardData: ICard) => void;
  onRemoveCard: (id: string) => void;
}

export const Card = memo(function Card({
  onRemoveCard,
  cardData,
  changeCardsArray,
  scale,
}: ICardProps): JSX.Element {
  const [isFocused, setIsFocused] = useState(false);
  const [tempCardData, setTempCardData] = useState<ICard | null>(null);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const isDragging = useRef(false);

  const latestCardData = useLatest(cardData);
  const latestTempCardData = useLatest(tempCardData);
  const latestScale = useLatest(scale);

  useEffect(() => {
    const textAreaEl = textAreaRef.current;
    if (!textAreaEl) return;
    const handleMouseDown = (e: MouseEvent) => {
      e.stopPropagation();
    };

    textAreaEl.addEventListener('mousedown', handleMouseDown);
    return () => {
      textAreaEl.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  useEffect(() => {
    const cardEl = cardRef.current;

    if (!cardEl) return;

    let prevMouseMosition: Point;

    const handleMouseMove = rafThrottle((event: MouseEvent) => {
      const tempCardData = latestTempCardData.current;

      if (!tempCardData) return;

      const deltaX = event.clientX - prevMouseMosition.x;
      const deltaY = event.clientY - prevMouseMosition.y;

      prevMouseMosition = {
        x: event.clientX,
        y: event.clientY,
      };

      setTempCardData({
        ...tempCardData,
        top: tempCardData.top + deltaY / latestScale.current,
        left: tempCardData.left + deltaX / latestScale.current,
      });
    });
    const handleMouseUp = () => {
      if (
        latestTempCardData.current &&
        (latestTempCardData.current.left !== latestCardData.current.left ||
          latestTempCardData.current.top !== latestCardData.current.top)
      ) {
        changeCardsArray(latestTempCardData.current);
      }
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    const handleMouseDown = (event: MouseEvent) => {
      if (event.button > 0) return;
      prevMouseMosition = {
        x: event.clientX,
        y: event.clientY,
      };
      isDragging.current = true;
      setTempCardData(latestTempCardData.current || latestCardData.current);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    cardEl.addEventListener('mousedown', handleMouseDown);
    return () => {
      cardEl.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cardData.id]);

  useEffect(() => {
    const cardEl = cardRef.current;

    if (!isFocused || !cardEl) return;

    return registerResizeObserverCb(cardEl, (entry) => {
      const tempCardData = latestTempCardData.current;

      if (!tempCardData) return;

      setTempCardData({
        ...tempCardData,
        height: entry.borderBoxSize[0].blockSize,
      });
    });
  }, [isFocused]);

  useLayoutEffect(() => {
    if (!textAreaRef.current) return;

    textAreaRef.current.style.height = 'inherit';
    textAreaRef.current.style.height = `${Math.max(
      textAreaRef.current.scrollHeight,
      MIN_TEXTAREA_HEIGHT
    )}px`;
  }, [tempCardData, cardData]);

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!tempCardData) return;

    setTempCardData({
      ...tempCardData,
      text: e.target.value,
    });
  };

  const handleTextAreaBlur = () => {
    if (!tempCardData) return;

    if (!isDragging.current) {
      setTempCardData(null);
    }
    changeCardsArray(tempCardData);
    setIsFocused(false);
  };

  const handleDoubleClick = () => {
    if (!textAreaRef.current) return;

    textAreaRef.current.focus();
    setTempCardData(cardData);
  };

  const actualCard = tempCardData || cardData;

  return (
    <div
      className="card"
      style={{
        transform: `translate(${actualCard.left}px, ${actualCard.top}px)`,
      }}
      ref={cardRef}
      onContextMenu={(e) => {
        e.preventDefault();
        onRemoveCard(actualCard.id);
      }}
      onDoubleClick={handleDoubleClick}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onDragStart={(e) => {
        e.preventDefault();
      }}
    >
      <textarea
        onFocus={(e) => {
          setIsFocused(true);
        }}
        ref={textAreaRef}
        onMouseMove={(e) => {
          e.stopPropagation();
        }}
        style={{
          minHeight: MIN_TEXTAREA_HEIGHT,
        }}
        onBlur={handleTextAreaBlur}
        value={actualCard.text}
        onChange={handleTextareaChange}
      ></textarea>
    </div>
  );
});
