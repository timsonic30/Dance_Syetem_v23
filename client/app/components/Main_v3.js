"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Youtube, Instagram } from "lucide-react";
import Calendar2 from "./Calendar2";

export default function Main_v3() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 圖片列表
  const images = [
    "/Banner01.jpeg",
    "/Banner02.jpeg",
    "/Banner03.jpeg",
    "/Banner04.jpeg",
    "/Banner05.jpeg",
  ];
  const totalSlides = images.length;

  const cards = [
    {
      title: "Showcase",
      image: "/cards01.png",
      alt: "The XTRA SHOW event poster with colorful gradient background",
      href: "/showcase",
    },
    {
      title: "Dance Competition",
      image: "/cards02.png",
      alt: "HVENGERS DANCE COMPETITION poster with categories and judges",
      href: "/competition",
    },
    {
      title: "Workshop",
      image: "/cards03.png",
      alt: "Workshop image showing a dance instructor",
      href: "/workshop",
    },
    {
      title: "Buy Class",
      image: "/cards04.jpeg",
      alt: "THE XTRA CLASS promotional image",
      href: "/buyClass",
    },
    {
      title: "Rent",
      image: "/cards05.jpeg",
      alt: "Studio XL floor plan",
      href: "/danceClass/roomRental",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="w-full">
      <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-lg mt-20">
        {/* Gradient Background */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <div className="absolute inset-0 bg-transparent rounded-none"></div>

          {/* Smoke/Fog Effect */}
          <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-30 mix-blend-soft-light"></div>

          {/* 圖片區塊 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <div className="relative w-full h-full">
              {/* 顯示當前 slide 的圖片 */}
              <img
                src={images[currentSlide]}
                alt={`Banner ${currentSlide + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          {/* Pagination Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 mt-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide === index
                    ? "bg-black"
                    : "bg-black/50 hover:bg-black/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <Calendar2 />
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 py-4 mt-10 mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {cards.map((card, index) => (
              <Link
                key={index}
                href={card.href}
                className="group flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md overflow-hidden"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={card.image || "/placeholder.svg"}
                    alt={card.alt}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-medium text-gray-900">
                    {card.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <section className="bg-gray-100 py-12 px-4 w-full mt-8">
          <div className="max-w-7xl mx-auto ">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center md:items-start md:flex-row md:space-x-4">
                <div className="flex-shrink-0 mb-4 md:mb-0">
                  <Image
                    src="/icon-1.png"
                    alt="Calendar icon"
                    width={50}
                    height={50}
                    className="h-12 w-12"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-medium text-gray-800">
                    Flexible Schedule
                  </h3>
                  <p className="text-gray-600 mt-1">Choose Courses</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center md:items-start md:flex-row md:space-x-4">
                <div className="flex-shrink-0 mb-4 md:mb-0">
                  <Image
                    src="/icon-2.png"
                    alt="Instructor icon"
                    width={50}
                    height={50}
                    className="h-12 w-12"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-medium text-gray-800">
                    Expert Instructors
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Top-Quality Dance Lessons
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center md:items-start md:flex-row md:space-x-4">
                <div className="flex-shrink-0 mb-4 md:mb-0">
                  <Image
                    src="/icon-3.png"
                    alt="Pricing icon"
                    width={50}
                    height={50}
                    className="h-12 w-12"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-medium text-gray-800">
                    Transparent Pricing
                  </h3>
                  <p className="text-gray-600 mt-1">Clear Course Fees</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center md:items-start md:flex-row md:space-x-4">
                <div className="flex-shrink-0 mb-4 md:mb-0">
                  <Image
                    src="/icon-4.png"
                    alt="Support icon"
                    width={50}
                    height={50}
                    className="h-12 w-12"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-medium text-gray-800">
                    Customer Support
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Quick Responses Services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="w-full bg-white">
          <div className="max-w-6xl mx-auto px-8 py-8">
            {/* Contact Information */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-20">
              {/* WhatsApp */}
              <div className="flex flex-col items-center">
                <h3 className="font-medium text-lg mb-2">WhatsAPP</h3>
                <div className="rounded-full bg-black w-10 h-10 flex items-center justify-center mb-2">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm">+852 1234 5678</p>
              </div>

              {/* Instagram */}
              <div className="flex flex-col items-center">
                <h3 className="font-medium text-lg mb-2">Instagram</h3>
                <div className="rounded-full bg-black w-10 h-10 flex items-center justify-center mb-2">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm">@Xtra.Lab</p>
              </div>

              {/* Address */}
              <div className="flex flex-col items-center">
                <h3 className="font-medium text-lg mb-2">Address</h3>
                <div className="rounded-full bg-black w-10 h-10 flex items-center justify-center mb-2">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm">觀塘工業中心：第2期5樓J室</p>
              </div>

              {/* Youtube */}
              <div className="flex flex-col items-center">
                <h3 className="font-medium text-lg mb-2">Youtube</h3>
                <div className="rounded-full bg-black w-10 h-10 flex items-center justify-center mb-2">
                  <Youtube className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm">@XtraordinaryLaboratory</p>
              </div>
            </div>

            {/* Map */}
            <div className="w-full h-[300px] relative mb-6 border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.1256452417715!2d114.22492317522898!3d22.3110874425045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x340401413b19e527%3A0x5f6c4cca8aa97c00!2z6KeA5aGY5bel5qWt5Lit5b-D77ya56ysMuacnw!5e0!3m2!1szh-TW!2shk!4v1743037645488!5m2!1szh-TW!2shk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
            </div>

            {/* Copyright */}
            <div className="text-center text-sm mt-4">
              <p>Created By Web Designer | All Right Reserved |</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
