"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const banners = [
  {
    id: 1,
    imageLarge: "/Header-1.png",
    imageSmall: "/Header-mobile-1.png",
    alt: "Latest Trends in Fashion",
  },
  {
    id: 2,
    imageLarge: "/Header-2.png",
    imageSmall: "/Header-mobile-2.png",
    alt: "Exclusive Collection of Outfits",
  },
  {
    id: 3,
    imageLarge: "/Header-3.png",
    imageSmall: "/Header-mobile-3.png",
    alt: "Premium Gents Suits",
  },
];

const Banner = () => {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      slidesPerView={1}
      loop
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      style={{
        "--swiper-navigation-color": "#484848",
        "--swiper-pagination-color": "#484848",
        "--swiper-navigation-size": "24px",
      }}
      className="w-full"
    >
      {banners.map((banner) => (
        <SwiperSlide key={banner.id}>
          <>
            <Image
              src={banner.imageLarge}
              alt={banner.alt}
              width={1920}
              height={700}
              className="hidden md:block w-full h-auto"
              priority={banner.id === 1}
            />

            <Image
              src={banner.imageSmall}
              alt={banner.alt}
              width={768}
              height={960}
              className="block md:hidden w-full h-auto"
              priority={banner.id === 1}
            />
          </>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Banner;
