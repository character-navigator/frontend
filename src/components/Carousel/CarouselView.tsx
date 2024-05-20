import { Slider, Slide } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import AnimalFarm from "../../assets/animal-farm.jpg";
import Odyssey from "../../assets/odyssey.png";
import ChristmasCarol from "../../assets/christmas-carol.png";
import WarAndPeace from "../../assets/war-and-peace.png";
import { Link, useParams } from "react-router-dom";

const books = [
  { 
    title: "Animal Farm", 
    author: "George Orwell", 
    cover: AnimalFarm ,
    path: "animal-farm"
  },
  { 
    title: "War and Peace", 
    author: "Leo Tolstoy", 
    cover: WarAndPeace,
    path: "war-and-peace"
  },
  {
    title: "Odyssey",
    author: "Homer",
    cover: Odyssey,
    path: "the-odyssey"
  },
  {
    title: "A Christmas Carol",
    author: "Charles Dickens",
    cover: ChristmasCarol,
    path: "a-christmas-carol"
  },
];

export default function CarouselView({
  currentSlide,
}: {
  currentSlide: number;
}) {
  return (
    <div>
      <Slider className="carousel__slider">
        {books.map((book, index) => (
          <Slide key={index} index={index}>
            <Link to={"/reader/" + book.path} >
              <img src={book.cover} alt={book.title} />
            </Link>
          </Slide>
        ))}
      </Slider>
      <p className="book">
        <span className="author">{books[currentSlide].author}</span>
        <br />
        {books[currentSlide].title}
      </p>
    </div>
  );
}
