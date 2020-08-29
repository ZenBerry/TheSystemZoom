import React, { Component, useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

import io from "socket.io-client";
const socket = io("http://localhost:5000");

function App() {


  const [response,setResponse] = useState('Loading...')
  const [passwords,setPasswords] = useState([])
  const [myVar,setMyVar] = useState("loading...")

  const [test,setTest] = useState("TEST")

  const [value,setValue] = useState(null)
  const [newData,setNewData] = useState(0)

  const [formValue, setFormValue] = useState("")
  const [webSocketTest, setWebSocketTest] = useState(0)

  socket.emit("read")






  // const getData = () => {
  //   // Get the passwords and store them in state
  //   fetch('/api/passwords')
  //     .then(response => setResponse(response.data) );
  // }


  useEffect(() => {  //getting initial data once
  
      // console.log("ONCE")

      socket.on('new-remote-operations', (data: number) => {
            // we get settings data and can do something with it
            console.log(data)
            setWebSocketTest(data)

          });



      axios.get('/api/passwords')
            .then(res => {
              setValue(res.data)
              setMyVar(res.data)
              setResponse(res.data)

            })
   
      }, [])

  useEffect(() => { 
      if (value != null){
      axios.post('/api/passwords', { title: value, more: newData })
     .then(response => setResponse(response.data) );

      }
   
      }, [value])



  


    function handleSubmit(e) {
      e.preventDefault();


      
      if (Number.isNaN(newData) == true){
        alert("wrong number!")

      } else {
       setValue((prev) => (prev+newData) ) 
       setMyVar((prev) => (prev+newData) )
     }

      setFormValue("") 
      



    }


    function handleChange(e) {

      setNewData(Number(e.target.value)) 
      setFormValue(e.target.value) 
    



      

    }



    return (
      <div className="App"> <h1>

      Cash {myVar} {myVar == response && "✅"} <br/> <br/>



    <form onSubmit={handleSubmit}>
      <label>
        
        <input style={{fontSize: '50px'}} type="text" name="name" value={formValue} onChange={handleChange} autocomplete="off" />
      </label>
      <input style={{fontSize: '50px'}} type="submit" value="OK" />
    </form>


    <br/> <br/>

    {webSocketTest}






    </h1>


       
      </div>
    );

}

export default App;



