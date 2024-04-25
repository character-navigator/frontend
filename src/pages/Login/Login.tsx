import LoginView from "./LoginView"
import Footer from "../../components/Footer/FooterView"
import { useState, useEffect } from "react"
import './Login.css'
import { useNavigate } from "react-router-dom"
import axios from "../../config/api"

function Login(){

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    function onSubmit(){
        axios.post("authenticate", { username, password }).then(response => {
            if(response.data?.error === "Invalid_Credentials") {
                setError("Invalid credentials. Please try again.")
            } else {
                if(response.data?.token){
                    setError("")
                    navigate("/book-selector")
                    localStorage.setItem("token", response.data.token)
                }
            }
        })
    }

    return(

        <div className="background">
            <LoginView error={error} username={username} password={password} setUsername={setUsername} setPassword={setPassword} onSubmit={onSubmit}/>
            <Footer/>
        </div>
    )
}

export default Login