import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GameCover from "./GameCover";
import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * GameSlider component displays a carousel of game covers.
 *
 * @param {Object[]} data - Array of game data objects.
 * @param {function} condition - Optional filter function to filter games.
 *
 * @returns {JSX.Element} A slider component displaying filtered game covers.
 */
export default function GameSlider({ data, condition = () => true }) {
  const router = useRouter();
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    adaptiveHeight: false,
    variableWidth: false,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 640, // Tailwind's sm breakpoint
        settings: {
          slidesToShow: 1.1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // Tailwind's md breakpoint
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1024, // Tailwind's lg breakpoint
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
    ],
  };

  useEffect(() => {
    // Prefetch game details pages
    data.filter(condition).forEach((game) => {
      router.prefetch(`/room/game/${game.id}`);
    });
  }, [router, data, condition]);

  return (
    <>
      {data.filter(condition).map((game) => (
        <div
          key={game.id}
          className={`px-2`}
          onClick={() => {
            router.push(`/room/game/${game.id}`);
          }}
        >
          <GameCover game={game} />
        </div>
      ))}
    </>
  );
}
