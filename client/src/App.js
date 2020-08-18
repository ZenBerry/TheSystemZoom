import React, { Component, useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {


  const [response,setResponse] = useState('Loading...')
  const [passwords,setPasswords] = useState([])
  const [myVar,setMyVar] = useState(42)






  // const getData = () => {
  //   // Get the passwords and store them in state
  //   fetch('/api/passwords')
  //     .then(response => setResponse(response.data) );
  // }


  useEffect(() => { 
  
      console.log("ONCE")

      axios.get('/api/passwords')
            .then(res => {
              setResponse(res.data)
              setMyVar(res.data)
            })
   
      }, [])

  

    function handleClick() {
      setMyVar(prev => prev+1)

      axios.post('/api/passwords', { title: myVar+1 })
          .then(response => setResponse(response.data) );
      
      
      
    }



    return (
      <div className="App">
      Response {response} <br/>
      MyVar {myVar} <br/>

      <button
      onClick = {handleClick}
      >

      Submit

      </button>

       
      </div>
    );

}

export default App;



