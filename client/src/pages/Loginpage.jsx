import React, { useContext, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios';
import { UserContext } from '../usercontext';


const Loginpage = () => {
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
     const [redirect,setRedirect]=useState(false);
const {setUser}=useContext(UserContext);

    async function handleLoginSubmit(ev) {
        ev.preventDefault();
        try {
            const response = await axios.post('/login', {
                email,
                password
            });
            setUser(response.data);
            setRedirect(true);
            console.log(response.data);
        } catch (error) {
            console.error('Error during login:', error.response?.data || error.message);
        }
    }
    if(redirect){
        return <Navigate to={'/'}/>
    }
    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form className="max-w-md mx-auto " onSubmit={handleLoginSubmit}>
                {/* <input type="text" placeholder="JohnDoe" value={name} onChange={
                        ev=>setName(ev.target.value)
                    }></input> */}
                    <input type="email" placeholder="abc@email.com" value={email} onChange={
                        ev=>setEmail(ev.target.value)
                    }></input>
                    <input type="password" placeholder="password" value={password} onChange={
                        ev=>setPassword(ev.target.value)
                    } ></input>
                    <button className="primary">Login</button>
                    <div className="text-center py-2 text-gray-500">Don't have an account yet?
                        <Link className="underline text-black" to={'/register'}>Register here</Link></div>
                </form>
            </div>
        </div>
    )
}

export default Loginpage
