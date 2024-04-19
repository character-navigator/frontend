import LoginView from "./LoginView"
import Footer from "../../components/Footer/FooterView"
import { useState, useEffect } from "react"
import './Login.css'
import { useNavigate } from "react-router-dom"

function Login(){

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    function onSubmit(){
        fetch("http://localhost:5025/authenticate",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username, password})

        }).then(response => {
            response.json().then(result => {
                if(result?.error === "Invalid_Credentials"){
                    setError("Invalid credentials. Please try again.")
                }
                else{
                    
                    localStorage.setItem("token", result?.token)
                    if(result){
                        setError("")
                        navigate("/book-selector")
                    }
                }
            })
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