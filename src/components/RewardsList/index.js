import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/legacy/image";
import { GoldMedal } from "../Icons/GoldMedal";
import { BronzeMedal } from "../Icons/BronzeMedal";
import { SilverMedal } from "../Icons/SilverMedal";

export default function RewardsList({ hideText, isHome }) {
  const images = [
    {
      dir: "/imgs/rewards/bag-0.png",
      medal: <GoldMedal />,
      classification: "Primeiro",
      title: "R$ 500,00",
    },
    {
      dir: "/imgs/rewards/bag-1.png",
      medal: <SilverMedal />,
      classification: "Segundo",
      title: "R$ 300,00",
    },
    {
      dir: "/imgs/rewards/bag-2.png",
      medal: <BronzeMedal />,
      classification: "Terceiro",
      title: "R$ 150,00",
    },
  ];

  const settings = {
    centerMode: false,
    infinite: false,
    arrows: false,
    centerPadding: "14px",
    dots: true,
    dotsClass: "slick-dots",
    slidesPerRow: 1,
    slidesToShow: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          autoplay: false,
          swipeToSlide: false,
          slidesPerRow: 1,
          initialSlide: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1.6,
          slidesToScroll: 1,
          initialSlide: 1,
          infinite: false,
          autoplay: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          autoplay: false,
        },
      },
    ],
  };

  return (
    <div className="container">
      {!hideText && (
        <div className="pt-10 lg:pt-10">
          <h1 className="font-archivo font-bold text-xl text-center">
            Premiação
          </h1>
          <p className="font-inter pt-2 px-10 text-wrap text-lg text-neutral-300 text-center mb-5">
            As melhores pontuações ganharão prêmios incríveis. Entre, escolha
            seu jogo favorito e bora competir.
          </p>
        </div>
      )}
      <div>
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index} className="outline-none p-1 mt-4">
              <Image
                src={image.dir}
                width={400}
                height={400}
                alt={`Prêmio ${index}`}
                className="z-0 rounded-md"
              />
              <div className="-mt-4 lg:-mt-14 z-10 relative">
                <div className="text-center">
                  <div className="inline-block">{image.medal}</div>
                </div>
                <div className="text-center">
                  <p className="bg-[#4b34b2] text-white text-xs font-medium px-2.5 py-0.5 rounded inline-block self-center">
                    {image.classification}
                  </p>
                  <p className="font-inter mt-2 text-sm text-center">
                    {image.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
