import './Header.css'
import { HiArrowUturnLeft } from "react-icons/hi2";
import { useLocation, Link } from 'react-router-dom';


function HeaderView({pageTitle}:{pageTitle: string}){
    
    const location = useLocation()

    function getBackPath(){
        return location.pathname === '/book-selector' ? '/' : '/book-selector'
    }

    return(
        <div className="header">
            <div>
                <Link to={getBackPath()}>
                <HiArrowUturnLeft size={20} color="black" style={{position: 'absolute', top: '5.7vh'}}/>
                </Link>
            </div>
            <div style={{textAlign: 'center'}}>
            <p className="header-container">Character Navigator<br/>
            {pageTitle}</p></div>
            <div/>
        </div>
    )
}

export default HeaderView