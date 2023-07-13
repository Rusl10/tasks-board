
import { Card } from './Card';
export function CardsField({canvasPosition, scale, cards, onRemoveHandler, changeCardsArrayCb}) {
  // console.log('canvasPosition in cardsField', canvasPosition)

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
