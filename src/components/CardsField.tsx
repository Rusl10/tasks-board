
import { Card } from './Card';
export function CardsField({canvasPosition, scale, cards, onRemoveHandler, changeCardsArrayCb, mousePos}) {
  // console.log('canvasPosition in cardsField', canvasPosition)
  const clientXInPercent = mousePos.x * 100 / window.innerWidth;
  const clientYInPercent = mousePos.y * 100 / window.innerHeight;
  return (
    <>
      <div className="cards-wrapper"
      style={{
        //  применяется также и к транслейту, возникают лишние смещения при перетаскивании
        // transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
        transformOrigin: `${clientXInPercent}% ${clientYInPercent}%`,
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
