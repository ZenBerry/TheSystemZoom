import React, { Component, useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {


  const [response,setResponse] = useState('Loading...')
  const [passwords,setPasswords] = useState([])
  const [myVar,setMyVar] = useState(42)






  const getData = () => {
    // Get the passwords and store them in state
    fetch('/api/passwords')
      .then(res => res.json())
      .then(passwords => setPasswords(passwords) );
  }

  useEffect(() => { 
      getData();

      // Simple POST request with a JSON body using axios
      const article = { title: myVar };
      axios.post('/api/passwords', article)
          .then(response => setResponse(response.data) );
  
   
      }, [myVar])

    function handleClick() {
      setMyVar(prev => prev+1)
    }



    return (
      <div className="App">
      {response}

      <button
      onClick = {handleClick}
      >

      Hey

      </button>

       
      </div>
    );

}

export default App;



