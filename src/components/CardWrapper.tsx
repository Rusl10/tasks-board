import { memo } from 'react';
import { Card } from './Card';
import { SizeObserver } from './SizeObserver';
import { useEvent } from "../hooks/useEvent";

export const CardWrapper = memo(({cardData, onRemoveCard, changeCardsArray}) => {
  const resizeCb = useEvent((entries: ResizeObserverEntry[]) => {
    console.log('resizeCb')
    changeCardsArray({
      ...cardData,
      height: entries[0].borderBoxSize[0].blockSize,
      bottom: cardData.top + entries[0].borderBoxSize[0].blockSize
    })
  })
  return (
    <SizeObserver 
      onResize={resizeCb}
    >
      {(attachRO, detachRO) => {
        return (
          <Card
            key={cardData.id}
            attachRO={attachRO}
            detachRO={detachRO}
            cardData={cardData}
            onRemoveCard={onRemoveCard}
            changeCardsArray={changeCardsArray}
          />
        )
      }}
    </SizeObserver>
  )
})
