import KTHBookBeat from "../../assets/kthbookbeat.png"
import "./Footer.css"
function FooterView(){
    return(
    <div style={{position: "absolute", width: "100%", bottom: "12vh"}}>
      <div style={{textAlign: "center"}}>
        <img src={KTHBookBeat} className="kthbookbeat"/>
      </div>
    </div>
    )
}

export default FooterView