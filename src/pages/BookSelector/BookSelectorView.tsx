import Carousel from "../../components/Carousel/Carousel"
import Thesis from "../../components/Thesis/ThesisView"  
import "../../components/Carousel/Carousel.css"
import Footer from "../../components/Footer/FooterView"
import Header from "../../components/Header/HeaderView"
import {CarouselProvider} from "pure-react-carousel";
import './BookSelector.css'


function BookSelector(){
    
    return(
        
        <div className="background-book-selector">
            <Header pageTitle="Book Selector"/>
            <CarouselProvider className="carousel-provider"
                naturalSlideWidth={100}
                naturalSlideHeight={140}
                totalSlides={4}
                visibleSlides={1}
                currentSlide={1}>
                <Carousel/>
            </CarouselProvider>
            <Thesis/>
            <Footer/>
        </div>
    )
}

export default BookSelector