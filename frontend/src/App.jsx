import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch("http://localhost:3000/")
      .then((res) => res.text())
      .then((data) => setMessage(data))
  })

  console.log(message)

  return (
    <>
      <div className="App">
        <h1>{message}</h1>
      </div>
    </>
  )
}

export default App
