import React, { Component, useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {


  const [response,setResponse] = useState('Loading...')
  const [passwords,setPasswords] = useState([])
  const [myVar,setMyVar] = useState("loading...")

  const [test,setTest] = useState("TEST")

  const [value,setValue] = useState(null)
  const [newData,setNewData] = useState(0)

  const [formValue, setFormValue] = useState("")






  // const getData = () => {
  //   // Get the passwords and store them in state
  //   fetch('/api/passwords')
  //     .then(response => setResponse(response.data) );
  // }


  useEffect(() => {  //getting initial data once
  
      // console.log("ONCE")

      axios.get('/api/passwords')
            .then(res => {
              setValue(res.data)
              setMyVar(res.data)
              setResponse(res.data)

            })
   
      }, [])

  useEffect(() => { 
      if (value != null){
      axios.post('/api/passwords', { title: value, more: "Wee!" })
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
      <div className="App">

      Cash {myVar} {myVar == response && "✅"} <br/> <br/>



    <form onSubmit={handleSubmit}>
      <label>
        
        <input type="text" name="name" value={formValue} onChange={handleChange} autocomplete="off" />
      </label>
      <input type="submit" value="OK" />
    </form>


    <br/> <br/>









       
      </div>
    );

}

export default App;



