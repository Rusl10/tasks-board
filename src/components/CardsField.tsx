import { useState, useCallback } from 'react';
import { createNewCard, isIntersecting } from '../utils/index';
import { Card } from './Card';
import { ICard } from '../types';
export function CardsField() {
  const [cards, setCards] = useState(() => [createNewCard()]);
  const onAddNewCard = () => {
    let newCard: ICard;
    do {
      newCard = createNewCard();
    } while (isIntersecting(cards, newCard));
    setCards((prev) => {
      return [...prev, newCard];
    });
  };

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
      <button onClick={onAddNewCard}>Добавить карточку</button>
      <div className="cards-wrapper">
        {cards.map((cardItem) => {
          return (
            <Card
              key={cardItem.id}
              cardData={cardItem}
              onRemoveCard={onRemoveHandler}
              changeCardsArray={changeCardsArrayCb}
            />
          );
        })}
      </div>
    </>
  );
}