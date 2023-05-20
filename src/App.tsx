import { useState, useCallback } from 'react';
import { Card } from './components/Card';
import { nanoid } from 'nanoid';
import './App.css';
import { useLatest } from './hooks/useLatest';
import { createRandomCoords, isIntersecting, newUserCoordsObj } from './utils/index';

function App() {
  // console.log('App ender')
  const [coords, setCoords] = useState(() => [{
    isActive: false,
    id: nanoid(),
    ...createRandomCoords(),

  }]);
  const coordsRef = useLatest(coords);
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
          isActive: false,
          ...coordsObj
        }
      ]
    })
  }, [coordsRef]);

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
  const onMouseDownHandler = useCallback((id, event, cardCoords) => {
    const oldCardCoords = cardCoords;
    const cardElement = event.currentTarget;
    console.log('cardElement', cardElement)
    // Почему при таком поведении не срабатывает mouseDown 2й раз ???
    // document.body.append(cardElement);

    let mouseMovePageX;
    let mouseMovePageY;
    function onMouseMove(event: MouseEvent) {
      mouseMovePageX = event.pageX;
      mouseMovePageY = event.pageY;
      const newCoordsObj = newUserCoordsObj(mouseMovePageX, mouseMovePageY, id, true);
      changeCoordsArray(newCoordsObj);
    }

    document.addEventListener('mousemove', onMouseMove);

    cardElement.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      console.log('mouseMovePageX in mouseUp', mouseMovePageX)
      const newCoordsObj = newUserCoordsObj(mouseMovePageX, mouseMovePageY, id, false);
      // сетим координаты, только если карточка была сдвинута
      if (mouseMovePageX && mouseMovePageY) {
        // если есть пересечение с другими карточками, ставим карточку на прежнее место
        if (isIntersecting(coordsRef.current, newCoordsObj)) {
          changeCoordsArray(oldCardCoords)
        } else {
          changeCoordsArray(newCoordsObj);
        }
      }
      cardElement.onmouseup = null;
    };
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
              onMouseDown={onMouseDownHandler}
              onRemoveCard={onRemoveHandler}
            />
          )
        })}
      </div>
    </>
  )
}

export default App
