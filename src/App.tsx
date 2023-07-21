import { useCallback, useEffect, useRef, useState } from "react"
import { Point } from "./types"
import './App.css';
import { Canvas } from './components/Canvas';
import { CardsField } from './components/CardsField';
import useScale from "./hooks/useScale"
import { useLatest } from "./hooks/useLatest"
import { createInitialCard, DEFAULT_ELEMENT_SIZE } from "./utils/index";
import { ICard } from "./types/index";
import { nanoid } from "nanoid";


export const App = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [canvasPosition, setCanvasPosition] = useState<Point>({x: 0, y: 0});
  const [cards, setCards] = useState(() => [createInitialCard()]);
  const [isNewCardMode, setIsNewCardMode] = useState(false);
  const {scale, mousePosOnScale} = useScale(ref);
  const latestIsNewCardModeRef = useLatest(isNewCardMode)
  const latestCanvasPositionRef = useLatest(canvasPosition)
  useEffect(() => {
    const prevMousePosition = {
      x: 0,
      y: 0
    };
    const handleMouseMove = (e: MouseEvent) => {
      const mouseMovePageX = e.pageX;
      const mouseMovePageY = e.pageY;
      const deltaX = mouseMovePageX - prevMousePosition.x;
      const deltaY = mouseMovePageY - prevMousePosition.y;
      prevMousePosition.x = mouseMovePageX;
      prevMousePosition.y = mouseMovePageY;
      setCanvasPosition(prevPosition => {
        return {
          x: prevPosition.x + deltaX,
          y: prevPosition.y + deltaY
        }
      })
    }
    
    const handleMouseDown = (e: MouseEvent) => {
      if(e.button > 0) return;
      if(latestIsNewCardModeRef.current) {
        const newCard: ICard = {
          text: '',
          id: nanoid(),
          left: -latestCanvasPositionRef.current.x + e.clientX - DEFAULT_ELEMENT_SIZE / 2,
          top: -latestCanvasPositionRef.current.y + e.clientY - DEFAULT_ELEMENT_SIZE / 2,
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
    }
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])
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

  // TODO учитывать позицию мышки только при зум событии
  const mousePosRef = useRef<Point>({x: 0, y: 0})
  useEffect(() => {
    // if (!mousePosRef.current) return;
    const handleMouseMove = (e: MouseEvent) => {
      console.log('e.button', e.buttons);
      mousePosRef.current.x = e.pageX * 100 / window.innerWidth;
      mousePosRef.current.y = e.pageY * 100 / window.innerHeight;
      // mousePosRef.current = {
      //   x: e.pageX,
      //   y: e.pageY
      // }
    }
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  },[])
  const buttonText = isNewCardMode ? 'Отменить' : 'Добавить карточку'
  return (
    <div ref={ref}>
      <button onMouseDown={(e) => {
        e.stopPropagation();
        console.log('setIsNewCardMode');
        setIsNewCardMode(!isNewCardMode)
      }}>{buttonText}</button>
      <CardsField 
        canvasPosition={canvasPosition}
        scale={scale}
        cards={cards}
        changeCardsArrayCb={changeCardsArrayCb}
        onRemoveHandler={onRemoveHandler}
        mousePos={mousePosOnScale}
      />
      <Canvas 
        canvasPosition={canvasPosition}
        scale={scale}
        mousePos={mousePosOnScale}
      />
    </div>
  );
};
