import { useState } from "react";

function Signup() {

const[email,setEmail]=useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [name, setName] = useState("");

const handleSignup=(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
  

  if (!name || !email || !password || !confirmPassword) {
  alert("Please fill all the fields");
  return;
}

if (password !== confirmPassword) {
  alert("Passwords do not match");
  return;
}

  console.log(email);
  console.log(password);
  console.log(name);
console.log(confirmPassword);

//   setEmail("");
//   setPassword("");

}


  return (
    <div>
      <h1>Create Account</h1>
      <form 
      onSubmit={handleSignup}>

<label htmlFor="name">Name</label>
        <input
         id="name" 
         type="text" 
         value={name}
         placeholder="Enter your Username"
         onChange={(e)=>setName(e.target.value)} />


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

          <label htmlFor=" confirmPassword"> Confirm Password</label>
        <input
         id="confirmPassword"
          type="password"
          value={confirmPassword}
          placeholder="Enter your password"
          onChange={(e)=>setConfirmPassword(e.target.value)} />

        <button type="submit">Sign Up</button>

        <p>Already have an account? Login</p>
      </form>
    </div>
  );
}
export default Signup;
