import { memo, useRef } from 'react';
import { Card } from './Card';
import { SizeObserver } from './SizeObserver';
import { useEvent } from "../hooks/useEvent";

export const SizeObserverWrapper = memo(({coord, onRemoveCard, changeCoordsArray}) => {
  const cardRef = useRef(null);
  const resizeCb = useEvent((entries: ResizeObserverEntry[]) => {
    console.log('resizeCb')
    changeCoordsArray({
      ...coord,
      bottom: coord.top + entries[0].borderBoxSize[0].blockSize
    })
  })
  return (
    <SizeObserver 
      nodeRef={cardRef} 
      onResize={resizeCb}
    >
      {(ref) => {
        return (
          <Card
            key={coord.id}
            elementRef={ref}
            coord={coord}
            onRemoveCard={onRemoveCard}
            changeCoordsArray={changeCoordsArray}
          />
        )
      }}
    </SizeObserver>
  )
})
