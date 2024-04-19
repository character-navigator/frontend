import Logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

function LoginView({error, username, password, setUsername, setPassword, onSubmit}: 
    {error: string, username: string, password: string, setUsername: Function, setPassword: Function, onSubmit: any}){

    return(
        <div>
            <div style={{marginTop: "25vh", textAlign: "center"}}>
                <img src={Logo} className="logo"></img>
                <div style={{width: "65%", margin: "0 auto", marginTop: "2vh"}}>
                    <p className="copy">A graduation project by:<br/> <span className="bolded">Axel Månson Lokrantz & Daniel Dahlberg</span> in collaboration with BookBeat.</p> 
                </div>
                <input onChange={e => setUsername(e.target.value)} style={{marginTop: "2vh"}} className="input" placeholder="Username"></input><br/>
                <input type="password" onChange={e => setPassword(e.target.value)} className="input" placeholder="Password"></input><br/>
                <p className="error">{error}</p>
                <button onClick={onSubmit} className="button-23" style={{marginTop: "4vh"}}>Login</button><br/>  
            </div>
        </div>  
    )
}

export default LoginView