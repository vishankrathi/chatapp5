import Register from "./RegisterAndLoginForm";
import axios from "axios";
import {UserContext,UserContextProvider} from "./UserContext";
import {useContext} from "react";
import Routes from "./Routes";
function App() {
  axios.defaults.baseURL=import.meta.env.VITE_REACT_API_PROD;;
  axios.defaults.withCredentials=true;
  const {username}=useContext(UserContext);
  console.log(username);
  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
 
  )
  
}

export default App
