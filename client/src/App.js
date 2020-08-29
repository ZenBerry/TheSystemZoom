import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
const socket = io('http://localhost:5000', {transports: ['websocket', 'polling', 'flashsocket']});




function App () {

  const [sum, setSum] = useState(-1)

  const [response,setResponse] = useState('Loading...')
  const [passwords,setPasswords] = useState([])
  const [myVar,setMyVar] = useState("loading...")

  const [test,setTest] = useState("TEST")

  const [value,setValue] = useState(null)
  const [newData,setNewData] = useState(0)

  const [formValue, setFormValue] = useState("")

  useEffect(() => {


    socket.emit("read")

    socket.on('new-remote-operations', (data: number) => {
          // we get settings data and can do something with it
          console.log(data)
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

  return (

    <div className="App">

   <p style={{fontSize: '50px',   textAlign: 'center', fontFamily: "Century Gothic"}}> {sum == -1 ? "Loading" : sum} </p>
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