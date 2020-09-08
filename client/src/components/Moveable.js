//TypeError: Cannot read property 'toString' of undefined
//Moveable
//src/components/Moveable.js:319
//  316 | <textarea
//  317 | 
//  318 |   
//> 319 |  rows={stateRows.toString()}


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
    const [value, setValue] = useState("")
    const [stateLargestLine, setStateLargestLine] = useState('100px')
    const [stateRows, setStateRows] = useState(1)

    const socket = props.socket

    var i = 0

    useEffect(() => {

      socket.on("remote-typing",  (value, atWhichSocket, id, largestLine, rows) => {

        if (atWhichSocket != props.mySocket) {
          if (id == props.id) {
            setStateLargestLine((largestLine+20).toString()+"px")
            setStateRows(rows)
            setValue(value)
          }
        }


      })




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

       setStateRows(Object.values(positions)[props.id].rows)
       setStateLargestLine(Object.values(positions)[props.id].largestLine)
       setValue(Object.values(positions)[props.id].value)


   

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

    
    var largestLineNum = 0
    var i2=0

     function handleChange(event){



      var largestLine = 0

      const textareaLineHeight = 24

            const previousRows = event.target.rows;
              event.target.rows = 1; // reset number of rows in textarea 
            const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);
            

            
            var countNewLines = (event.target.value.match(/\n/g) || []).length;
             
              // event.target.rows = currentRows

              event.target.rows = countNewLines+1
              setStateRows(countNewLines+1)

              console.log("CHECK THIS FN VALUE",event.target.value)

              // if ( event.target.rows > event.target.value.split('\n')) {
              //   event.target.rows = event.target.value.split('\n')
              // }
              //setStateRows(currentRows)

              function detectLargestLine(){

              

              for (i=0; i < event.target.value.split('\n').length; i++) {

                var text = document.createElement("span"); 
                           document.body.appendChild(text); 


                           text.style.fontSize = '24px'
                           text.style.position = 'absolute';
                           text.style.visibility = 'hidden';
                           text.style.height = 'auto';
                           text.style.width = 'auto';
                           text.style.whitespace = 'nowrap'; /* Thanks to Herb Caudill comment */
                 
                     
                           text.innerHTML = event.target.value.split('\n')[i];

                           var width = Math.ceil(text.clientWidth); 

                           

                           // text.innerHTML = '';

                

                if (width > largestLine) {
                    largestLine = width
                    
                    largestLineNum = i

                    



                console.log("LARGEST LINE", largestLine, "NUMBER", largestLineNum)
                console.log("WIDTH", largestLine)

              }

              setStateLargestLine((largestLine+20).toString()+"px")
              socket.emit("typing", event.target.value, props.mySocket, props.id, largestLine, countNewLines+1) 

              }

            }

              detectLargestLine()


             





              // for (i = 0; i < event.target.value.length; i++) {


              //   // if (event.target.value[i] === '\n' || event.target.value[i] === '\r') {
              //   //   console.log('found enter key')
              //   // };
              // };

             

              setValue(event.value)




              

     }

    return (

      <div>

      <Draggable defaultPosition={receivedPosition}  position={controlledPosition} onDrag={onControlledDrag} onStop = {handleDragStop} onStart = {handleDragStart} >

          <div>

          {/*<input autoFocus style={{border:'none'}} type="text" name="name"  autoComplete="off"  />*/}

{/*          <AutosizeInput
              name="form-field-name"
              value="Hello"
              style={{border:'none'}}

          />*/}

        

          <textarea


           rows={stateRows.toString()}

           autoFocus
          
           
      
           style={{fontSize:'24px', backgroundColor: 'rgba(0, 0, 0, 0)',  borderColor: 'rgba(0, 0, 0, 0)', border: '0', width: stateLargestLine, overflow:'hidden', resize: 'none', outline:"0px", fontFamily: "Arial"}}
           value={value} 
           onChange={(event) => {handleChange(event)}} 
           onInput={(event) => {handleChange(event)}}


           /> 

          {/*{stateRows}*/}

          {/* <p> Dolya {props.id} </p>*/}

         

           </div>

            </Draggable>

         </div>

      )

}

export default Moveable;