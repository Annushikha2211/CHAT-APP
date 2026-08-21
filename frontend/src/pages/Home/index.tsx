import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUsers } from "../../service/userService";

 
function Home() {

const navigate = useNavigate();
const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };

    fetchUsers();
  }, []);
  
const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login");
}; 

return (
    
        <div>
        <h1>Welcome to chat App</h1>
        <p>select a user to start chatting</p>

        <div>
  {users.map((user: any) => (
    <div  key={user._id}
  onClick={() => navigate(`/chat/${user._id}`)}
>
  {user.name}
    </div>
  ))}
</div>
    
     <button onClick={handleLogout}>
        Logout
      </button>

      </div>
     


);
   
}

export default Home;

