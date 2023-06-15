import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import './App.css';
import { createNewCard, isIntersecting } from './utils/index';
import { CardWrapper } from './components/CardWrapper';

function App() {
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

  function changeCardsArray(modifiedCardData) {
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
  const changeCardsArrayCb = useCallback((modifiedCardData) => {
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
            <CardWrapper 
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

export default App
