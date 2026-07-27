import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {

const[email,setEmail]=useState("");
const [password, setPassword] = useState("");

const handleLogin=(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
  

  if(!email || !password){
    alert("Please fill all the fields");
    return;
  }

  console.log(email);
  console.log(password);

  setEmail("");
  setPassword("");

}


  return (
    <div>
      <h1>Welcome Back</h1>
      <form 
      onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input
         id="email" 
         type="email" 
         value={email}
         placeholder="Enter your email"
         onChange={(e)=>setEmail(e.target.value)} />

        <label htmlFor="password">Password</label>
        <input
         id="password"
          type="password"
          value={password}
          placeholder="Enter your password"
          onChange={(e)=>setPassword(e.target.value)} />

        <button type="submit">Login</button>

        <p>Don't have an account?
           <Link to="/signup">
        Sign Up
        </Link> </p>

       
      </form>
    </div>
  );
}
export default Login;
