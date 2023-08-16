import { ICard, Point } from '../types';
import { Card } from './Card';

interface ICardsFieldProps {
  canvasPosition: Point;
  scale: number;
  cards: ICard[];
  onRemoveHandler: (id: string) => void;
  changeCardsArrayCb: (card: ICard) => void;
}

export function CardsField({
  canvasPosition,
  scale,
  cards,
  onRemoveHandler,
  changeCardsArrayCb,
}: ICardsFieldProps) {
  return (
    <div
      className="cards-wrapper"
      style={{
        transformOrigin: '0px 0px',
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
  );
}
