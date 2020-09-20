import React, { useState, useRef, useEffect } from "react";


import useMousePosition from './components/useMousePosition' 

import { useGesture } from 'react-use-gesture'






import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'; //default scroll lock





function App () {



 



  //Zoom vars


 const [zoom, setZoom] = useState(1)



 var fMouseX=0
 var fMouseY=0

 const { x, y } = useMousePosition(); //get mouse position 
 const hasMovedCursor = typeof x === "number" && typeof y === "number"; //mouse position again

 const [cursorX, setCursorX] = useState(0) 
 const [cursorY, setCursorY] = useState(0)

 const [fOffsetX, setFOffsetX] = useState(0) 
 const [fOffsetY, setFOffsetY] = useState(0)

 const [fWorldX, setFWorldX] = useState(0) //world space coordinates
 const [fWorldY, setFWorldY] = useState(0)

 const [nScreenX, setNScreenX] = useState(0) //screen space coordinates
 const [nScreenY, setNScreenY] = useState(0)

 const [startPanX, setStartPanX] = useState(0)
 const [startPanY, setStartPanY] = useState(0) //course "programming panning and zooming, 9:32" We have to update those vars only onPinch

 const [startPanning, setStartPanning] = useState(false)
 const [panning, setPanning] = useState(false)

 const ref = useRef(null);

 const bind = useGesture(
   {

     onDragStart: () => setStartPanning(true),
     onDrag: () => setPanning(true),
     onDragStop: () => (setPanning(false), setStartPanning(false))

   }
 )

 useEffect(() => {

  disableBodyScroll(document.querySelector(".App"))
     console.log('SCREEN H', ref.current ? ref.current.offsetHeight/2 : 0);

     setFOffsetX(-ref.current.offsetWidth/2)
     setFOffsetY(-ref.current.offsetHeight/2) //finding the center of the screen. The offset is negative!


   }, []);

 useEffect(() => {

  fMouseX = ref.current.getBoundingClientRect().x
  fMouseY = ref.current.getBoundingClientRect().y 

  // console.log('cursor from the world x', ref.current ? x-ref.current.getBoundingClientRect().x : 0);
  // console.log('cursor from the world y', ref.current ? y-ref.current.getBoundingClientRect().y : 0); //cursor relative to our inner div

  if (startPanning) {



    setStartPanX(x- ref.current.getBoundingClientRect().x)
    setStartPanY(y- ref.current.getBoundingClientRect().y )

    console.log(fMouseX)
    console.log(fMouseY)

  }

  if (panning) {
    setFOffsetX((prev) => prev -(fMouseX - startPanX))
    setFOffsetY((prev) => prev - (fMouseY - startPanY))

    setStartPanX(fMouseX)
    setStartPanY(fMouseY)

  }




   }, [x, y, panning]);

  function WorldToScreen(fWorldX, fWorldY) {

    setNScreenX(fWorldX- fOffsetX)
    setNScreenY(fWorldY- fOffsetY)

  }

  function ScreenToWorld(nScreenX, nScreenY) {

    setFWorldX(nScreenX+fOffsetX)
    setFWorldY(nScreenY+fOffsetY)

  }

  return (



   


    <div  className="App" {...bind()} style={{userSelect: 'none', overflow: 'visible'}}>

    <div style= {{zIndex: '1', position: 'absolute'}}>
    </div>



   <div >
    <div ref={ref}    style = {{transform: 'translateX('+ startPanX +'px)' + 'translateY('+startPanY +'px)',  height: '100vh' }}>
    Hello

    Hey

    </div>

    </div>

    </div>
  );

};

export default App;