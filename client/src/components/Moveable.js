import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import Draggable from 'react-draggable'

function Moveable(props) {

	console.log('props.myID', props.id) 

	// console.log("mySocket FROM COMP", props.mySocket)

    const [controlledPosition, SetControlledPosition] = useState({ x: 1, y: 1 })
    const [receivedPosition, SetReceivedPosition] = useState({ x: 1, y: 1 })
    const [dragging, setDragging] = useState(false)
    const [justStoppedDragging, setJustStoppedDragging] = useState(false)
    const [dragSocket, setDragSocket] = useState("")

    const socket = props.socket

    useEffect(() => {




        // console.log("DRAGGING FROM USEFFECT", dragging)

        if (dragging === false) {

            if (dragSocket != props.mySocket) {

            
                SetControlledPosition(receivedPosition)

            	


            }

        }




    }, [receivedPosition]);

    useEffect(() => {






        socket.on('remoteDrag', ({ x, y }, receivedDragSocketID, receivedMoveableId) => {

            // console.log("REMOTE DRAG. SOCKET = ", receivedDragSocketID)

            console.log("receivedMoveableId" , receivedMoveableId)
          

            setDragSocket(receivedDragSocketID)

            if (receivedDragSocketID != props.mySocket) {

            	if (receivedMoveableId == props.id) {

                SetReceivedPosition({ x, y })
            	}


            }

        });

    }, []);


    function onControlledDrag (e, position) { //handles controlled drag
      setDragging(true)
      setJustStoppedDragging(false)
      
      let {x, y} = position;
      SetControlledPosition({x,y})

      

      	socket.emit("drag", {x,y}, props.id)
    
      

      // socket.on('remoteDrag', ({x,y}) => {

           
      //   // console.log(data)

        
      //     SetReceivedPosition({x,y})



      //     });


      // console.log(position.x)
      
    };

    function handleDragStart () { //handles controlled drag stop

    

      setDragging(true)
      setJustStoppedDragging(false)

      // console.log(dragging)
      
    };


    function handleDragStop () { //handles controlled drag stop

      // SetControlledPosition(receivedPosition)

      setDragging(false)
      setJustStoppedDragging(true)

      // console.log("stopped")
      
    };

    return (

    	<div>

    	<Draggable  position={controlledPosition} onDrag={onControlledDrag} onStop = {handleDragStop} onStart = {handleDragStart} >

    	    <div>

    	     <p> Dolya </p>

    	   

    	     </div>

    	      </Draggable>

         </div>

    	)

}

export default Moveable;