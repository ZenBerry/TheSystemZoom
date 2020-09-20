import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import Draggable from 'react-draggable'
import Moveable from './components/Moveable' 

import useMousePosition from './components/useMousePosition' 



import InfiniteViewer from "react-infinite-viewer"; //infinite scroll


import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'; //default scroll lock

var connectionOptions =  {
            "force new connection" : true,
            "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
            "timeout" : 10000,                  //before connect_error and connect_timeout are emitted.
            "transports" : ["websocket"]
        };

// const socket = io("https://finance-test-websockets.herokuapp.com/", connectionOptions); //for running online
const socket = io("http://localhost:5000", connectionOptions); //for running locally



function App () {

  const [sum, setSum] = useState(-1)

  const [response,setResponse] = useState('Loading...')
  const [passwords,setPasswords] = useState([])
  const [myVar,setMyVar] = useState("loading...")

  const [test,setTest] = useState("TEST")

  const [value,setValue] = useState(null)
  const [newData,setNewData] = useState(0)

  const [formValue, setFormValue] = useState("")

 

  //Drag vars 

 
  const [mySocket, setMySocket] = useState("")
  const [dragSocket, setDragSocket] = useState("")

  const [moveableInitX, setMoveableInitX] = useState(0)
  const [moveableInitY, setMoveableInitY] = useState(0)

  const [moveables, setMoveables] = useState(-1)

  const [positions, setPositions] = useState([])

  //Zoom cars


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
     console.log('cursor from the world x', ref.current ? x-ref.current.getBoundingClientRect().x : 0);
     console.log('cursor from the world y', ref.current ? y-ref.current.getBoundingClientRect().y : 0);

     setPinchOffsetY(ref.current.getBoundingClientRect().height)
     setPinchOffsetX(ref.current.getBoundingClientRect().width)

     // ref.current.offsetWidth

   }, [x, y]);





  useEffect(() => {

    disableBodyScroll(document.querySelector(".App"))

    socket.on('remoteAddMoveables', (moveables, moveableInitX, moveableInitY) => {

      setMoveableInitX(moveableInitX)
      setMoveableInitY(moveableInitY)
       setMoveables(moveables) 


    });

    socket.on('socketInfo', (data) => {
          // we get settings data and can do something with it
          // console.log("SOCKET INFO ",data)
          // setSum(data)

          setMySocket(data)

        });


    socket.emit("read")

    socket.on('readResponse', (howManyMoveables, positions) => {

          
        //for some strange reason it doesn't work as intended. Inspect!

        });

    

    socket.on('new-remote-operations', (data: number, howManyMoveables, positions) => {

          setPositions(positions)  
          setMoveables(howManyMoveables) 
        //  console.log("howManyMoveables", howManyMoveables)  
          setSum(data)

        });

  }, []);

  function handleClick() {

  
  }

  function handleSubmit(e : any) {
    e.preventDefault();


    
    if (Number.isNaN(newData) == true){
      alert("wrong number!")

    } else {


     socket.emit("read")
     socket.on('readResponse', (data: number) => {

          
           socket.emit("new-operations", data+newData)
           
           setSum(data)

           socket.off('readResponse')



         });


     // setMyVar((prev) => (prev+newData) )
   }

    setFormValue("") 
    



  }


  function handleChange(e: any) {

    setNewData(Number(e.target.value)) 
    setFormValue(e.target.value) 
  



    

  }

  function handleMoveableAddition (e) {


    //console.log("E!", e)
   
    setMoveableInitX(e.clientX) //clientX or screenX
    setMoveableInitY(e.clientY-33)


    setMoveables(prev => prev+1)
    socket.emit("addMoveables", moveables+1, e.clientX, e.clientY-33) //WE HAVE TO MAKE IT BETTER
     


  


}
  document.ondblclick = (e) => handleMoveableAddition(e);





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


        {/*  console.log("PINCH E", e.inputEvent.clientX)*/}

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

        <div  ref={ref} style={{transform:'scale('+zoom+')' +  'translateX('+ (isZoomingIn && cursorX+x) +'px)' + 'translateY('+ (isZoomingIn && cursorY+y) +'px)' , backgroundColor: "white", height: '100vh'}}>




        { moveables > -1 && ( [...Array(moveables)].map((e, i) =>  <span style={{position: 'absolute', top:0, left: 0}}>  <Moveable  socket={socket} mySocket={mySocket} id = {i}  x={moveableInitX} y={moveableInitY}>  </Moveable> </span>) )}

        {/*<div style={{transform:  'translateX('+ pinchOffsetX/2 +'px)' + 'translateY('+ pinchOffsetY/2 +'px)'}}> CENTER </div>*/}
     

        </div>

        </div>

    </InfiniteViewer>
    


  

  



   
  

    </div>
  );

};

export default App;