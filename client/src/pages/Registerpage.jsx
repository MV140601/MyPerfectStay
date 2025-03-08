import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';


const Registerpage = () => {
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  async function registerUser(e) {
    console.log(name,email,password);
    e.preventDefault(); // Correct the typo here
  await  axios.post('/register',{
      name,
      email,
      password
    })
      .then(response => {
        console.log(response.data); // Log the response data
      })
      .catch(error => {
        console.error('Error:', error); // Handle errors
      });
  }
  

  return (
    <div className="mt-4 grow flex items-center justify-around">
        <div className="mb-64">
            <h1 className="text-4xl text-center mb-4">Register</h1>
            <form className="max-w-md mx-auto " onSubmit={registerUser}>
            <input type="text" placeholder="your name here" value={name} onChange={ev=>setName(ev.target.value)}></input>
                <input type="email" placeholder="abc@email.com" value={email} onChange={ev=>setEmail(ev.target.value)}></input>
                <input type="password" placeholder="password" value={password} onChange={ev=>setPassword(ev.target.value)}></input>
                <button type='submit' className="primary">Register</button>
                <div className="text-center py-2 text-gray-500">Already a member?
                    <Link className="underline text-black" to={'/login'}>Login</Link></div>
            </form>
        </div>
    </div>
)
}

export default Registerpage
