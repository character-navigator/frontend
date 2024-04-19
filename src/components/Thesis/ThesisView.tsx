import './Thesis.css'
import ButtonIcon from '../../assets/button-icon.png'
import { Link } from "react-router-dom";

function ThesisView(){
    return(
    <div className="container">
        <p className="copy">Select one of the processed books above. ↑<br/> 
        Read the thesis below. ↓</p>
        <button className="button-thesis">Click to read the thesis<img src={ButtonIcon} className="button-icon"/></button>
        <p className="copy">Or learn more about the project 
            <Link to='/about' style={{textDecoration: 'none'}}>
            <span className="link"> here</span> 
            </Link>
        .</p>
    </div>
    )
}

export default ThesisView