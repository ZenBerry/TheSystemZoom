import React, { useState, useRef, useEffect } from "react";


import useMousePosition from './components/useMousePosition' 



import InfiniteViewer from "react-infinite-viewer"; //infinite scroll


import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'; //default scroll lock





function App () {



 



  //Zoom vars


 const [zoom, setZoom] = useState(1)


 const [pinchScroll, setPinchScroll] = useState(false)

 const [pinchOffsetX, setPinchOffsetX] = useState(0)
 const [pinchOffsetY, setPinchOffsetY] = useState(0)

 const [isZoomingIn, setIsZoomingIn] = useState(null)

 const { x, y } = useMousePosition(); //get mouse position 

 const hasMovedCursor = typeof x === "number" && typeof y === "number"; //mouse position again

 const [cursorX, setCursorX] = useState(0) 
 const [cursorY, setCursorY] = useState(0)

 const [startPanX, setStartPanX] = useState(null)
 const [startPanY, setStartPanY] = useState(null) //course "programming panning and zooming, 9:32" We have to update those vars only onPinch

 const ref = useRef(null);

 useEffect(() => {
     console.log('SCREEN H', ref.current ? ref.current.offsetHeight : 0);
     // console.log('cursor from the world y', ref.current ? y-ref.current.getBoundingClientRect().y : 0);

    

     

     setPinchOffsetY( -(ref.current.getBoundingClientRect().y + ref.current.getBoundingClientRect().height / 2))
     setPinchOffsetX(-(ref.current.getBoundingClientRect().x + ref.current.getBoundingClientRect().width / 2))

     // ref.current.offsetWidth

   }, [x, y]);

  return (



   


    <div  className="App"  style={{userSelect: 'none', overflow: 'visible'}}>

    <div style= {{zIndex: '1', position: 'absolute'}}>

    
   Offset X {pinchOffsetX} <br/>
   Offset Y {pinchOffsetY} <br/>
   Zoom {zoom}  <br/>
   {hasMovedCursor
           ? (`Your cursor is at ${x}, ${y}.`)
           : "Move your mouse around."} <br/>

   cursorX {cursorX} <br/>
   cursorY {cursorY} <br/>






   </div>

 
    <InfiniteViewer
     
        className="viewer"
        margin={1}
        threshold={1}
        rangeX={[100000000, 100000000]}
        rangeY={[100000000, 100000000]}

        pinchThreshold = {1}

 
        onScroll = {e => {

        console.log("Scroll event",e)


                  setCursorX(e.scrollLeft)
                  setCursorY(e.scrollTop)






        }}

        onPinch={e => {



          if (e.zoom < 1  ) {
            console.log('zooming out');

            setIsZoomingIn(false)


          } else { 

            console.log('zooming in') ;



            setIsZoomingIn(true) 
     

          }


    
         setZoom((prev) => (prev* e.zoom*e.scale) 





          )  





        }}

        >




        <div  style={{height: '100vh'}} >

        <div  ref={ref} style={{transform:'scale('+zoom+')' +  'translateX('+ pinchOffsetX*zoom+ 1280/2  + x +'px)' + 'translateY('+ pinchOffsetY*zoom+ 698/2 +y +'px)' , backgroundColor: "white", height: '100vh'}}> 




      
       Hello

        </div>

        </div>

    </InfiniteViewer>
    


  

  



   
  

    </div>
  );

};

export default App;