import { useState, useCallback } from 'react';
import { Card } from './components/Card';
import { nanoid } from 'nanoid';
import './App.css';
import * as React from 'react';
import { useLatest } from './hooks/useLatest';
import { createRandomCoords, isIntersecting } from './utils/index';

function App() {
  console.log('App ender')
  const [coords, setCoords] = useState(() => [{
    id: nanoid(),
    ...createRandomCoords(),

  }]);
  const coordsRef = useLatest(coords);

  const dragEndHandler = React.useCallback((id, e) => {
    const newCoordsObj = {
      id: id,
      left: e.clientX -  e.target.offsetWidth / 2,
      right: e.clientX +  (e.target.offsetWidth / 2),
      top: e.clientY -  e.target.offsetWidth / 2,
      bottom: e.clientY +  (e.target.offsetWidth / 2),
    }
    if (isIntersecting(coords, newCoordsObj)) return;
    setCoords(prev => prev.map((coord) => {
      if (coord.id === id){
        console.log('equals')
        return {
          ...coord,
          left: newCoordsObj.left,
          right: newCoordsObj.right,
          top: newCoordsObj.top,
          bottom: newCoordsObj.bottom,
        }
      }
      return coord
    }))
  }, [coordsRef])
  const onAddNewCard = useCallback(() => {
    let coordsObj;
    do {
      coordsObj = createRandomCoords();
    } while (isIntersecting(coordsRef.current, coordsObj));
    setCoords(prev => {
      return [
        ...prev,
        {
          id: nanoid(),
          ...coordsObj
        }
      ]
    })
  }, [coordsRef]);

  const onRemoveHandler = useCallback((id) => {
    setCoords(prev => prev.filter((prevItem) => prevItem.id !== id))
  }, [])
  return (
    <>
      <button onClick={onAddNewCard}>Добавить карточку</button>
      <div className='cards-wrapper'>
        {coords.map((coord) => {
          return (
            <Card
              key={coord.id}
              coord={coord}
              onDragEnd={dragEndHandler}
              onRemoveCard={onRemoveHandler}
            />
          )
        })}
      </div>
    </>
  )
}

export default App
