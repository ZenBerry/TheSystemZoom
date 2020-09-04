import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import Draggable from 'react-draggable'

import TextareaAutosize from 'react-textarea-autosize';

function Moveable(props) {

	console.log('props.myID', props.id) 

	// console.log("mySocket FROM COMP", props.mySocket)

    const [controlledPosition, setControlledPosition] = useState({ x: props.x, y: props.y })
    const [receivedPosition, setReceivedPosition] = useState({ x: props.x, y: props.y })
    const [dragging, setDragging] = useState(false)
    const [justStoppedDragging, setJustStoppedDragging] = useState(false)
    const [dragSocket, setDragSocket] = useState("")
    const [loaded, setLoaded] = useState(false)
    const [value, setValue] = useState("Hello")

    const socket = props.socket

    useEffect(() => {




        // console.log("DRAGGING FROM USEFFECT", dragging)

        if (dragging === false) {

            if (dragSocket != props.mySocket) {

            
                setControlledPosition(receivedPosition)

                console.log("receivedPosition!", receivedPosition)

            	


            }

        }




    }, [receivedPosition]);

    useEffect(() => {

      socket.on('TEST', (positions) => {

        console.log('POSITIONS', positions)

        if (positions.length > 0) {

        console.log("NEW LOG! POSITIONS FROM MOVEABLE", Object.values(positions)[props.id]) //Object.keys(positions)[props.id]


       let { x, y } = Object.values(positions)[props.id]

        setControlledPosition({ x, y })
        setReceivedPosition({ x, y })

        setLoaded(true)

        }



        


  

      });






        socket.on('remoteDrag', ({ x, y }, receivedDragSocketID, receivedMoveableId) => {

            // console.log("REMOTE DRAG. SOCKET = ", receivedDragSocketID)

            console.log("receivedMoveableId" , receivedMoveableId)
          

            setDragSocket(receivedDragSocketID)

            if (receivedDragSocketID != props.mySocket) {

            	if (receivedMoveableId == props.id) {

                setReceivedPosition({ x, y })
            	}


            }

        });

    }, []);


    function onControlledDrag (e, position) { //handles controlled drag
      setDragging(true)
      setJustStoppedDragging(false)
      
      let {x, y} = position;
      setControlledPosition({x,y})

      

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

     function handleChange(event){

      const textareaLineHeight = 10

            const previousRows = event.target.rows;
              event.target.rows = 1; // reset number of rows in textarea 
            const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);
            

            

            

              event.target.rows = currentRows

              setValue(event.value)







     }

    return (

    	<div>

    	<Draggable  position={controlledPosition} onDrag={onControlledDrag} onStop = {handleDragStop} onStart = {handleDragStart} >

    	    <div>

          {/*<input autoFocus style={{border:'none'}} type="text" name="name"  autoComplete="off"  />*/}

{/*          <AutosizeInput
              name="form-field-name"
              value="Hello"
              style={{border:'none'}}

          />*/}

          <textarea


           rows="1"
          
           
      
           style={{fontSize:'24px', border: 'none', overflow:'hidden', resize: 'none', outline:"0px", fontFamily: "Arial"}}
           value={value} 
           onChange={(event) => {handleChange(event)}} 


           /> 



    	     <p> Dolya {props.id} </p>

    	   

    	     </div>

    	      </Draggable>

         </div>

    	)

}

export default Moveable;