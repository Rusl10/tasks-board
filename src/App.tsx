import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import './App.css';
import { createNewCard, isIntersecting } from './utils/index';
import { Card } from './components/Card';
import { ICard } from './types';

export const App = () => {
  const [cards, setCards] = useState(() => [{
    id: nanoid(),
    ...createNewCard(),

  }]);
  const onAddNewCard = () => {
    let newCard;
    do {
      newCard = createNewCard();
    } while (isIntersecting(cards, newCard));
    setCards(prev => {
      return [
        ...prev,
        {
          id: nanoid(),
          ...newCard
        }
      ]
    })
  };

  const changeCardsArray = (modifiedCardData: ICard) => {
    setCards(prev => prev.map((card) => {
      if (card.id === modifiedCardData.id){
        return {
          ...card,
          ...modifiedCardData,
        }
      }
      return card
    }))
  }
  // get rid of changeCardsArrayCb, pass changeCardsArray
  const changeCardsArrayCb = useCallback((modifiedCardData: ICard) => {
      changeCardsArray(modifiedCardData)
  }, [])

  const onRemoveHandler = useCallback((id) => {
    setCards(prev => prev.filter((prevItem) => prevItem.id !== id))
  }, [])

  return (
    <>
      <button onClick={onAddNewCard}>Добавить карточку</button>
      <div className='cards-wrapper'>
        {cards.map((cardItem) => {
          return (
            <Card
              key={cardItem.id}
              cardData={cardItem}
              onRemoveCard={onRemoveHandler}
              changeCardsArray={changeCardsArrayCb}
            />
          )
        })}
      </div>
    </>
  )
}
