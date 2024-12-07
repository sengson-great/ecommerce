import axios,{AxiosError} from "axios";
import { SyntheticEvent, useState } from "react"
import { userErrors } from "../../errors";
import {useCookies} from 'react-cookie'
import { useNavigate } from "react-router-dom";

export const Auth=()=>{
    return(
        <div>
            <Register/>
            <Login/>
        </div>
    )  
}

const Register = () => {
    const [username,setUsername] =useState<string>("");
    const [password,setPassword] = useState<string>("");

    interface ErrorResponse {
        type: string; // Adjust this type if `type` is something other than a string
    }

    const handleRegister = async(event: SyntheticEvent) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:3001/user/register',{username:username,password:password});
            alert("User registered successfully");
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>;
            if(axiosError.response?.data?.type=== userErrors.UserAlreadyExists){
                alert("User already exists");
            }else{
                alert("An error occurred");
            }
        }
    }
  return (
    <div className="d-flex justify-content-center">
        <form action="" onSubmit={handleRegister}>
            <label htmlFor="username">Username:</label><br/>
            <input type="text" id="username" name="username" value={username} required onChange={(e)=>setUsername(e.target.value)}/><br/>
            <label htmlFor="password">Password:</label><br/>
            <input type="password" id="password" name="password" value={password} required onChange={(e)=>setPassword(e.target.value)}/><br/>
            <input type="submit" value="Register"/>
        </form>
    </div>
  )
}
const Login=()=>{
    const [username,setUsername] =useState("");
    const [password,setPassword] = useState("");
    const [_,setCookies]=useCookies(["access_token"]);
    const navigate=useNavigate();

    interface ErrorResponse {
        type: string; // Adjust this type if `type` is something other than a string
    }
    const handleLogin = async(event: SyntheticEvent) => {
        event.preventDefault();
        try {
            const result=await axios.post('http://localhost:3001/user/login',{username:username,password:password});
            setCookies("access_token",result.data.token);
            localStorage.setItem("userId",result.data.userId);
            navigate("/");
        } catch (error) {
            let errorMessage:string='';
            const axiosError = error as AxiosError<ErrorResponse>;
            switch (axiosError.response?.data?.type){
                case userErrors.UserAlreadyExists:
                    errorMessage="User already exists";
                    break;
                case userErrors.WRONG_CREDENTIAL:
                    errorMessage="Wrong username or password";
                    break;
                default:
                    errorMessage="An error occurred";
            }
            alert(errorMessage);
        }
    }
    return(
        <div className="d-flex justify-content-center mt-5">
        <form action="" onSubmit={handleLogin}>
            <label htmlFor="username">Username:</label><br/>
            <input type="text" name="username" value={username} required onChange={(e)=>setUsername(e.target.value)}/><br/>
            <label htmlFor="password">Password:</label><br/>
            <input type="password" name="password" value={password} required onChange={(e)=>setPassword(e.target.value)}/><br/>
            <input type="submit" value="Login"/>
        </form>
        </div>
    )
}

export default Auth