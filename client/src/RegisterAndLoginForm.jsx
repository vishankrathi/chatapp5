import { useState,useContext } from "react";
import axios from "axios";
import {UserContext} from "./UserContext";
export default function  RegisterAndLoginForm(){
const [username,setUsername]=useState('');
const [password,setPassword]=useState('');
const[isLoginOrRegister,setIsLoginOrRegister]=useState('Login')
const {setUsername:setLoggedInUsername,setId}=useContext(UserContext);
async function handleSubmit(ev){
    ev.preventDefault();
    try{
        const url= isLoginOrRegister ==='register'?'register':'Login';
        const response = await axios.post('/register',{username,password});
        const data=response.data;
    setLoggedInUsername(username);
    setId(data.id);

    }catch (error) {
        console.error('Registration failed:', error);
        // Handle error appropriately (e.g., show error message to the user)
      }
    
}
return (
<div className="bg-blue-50 h-screen flex items-center">
        <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
         <input value={username}
            onChange={ev=>setUsername(ev.target.value)}
            type="text" placeholder="username"
            className="block w-full rouded-sm p-2 mb-2 border"/>
                <input value={password}
            onChange={ev=>setPassword(ev.target.value)}
            type="password" placeholder="password"
            className="block w-full rouded-sm p-2 mb-2 border"/>
            <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
                {isLoginOrRegister ==='register'?'Register':'Login'}
                </button>
            <div className="text-center mt-4">
            {isLoginOrRegister ==='register'&&(
                <div>  Already a member?
                <button onClick={()=>setIsLoginOrRegister('Login')}>
                    Login here
                </button>
                </div>
            )}
            {isLoginOrRegister ==='Login'&&(
                <div>
                    Dont  have an account?
                        <button onClick={()=>setIsLoginOrRegister('register')}>
                            register
                        </button>
                    
                </div>
            )}
            </div>
        </form>
</div>
)
}