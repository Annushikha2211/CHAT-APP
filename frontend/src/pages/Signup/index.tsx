import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import axios
 from "axios";
function Signup() {

const[email,setEmail]=useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [name, setName] = useState("");

const handleSignup= async (e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();

 try{

    console.log("EMAIL SENT:", email);
console.log("PASSWORD SENT:", password);

    const response=await axios.post(
       "http://localhost:5000/api/auth/signup",
       {
        name,
        email,
        password,
       });
      
       console.log(response.data)

        alert("Signup successful");

} catch (error: any) {
  console.log(error);

  alert(error.response?.data?.message || "Signup failed");
}
};

  if (!name || !email || !password || !confirmPassword) {
  alert("Please fill all the fields");
  return;
}

if (password !== confirmPassword) {
  alert("Passwords do not match");
  return;

}

  return (
    <AuthLayout>
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

          <label htmlFor="confirmPassword"> Confirm Password</label>
        <input
         id="confirmPassword"
          type="password"
          value={confirmPassword}
          placeholder="Enter your password"
          onChange={(e)=>setConfirmPassword(e.target.value)} />

        <button type="submit">Sign Up</button>

        <p>Already have an account? 
          
        <Link to="/login">
        Login
        </Link>
        </p>

      </form>
    </div>
    </AuthLayout>
  );
}
export default Signup;
