import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import Draggable from 'react-draggable'


var connectionOptions =  {
            "force new connection" : true,
            "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
            "timeout" : 10000,                  //before connect_error and connect_timeout are emitted.
            "transports" : ["websocket"]
        };

const socket = io("https://finance-test-websockets.herokuapp.com/", connectionOptions); //for running online
// const socket = io("http://localhost:5000", connectionOptions); //for running locally

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

  const [controlledPosition, SetControlledPosition] = useState({x: 400, y: 400})
  const [receivedPosition, SetReceivedPosition] = useState({x: 500, y: 500}) 
  const [dragging, setDragging] = useState(false)
  const [justStoppedDragging, setJustStoppedDragging] = useState(false)
  const [mySocket, setMySocket] = useState("")
  const [dragSocket, setDragSocket] = useState("")



  useEffect(() => {


    console.log("DRAGGING FROM USEFFECT", dragging)

    if (dragging === false) {

      if (dragSocket != mySocket) {

       SetControlledPosition(receivedPosition)

     }
      
    }




  }, [receivedPosition]);

  useEffect(() => {

    socket.on('socketInfo', (data) => {
          // we get settings data and can do something with it
          console.log("SOCKET INFO ",data)
          // setSum(data)

          setMySocket(data)

        });


    socket.emit("read")

    socket.on('new-remote-operations', (data: number) => {
          // we get settings data and can do something with it
          console.log(data)
          setSum(data)

        });



    socket.on('remoteDrag', ({x,y}, receivedDragSocketID) => {

         
      console.log("REMOTE DRAG. SOCKET = ", receivedDragSocketID)

     
        SetReceivedPosition({x,y})

        setDragSocket(receivedDragSocketID)


      
        





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

  function onControlledDrag (e, position) { //handles controlled drag
    setDragging(true)
    setJustStoppedDragging(false)

    let {x, y} = position;
    socket.emit("drag", {x,y})

    socket.on('remoteDrag', ({x,y}) => {

         
      // console.log(data)

      
        SetReceivedPosition({x,y})



        });

    SetControlledPosition({x,y})

    // console.log(position.x)
    
  };

  function handleDragStart () { //handles controlled drag stop

  

    setDragging(true)
    setJustStoppedDragging(false)

    console.log(dragging)
    
  };


  function handleDragStop () { //handles controlled drag stop

    // SetControlledPosition(receivedPosition)

    setDragging(false)
    setJustStoppedDragging(true)

    console.log("stopped")
    
  };

  return (


    <div className="App">

    <Draggable position={controlledPosition} onDrag={onControlledDrag} onStop = {handleDragStop} onStart = {handleDragStart} >

        <div>

         <p> CHAK </p>

       

         </div>

          </Draggable>

          <Draggable>

   <p style={{fontSize: '50px',   textAlign: 'center', fontFamily: "Century Gothic"}}> {sum == -1 ? "Loading" : sum} </p>

   </Draggable>

    <br/> <br/> 
    


    <form onSubmit={handleSubmit}  style={{fontSize: '50px', textAlign: 'center'}}>
      <label>
        
        <input style={{fontSize: '50px'}} type="text" name="name" value={formValue} onChange={handleChange}  autoComplete="off" />
      </label>
      <input style={{fontSize: '50px'}} type="submit" value="OK" />
    </form>



    </div>
  );

};

export default App;