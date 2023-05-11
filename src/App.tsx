import { useState } from 'react';
import { Card } from './components/Card';
import { nanoid } from 'nanoid';
import './App.css';
import * as React from 'react';
import { useLatest } from './hooks/useLatest';
import { getRandomInt, isIntersecting } from './utils/index';

const ELEMENT_SIZE = 150;

function App() {
  const [coords, setCoords] = useState(() => [{
    id: nanoid()
  }]);
  const coordsRef = useLatest(coords);
  const refCb = React.useCallback((element: HTMLElement | null  ) => {
      if (element) {
        const cardWidth = element.offsetWidth;
        const cardHeight = element.offsetHeight;
        const maxAllowedOffsetLeft = window.innerWidth - cardWidth;
        const maxAllowedOffsetTop = window.innerHeight - cardHeight;
        let randomOffsetLeft;
        let randomOffsetTop;
        const coordsObj = {}
        do {
          randomOffsetLeft = getRandomInt(maxAllowedOffsetLeft);
          randomOffsetTop = getRandomInt(maxAllowedOffsetTop);
          coordsObj.left = randomOffsetLeft;
          coordsObj.right = randomOffsetLeft + ELEMENT_SIZE;
          coordsObj.top = randomOffsetTop;
          coordsObj.bottom = randomOffsetTop + ELEMENT_SIZE;
        } while (isIntersecting(coordsRef.current, coordsObj));
        setCoords((prev) => {
          return prev.map((prevItem, idx) => {
            if(idx === prev.length - 1) {
              element.id = prevItem.id;
              return {
                ...prevItem,
                ...coordsObj
              }
            }
            return prevItem
          })
        })
        element.style.left = randomOffsetLeft + 'px';
        element.style.top = randomOffsetTop + 'px';
      }
    }, [coordsRef])

  const dragEndHandler = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
    const newCoordsObj = {
      id: e.target.id,
      left: e.nativeEvent.clientX -  e.target.offsetWidth / 2,
      right: e.nativeEvent.clientX +  (e.target.offsetWidth / 2),
      top: e.nativeEvent.clientY -  e.target.offsetWidth / 2,
      bottom: e.nativeEvent.clientY +  (e.target.offsetWidth / 2),
    }
    if (isIntersecting(coords, newCoordsObj)) return;
    e.target.style.left = newCoordsObj.left + 'px';
    e.target.style.top = newCoordsObj.top + 'px';
    setCoords(prev => {
      const updatedArr = prev.map((coord) => {
      if (coord.id === e.target.id){
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
      })
      return updatedArr
    })
  }, [coords])
  const onAddNewCard = () => {
    setCoords(prev => {
      return [
        ...prev,
        {
          id: nanoid()
        }
      ]
    })
  };

  const onRemoveHandler = (id) => {
    setCoords(prev => prev.filter((prevItem) => prevItem.id !== id))
  }
  return (
    <>
      <button onClick={onAddNewCard}>Добавить карточку</button>
      <div className='cards-wrapper'>
        {coords.map((coord) => {
          return (
            <Card
              key={coord.id}
              id={coord.id}
              refCb={refCb} 
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
