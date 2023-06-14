import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import './App.css';
import { createRandomCoords, isIntersecting } from './utils/index';
import { CardWrapper } from './components/CardWrapper';

function App() {
  const [coords, setCoords] = useState(() => [{
    id: nanoid(),
    ...createRandomCoords(),

  }]);
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
  
  const changeCoordsArrayCb = useCallback((temporaryCoords) => {
      changeCoordsArray(temporaryCoords)
  }, [])

  const onRemoveHandler = useCallback((id) => {
    setCoords(prev => prev.filter((prevItem) => prevItem.id !== id))
  }, [])

  return (
    <>
      <button onClick={onAddNewCard}>Добавить карточку</button>
      <div className='cards-wrapper'>
        {coords.map((coord) => {
          return (
            <CardWrapper 
              key={coord.id}
              coord={coord}
              onRemoveCard={onRemoveHandler}
              changeCoordsArray={changeCoordsArrayCb}
            />
          )
        })}
      </div>
    </>
  )
}

export default App
