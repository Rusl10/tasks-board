import { useState, useCallback } from 'react';
import { Card } from './components/Card';
import { nanoid } from 'nanoid';
import './App.css';
import { useLatest } from './hooks/useLatest';
import { createRandomCoords, isIntersecting } from './utils/index';

function App() {
  const [coords, setCoords] = useState(() => [{
    isActive: false,
    id: nanoid(),
    ...createRandomCoords(),

  }]);
  const coordsRef = useLatest(coords);
  const onAddNewCard = () => {
    let coordsObj;
    do {
      coordsObj = createRandomCoords();
    } while (isIntersecting(coords, coordsObj));
    setCoords(prev => {
      return [
        ...prev,
        {
          id: nanoid(),
          isActive: false,
          ...coordsObj
        }
      ]
    })
  };

  function changeCoordsArray(newCoordsObj) {
    setCoords(prev => prev.map((coord) => {
      if (coord.id === newCoordsObj.id){
        return {
          ...coord,
          ...newCoordsObj,
        }
      }
      return coord
    }))
  }
  
  const checkIntersection = useCallback((temporaryCoords) => {
    if (isIntersecting(coordsRef.current, temporaryCoords)) {
      return false
    } else {
      changeCoordsArray(temporaryCoords)
      return true
    }
  }, [coordsRef])

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
              onRemoveCard={onRemoveHandler}
              changeCoordsArray={checkIntersection}
            />
          )
        })}
      </div>
    </>
  )
}

export default App
