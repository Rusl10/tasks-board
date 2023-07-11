import { useState, useCallback, useLayoutEffect } from 'react';
import { DEFAULT_ELEMENT_SIZE, createInitialCard } from '../utils/index';
import { Card } from './Card';
import { ICard } from '../types';
import { nanoid } from 'nanoid';
export function CardsField({canvasPosition, scale, newCardPoint}) {
  // console.log('canvasPosition in cardsField', canvasPosition)
  const [cards, setCards] = useState(() => [createInitialCard()]);

  useLayoutEffect(() => {
    if(!newCardPoint) return;
    const newCard: ICard = {
      text: '',
      id: nanoid(),
      left: newCardPoint.x - DEFAULT_ELEMENT_SIZE / 2,
      top: newCardPoint.y - DEFAULT_ELEMENT_SIZE / 2,
      height: DEFAULT_ELEMENT_SIZE,
      width: DEFAULT_ELEMENT_SIZE,
    };
    setCards((prev) => {
      return [...prev, newCard];
    });
  }, [newCardPoint])

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

  return (
    <>
      <div className="cards-wrapper"
      style={{
        transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${scale})`,
      }}
      >
        {cards.map((cardItem) => {
          return (
            <Card
              key={cardItem.id}
              cardData={cardItem}
              onRemoveCard={onRemoveHandler}
              changeCardsArray={changeCardsArrayCb}
              scale={scale}
            />
          );
        })}
      </div>
    </>
  );
}
