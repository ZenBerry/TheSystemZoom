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

let ctx = null;

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

 const [diffX, setDiffX] = useState(0) //important! Diff between the mouse and the dot
 const [diffY, setDiffY] = useState(0) //important! Diff between the mouse and the dot

 const ref = useRef(null);
 const mainDiv = useRef();

 const [circleStyle, setCircleStyle] = useState(null)

 //CANVAS

     const canvas = useRef();
     

     const drawLine = (info, style = {}) => {
       const { x, y, x1, y1 } = info;

      
       ctx.beginPath();
       ctx.moveTo(x, y);
       ctx.lineTo(x1, y1);
       ctx.strokeStyle = 'black';
       ctx.lineWidth = 1;
       ctx.stroke();
     }

 

     useEffect(() => {

      setCircleStyle({ //the point
      position:'absolute',
      //set scale the opposite to zoom like 0.something
      top: (y + cursorY),
      left: (x + cursorX),
      padding:0,
      margin:0,
      display:"inline-block",
      backgroundColor: 'black',
      borderRadius: "50%",
      width:0.5,
      height:0.5,
    })


      

      

       // dynamically assign the width and height to canvas
       const canvasEle = canvas.current;
       canvasEle.width = mainDiv.current.getBoundingClientRect().width; //or probably window.width? (I don't remember the exact syntax)
       canvasEle.height = mainDiv.current.getBoundingClientRect().height;
     
       // get context of the canvas
       ctx = canvasEle.getContext("2d");




     }, [x,y, zoom, cursorX, cursorY]);

     useEffect(() => {
       drawLine({ x: x, y: y-35, x1: ref.current.getBoundingClientRect().x, y1: ref.current.getBoundingClientRect().y-35 });

       console.log("Diff from DrawLine: ", diffY)

     }, [zoom,x,y, cursorX, cursorY]);



 useEffect(() => {  
     console.log('Point diff X', ref.current ? ref.current.getBoundingClientRect().x-x : 0);
     console.log('Point diff Y', ref.current ? ref.current.getBoundingClientRect().y-y : 0);

     setDiffX(  (ref.current.getBoundingClientRect().x) - x   ) // /zoom?
     setDiffY(  ( (ref.current.getBoundingClientRect().y-35) - (y-35)  )   )




     // setPinchOffsetY(ref.current.getBoundingClientRect().height)
     // setPinchOffsetX(ref.current.getBoundingClientRect().width)

     // ref.current.offsetWidth

   }, [zoom]);





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



   


    <div ref={mainDiv} className="App"  style={{userSelect: 'none', overflow: 'visible'}}>


    <div style= {{zIndex: '1',  pointerEvents: 'none', position: 'absolute', height: '100vh'}}> 
    Scroll X {cursorX} <br/>
    Scroll Y {cursorY} <br/>
    <canvas ref={canvas}></canvas>



    
{/*   Offset X {pinchOffsetX} <br/>
   Offset Y {pinchOffsetY} <br/>*/}
{/*   Zoom {zoom}  <br/>
   {hasMovedCursor
           ? (`Your cursor is at ${x}, ${y}.`)
           : "Move your mouse around."} <br/>




    Diff X {diffX}        
    Diff Y {diffY}    

    <br/>    

   Scroll X {cursorX} <br/>
   Scroll Y {cursorY} <br/>

 */}

{/*   <div style={circleStyle}>
   </div>
*/}




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



        <div   style={{transform:'scale('+zoom+')' +  'translateX('+ diffX +'px)' + 'translateY('+ diffY +'px)' , backgroundColor: "white", height: '100vh'}}>

        <div ref={ref} style={circleStyle}>
        </div>


       



        { moveables > -1 && ( [...Array(moveables)].map((e, i) =>  <span style={{position: 'absolute', top:0, left: 0}}>  <Moveable  socket={socket} mySocket={mySocket} id = {i}  x={moveableInitX} y={moveableInitY}>  </Moveable> </span>) )}

        {/*<div style={{transform:  'translateX('+ pinchOffsetX/2 +'px)' + 'translateY('+ pinchOffsetY/2 +'px)'}}> CENTER </div>*/}
     

        </div>

        </div>

    </InfiniteViewer>
    


  

  



   
  

    </div>
  );

};

export default App;