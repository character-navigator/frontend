import {useContext, useEffect, useState} from "react";
import CarouselView from "./CarouselView";
import {CarouselContext} from "pure-react-carousel";


function Carousel() {
    const carouselContext = useContext(CarouselContext);
    const [currentSlide, setCurrentSlide] = useState(carouselContext.state.currentSlide);

    useEffect(() => {
        function onChange() {
            setCurrentSlide(carouselContext.state.currentSlide);
        }
        carouselContext.subscribe(onChange);
        return () => carouselContext.unsubscribe(onChange);
    }, [carouselContext]);
    return(
        <CarouselView currentSlide = {currentSlide}/>
    )
}

export default Carousel