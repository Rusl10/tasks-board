import { memo } from 'react';
import { Card } from './Card';
import { SizeObserver } from './SizeObserver';
import { useEvent } from "../hooks/useEvent";

export const CardWrapper = memo(({coord, onRemoveCard, changeCoordsArray}) => {
  const resizeCb = useEvent((entries: ResizeObserverEntry[]) => {
    console.log('resizeCb')
    changeCoordsArray({
      ...coord,
      bottom: coord.top + entries[0].borderBoxSize[0].blockSize
    })
  })
  return (
    <SizeObserver 
      onResize={resizeCb}
    >
      {(attachRO, detachRO) => {
        return (
          <Card
            key={coord.id}
            attachRO={attachRO}
            detachRO={detachRO}
            coord={coord}
            onRemoveCard={onRemoveCard}
            changeCoordsArray={changeCoordsArray}
          />
        )
      }}
    </SizeObserver>
  )
})
