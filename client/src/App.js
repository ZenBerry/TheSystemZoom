// import React, { useState, useRef, useEffect } from "react";
// import InfiniteViewer from "react-infinite-viewer";

// function App () {
//   return (

//     <div> 




    
//    <InfiniteViewer
//        className="viewer"
//        margin={1}
//        threshold={1}
//        rangeX={[1000, 1000]}
//        rangeY={[1000, 1000]}
//        onScroll={e => {
//            console.log(e);
//        }}
//        >
//        <div style={{height: '100vh'}} className="viewport">
//        Paul and me




//        //insert moveable here




//        </div>
//    </InfiniteViewer>











//     </div>

//     )

//   };

//   export default App;

//everything below has to be uncommented haha

import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import Draggable from 'react-draggable'
import Moveable from './components/Moveable' 

import InfiniteViewer from "react-infinite-viewer"; //infinite scroll

import panzoom from "panzoom"

import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'; //default scroll lock

import { MapInteractionCSS } from 'react-map-interaction'; //zoom
import { MapInteraction } from 'react-map-interaction'; //zoom

var connectionOptions =  {
            "force new connection" : true,
            "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
            "timeout" : 10000,                  //before connect_error and connect_timeout are emitted.
            "transports" : ["websocket"]
        };

// const socket = io("https://finance-test-websockets.herokuapp.com/", connectionOptions); //for running online
const socket = io("http://localhost:5000", connectionOptions); //for running locally

// var io = io_init('http://localhost:5000', {transports: ['websocket', 'polling', 'flashsocket']});


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


 const [zoom, setZoom] = useState(1)

 const [zoomValue, setZoomValue] = useState({
         scale: 1,
         translation: { x: 500, y: 500 }
       })

 const [pinchScroll, setPinchScroll] = useState(false)

 const [pinchOffsetX, setPinchOffsetX] = useState(0)
 const [pinchOffsetY, setPinchOffsetY] = useState(0)

 const [isZoomingIn, setIsZoomingIn] = useState(null)

 const [cursorX, setCursorX] = useState(0)
 const [cursorY, setCursorY] = useState(0)

 const ref = useRef(null);

 useEffect(() => {
     console.log('width', ref.current ? ref.current.getBoundingClientRect().width/2 : 0);
     console.log('height', ref.current ? ref.current.getBoundingClientRect().height/2 : 0);

     setPinchOffsetY(ref.current.offsetWidth)
     setPinchOffsetX(ref.current.offsetHeight)

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
     

     // if(document.selection && document.selection.empty) { //DOUBLE CLICK SELECTION PREVENTION 0
     //     document.selection.empty();
     // } else if(window.getSelection) {
     //     var sel = window.getSelection();
     //     sel.removeAllRanges();
     // } 
  }


  // console.log("MY SOCKET FROM APP",mySocket)

  



  document.ondblclick = (e) => handleMoveableAddition(e);


//   var element = document.querySelector('#root')
//   panzoom(element, {
//   beforeMouseDown: function(e) {
//     // allow mouse-down panning only if altKey is down. Otherwise - ignore
//     var shouldIgnore = !e.shiftKey;
//     return shouldIgnore;
//   },
//   beforeWheel: function(e) {
//       // allow wheel-zoom only if altKey is down. Otherwise - ignore
//       var shouldIgnore = !e.altKey;
//       return shouldIgnore;
//     },
//     onTouch: function(e) {
//       // `e` - is current touch event.

//       return false; // tells the library to not preventDefault.
//     }



// })




  return (



   


    <div  className="App"  style={{userSelect: 'none', overflow: 'visible'}}>

    <div style= {{zIndex: '1', position: 'absolute'}}>

    
   Offset X {pinchOffsetX} <br/>
   Offset Y {pinchOffsetY} <br/>
   Zoom {zoom}  <br/>
   Cursor X {cursorX}  <br/>
   Cursor Y {cursorY}  <br/>

   </div>

 
    <InfiniteViewer
     
        className="viewer"
        margin={1}
        threshold={1}
        rangeX={[100000000, 100000000]}
        rangeY={[100000000, 100000000]}
        usePinch = {true}
        pinchThreshold = {1}
 
        onScroll = {e => {

        console.log("Scroll event",e)




    {/*    setPinchOffsetX(e.scrollLeft)
        setPinchOffsetY(e.scrollTop)*/}



        }}

        onPinch={e => {

          setCursorX(e.inputEvent.clientX)
          setCursorY(e.inputEvent.clientY)

        {/*  console.log("PINCH E", e.inputEvent.clientX)*/}

          if (e.zoom < 1  ) {
            console.log('zooming out');

            setIsZoomingIn(false)

{/*            if (zoom > 0.1) {

              console.log('zoom is > 0.1')
              setPinchOffsetX(prev => prev-10)
              setPinchOffsetY(prev => prev-10)  



            }*/}




         {/*   setPinchOffsetX(prev => prev-10)
            setPinchOffsetY(prev => prev-10)*/}




          } else { 

            console.log('zooming in') ;

{/*            if (zoom > 0.1) {

              console.log('zoom is > 0.1')
              setPinchOffsetX(prev => prev+10)
              setPinchOffsetY(prev => prev+10)  

              

            }*/}


{/*            if (e.inputEvent.clientX > pinchOffsetX ) {

            setPinchOffsetX(prev => prev+10)
              
            } 

            if (e.inputEvent.clientY > pinchOffsetY ) {

            setPinchOffsetY(prev => prev+10)
              
            } */}


            setIsZoomingIn(true) 
     

          }


    
         setZoom((prev) => (prev* e.zoom*e.scale) 





          )  
         setZoomValue({
         scale: zoomValue.scale*e.zoom*e.scale,
         translation: { x: 0, y: 0 }
       })

         {/*console.log("PINCHING!", e.inputEvent.clientX)*/}
{/*
         setPinchOffsetX(e.inputEvent.clientX)
         setPinchOffsetY(e.inputEvent.clientY)*/}



        }}

        >




        <div  style={{height: '100vh'}} >

        <div  ref={ref} style={{transform:'scale('+zoom+')' + 'translateX('+ (cursorX- pinchOffsetX/2) +'px)' + 'translateY('+ (cursorY - pinchOffsetY/2) +'px)' , backgroundColor: "white", height: '100vh'}}>

        {/*PAUSED HERE 14 SEP*/}


        { moveables > -1 && ( [...Array(moveables)].map((e, i) =>  <span style={{position: 'absolute', top:0, left: 0}}>  <Moveable  socket={socket} mySocket={mySocket} id = {i}  x={moveableInitX} y={moveableInitY}>  </Moveable> </span>) )}


     

        </div>

        </div>

    </InfiniteViewer>
    


  

  {/* {  moveables > -1 && ( [...Array(moveables)].map((e, i) =>  <span style={{position: 'absolute', top:0, left: 0}}>  <Moveable  socket={socket} mySocket={mySocket} id = {i}  x={moveableInitX} y={moveableInitY}>  </Moveable> </span>) )}*/}



   
  

    </div>
  );

};

export default App;