import { memo, useCallback, useRef } from 'react';
import { Card } from './Card';
import { SizeObserver } from './SizeObserver';

export const SizeObserverWrapper = memo(({coord, onRemoveCard, changeCoordsArray}) => {
  const cardRef = useRef(null);
  const resizeCb = useCallback((entries: ResizeObserverEntry[]) => {
    changeCoordsArray({
      ...coord,
      bottom: coord.top + entries[0].borderBoxSize[0].blockSize
    })
  }, [coord.bottom])
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
