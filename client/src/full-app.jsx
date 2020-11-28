 // Imports

		import React, { useState, useRef, useEffect } from "react";
		import io from "socket.io-client";
		import Draggable from 'react-draggable'
		import Moveable from './components/Moveable' 
		import useMousePosition from './components/useMousePosition' 
		import InfiniteViewer from "react-infinite-viewer"; //infinite scroll
		import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'; //default scroll lock

 // Connect to the websocket
		var connectionOptions =  {
		            "force new connection" : true,
		            "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
		            "timeout" : 10000,                  //before connect_error and connect_timeout are emitted.
		            "transports" : ["websocket"]
		        };

		const socket = io("https://finance-test-websockets.herokuapp.com/", connectionOptions); //for running online
		// const socket = io("http://localhost:5000", connectionOptions); //for running locally

 // The var to create a canvas (it's used to draw a line)

	 	 let ctx = null; 	

function App () {

 // Zoom and pan vars, forAndy: those are related to the problem

		 const [zoom, setZoom] = useState(1) //initial scale

		 const [isZoomingIn, setIsZoomingIn] = useState(null)

		 const { x, y } = useMousePosition(); //get mouse position 
		 const hasMovedCursor = typeof x === "number" && typeof y === "number"; 

		 const [scrollX, setScrollX] = useState(0) //pan
		 const [scrollY, setScrollY] = useState(0)

		 const [diffX, setDiffX] = useState(0) //important! Diff between the mouse and the dot
		 const [diffY, setDiffY] = useState(0) //important! Diff between the mouse and the dot

		 const circle = useRef();
		 const mainDiv = useRef();
		 const whiteBox = useRef();	

		 const [circleStyle, setCircleStyle] = useState({ 
	      position:'absolute',
	      top: (y + scrollY),
	      left: (x + scrollX),
	      padding:0,
	      margin:0,
	      display:"inline-block",
	      backgroundColor: 'black',
	      borderRadius: "50%",
	      width:0.5,
	      height:0.5,
	     }) //the point

 // Drag vars 

	  const [mySocket, setMySocket] = useState("")
	  const [dragSocket, setDragSocket] = useState("")

	  const [moveableInitX, setMoveableInitX] = useState(0)
	  const [moveableInitY, setMoveableInitY] = useState(0)

	  const [moveables, setMoveables] = useState(-1)

	  const [positions, setPositions] = useState([])

 // Presumably obsolete or irrelevant vars
 	  const [sum, setSum] = useState(-1)

 	  const [response,setResponse] = useState('Loading...')
 	  const [passwords,setPasswords] = useState([])
 	  const [myVar,setMyVar] = useState("loading...")

 	  const [test,setTest] = useState("TEST")

 	  const [value,setValue] = useState(null)
 	  const [newData,setNewData] = useState(0)

 	  const [pinchScroll, setPinchScroll] = useState(false) //determine whether we are getting a scroll from a pinch gesture

 	  const [pinchOffsetX, setPinchOffsetX] = useState(0)
 	  const [pinchOffsetY, setPinchOffsetY] = useState(0)

 	  const [formValue, setFormValue] = useState("")

 // Canvas (forAndy: it's used to draw a line)

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

     	   setCircleStyle({ 
     	   position:'absolute',
     	   top: (y), //was +scrollY
     	   left: (x),//was +scrollX
     	   padding:0,
     	   margin:0,
     	   backgroundColor: 'black',
     	   borderRadius: "0",
     	   width:0,
     	   height:0,
     		 })




       }, [x,y, zoom]); //update the point relative to the cursor. 11 NOV IMPORTANT: Here's the problem: it doesn't update!



 

     useEffect(() => {
      // forAndy: the point	



      

      

       // dynamically assign the width and height to canvas
       // THE CANVAS USED FOR A LINE (!)

       const canvasEle = canvas.current;
       canvasEle.width = mainDiv.current.getBoundingClientRect().width; //or probably window.width? (I don't remember the exact syntax)
       canvasEle.height = mainDiv.current.getBoundingClientRect().height;
     
       // get context of the canvas
       ctx = canvasEle.getContext("2d");




     }, [x,y, zoom, scrollX, scrollY]);

     useEffect(() => { 

       // forAndy: drawing a line between the cursor and the point: 
       drawLine({ x: x, y: y, x1: circle.current.getBoundingClientRect().x, y1: circle.current.getBoundingClientRect().y });
       // (circle.current.getBoundingClientRect().y)
       // (circle.current.getBoundingClientRect().x) //IMPORTANT, POINT COORDINATES
       // console.log("Diff from DrawLine: ", diffY)

     }, [zoom,x,y, scrollX, scrollY]);

 // forAndy: setting the difference between our point and the cursor

	 useEffect(() => {  

	     setDiffX(  circle.current ? circle.current.getBoundingClientRect().x-x : 0   ) 
	     setDiffY(  circle.current ? circle.current.getBoundingClientRect().y-y : 0   )
	     // console.log('Point diff X', circle.current ? circle.current.getBoundingClientRect().x-x : 0);
	     // console.log('Point diff Y', circle.current ? circle.current.getBoundingClientRect().y-y : 0);



	   }, [zoom, scrollX, scrollY]); //11 NOV IMPORTANT: it works smoother if we add x and y dependencies

 // forAndy: the code below is not related to the problem 


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

    {/*Info floating div*/} 

	    <div style= {{zIndex: '2',  pointerEvents: 'none', color:'white', position: 'absolute', height: '100vh'}}> 
	    	It works! 11 Nov <br/>
	        Zoom {zoom}  <br/>
	        {hasMovedCursor ? (`Your cursor is at ${x}, ${y}.`) : "Move your mouse around."}  <br/>
	        Diff X {diffX}   <br/>     
	        Diff Y {diffY}   <br/>  	
	        Scroll X {scrollX} <br/>
	        Scroll Y {scrollY} <br/>

	        The Point x {x + scrollX} <br/> 
	        The Point y {y + scrollY} <br/>

	        {/*Our point on a floating div for testing*/}

			{/*<div ref={circle} style={circleStyle}> 
	        </div>*/}

	     </div>   

	{/*Canvas floating div (it's used to draw a line)*/} 

	    <div style= {{zIndex: '1',  pointerEvents: 'none', position: 'absolute', height: '100vh'}}> 

	    <canvas ref={canvas}></canvas>

	  	</div>

	{/*The actual content div*/} 
 
	    <InfiniteViewer
	     
		        className="viewer"
		        margin={1}
		        threshold={1}
		        rangeX={[100000000, 100000000]}
		        rangeY={[100000000, 100000000]}
		        pinchThreshold = {1}
		        onScroll = {e => {

		        {/*console.log("Scroll event",e)*/}

		                  setScrollX(e.scrollLeft)
		                  setScrollY(e.scrollTop)

		        }}

		        onPinch={e => {

		          if (e.zoom < 1  ) {
		           {/* console.log('zooming out');*/}

		            setIsZoomingIn(false)

		          } else { 

		            {/*console.log('zooming in') ;*/}

		            setIsZoomingIn(true) 
		     
		          }

		         setZoom( prev => prev* e.zoom*e.scale )  

		        }}

	        >




	        <div  style={{height: '100vh'}} >

	        	<div ref = {whiteBox} style={{transform:'scale('+zoom+')' +  'translateX('+ diffX +'px)' + 'translateY('+ diffY +'px)' }}>

	        			{/*forAndy: the point*/}

	        			<div ref={circle} style={circleStyle}> 
	        	        </div>


              <img src={'https://m.media-amazon.com/images/M/MV5BNzI4ODdkMzMtMjAxZi00OThlLTkxNDMtYmE2MDAyOTgyYWE0XkEyXkFqcGdeQXVyODU5ODY0ODc@._V1_SX400_CR0,0,400,302_AL_.jpg'} />
                 

	        		{/*forAndy: commented out moveable content*/} 

                {/*{ moveables > -1 && ( [...Array(moveables)].map((e, i) =>  
	        			
	        			<span style={{position: 'absolute', top:0, left: 0}}> 

	        				<Moveable  
	        				socket={socket} 
	        				mySocket={mySocket} 
	        				id = {i}  
	        				x={moveableInitX} 
	        				y={moveableInitY}> 
	        				</Moveable>

	    				</span>) 

	        		)}*/}

	        	</div>

	        </div>

	    </InfiniteViewer>


   
    </div>
  );

};

export default App;