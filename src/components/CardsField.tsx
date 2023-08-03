
import { Card } from './Card';
export function CardsField({canvasPosition, scale, cards, onRemoveHandler, changeCardsArrayCb}) {
  return (
    <>
      <div className="cards-wrapper"
      style={{
        transformOrigin: "0px 0px",
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
