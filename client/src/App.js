import React, { useState, useRef, useEffect } from "react";


import useMousePosition from './components/useMousePosition' 






import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'; //default scroll lock





function App () {



 



  //Zoom vars


 const [zoom, setZoom] = useState(1)





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

 const [startPanX, setStartPanX] = useState(null)
 const [startPanY, setStartPanY] = useState(null) //course "programming panning and zooming, 9:32" We have to update those vars only onPinch

 const ref = useRef(null);

 useEffect(() => {
     console.log('SCREEN H', ref.current ? ref.current.offsetHeight/2 : 0);

     setFOffsetX(-ref.current.offsetWidth/2)
     setFOffsetY(-ref.current.offsetHeight/2)


   }, []);

  function WorldToScreen(fWorldX, fWorldY) {

    setNScreenX(fWorldX- fOffsetX)
    setNScreenY(fWorldY- fOffsetY)

  }

  function ScreenToWorld(nScreenX, nScreenY) {

    setFWorldX(nScreenX+fOffsetX)
    setFWorldY(nScreenY+fOffsetY)

  }

  return (



   


    <div  className="App"  style={{userSelect: 'none', overflow: 'visible'}}>

    <div style= {{zIndex: '1', position: 'absolute'}}>
    </div>

    <div style = {{transform: 'translateX('+ fOffsetX +'px)' + 'translateY('+ fOffsetY +'px)' }}>
    
    Hello

    </div>

    </div>
  );

};

export default App;