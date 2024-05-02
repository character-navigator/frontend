import { Slider, Slide } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import AnimalFarm from "../../assets/animal-farm.jpg";
import Odyssey from "../../assets/odyssey.png";
import ChristmasCarol from "../../assets/christmas-carol.png";
import WarAndPeace from "../../assets/war-and-peace.png";
import { Link } from "react-router-dom";

const books = [
  { title: "Animal Farm", author: "George Orwell", cover: AnimalFarm },
  { title: "War and Peace", author: "Leo Tolstoy", cover: WarAndPeace },
  {
    title: "Odyssey",
    author: "Homer",
    cover: Odyssey,
  },
  {
    title: "A Christmas Carol",
    author: "Charles Dickens",
    cover: ChristmasCarol,
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
            <Link to="/reader">
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
