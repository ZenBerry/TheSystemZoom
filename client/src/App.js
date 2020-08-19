import React, { Component, useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {


  const [response,setResponse] = useState('Loading...')
  const [passwords,setPasswords] = useState([])
  const [myVar,setMyVar] = useState(42)

  const [test,setTest] = useState("TEST")

  const [value,setValue] = useState(null)
  const [newData,setNewData] = useState(0)






  // const getData = () => {
  //   // Get the passwords and store them in state
  //   fetch('/api/passwords')
  //     .then(response => setResponse(response.data) );
  // }


  useEffect(() => { 
  
      // console.log("ONCE")

      axios.get('/api/passwords')
            .then(res => {
              setValue(res.data)

            })
   
      }, [])

  useEffect(() => { 
      if (value != null){
      axios.post('/api/passwords', { title: value })
     .then(response => setResponse(response.data) );

      }
   
      }, [value])



  

    function handleClick() {
      // setMyVar(5)

 
      
      
      
    }

    function handleSubmit(e) {
      e.preventDefault();


      
      if (Number.isNaN(newData) == true){
        alert("wrong number!")

      } else {
       setValue((prev) => (prev+newData) ) 
     }
      



    }


    function handleChange(e) {

      setNewData(Number(e.target.value)) 
    



      

    }



    return (
      <div className="App">
      Cash {response} <br/>

    <form onSubmit={handleSubmit}>
      <label>
        
        <input type="text" name="name" onChange={handleChange} autocomplete="off" />
      </label>
      <input type="submit" value="OK" />
    </form>


    <br/> <br/>









       
      </div>
    );

}

export default App;



