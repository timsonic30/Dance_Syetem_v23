"use client";

import { useState, useEffect } from "react";
import "./AboutUs.css";
import Image from "next/image";

export default function AboutUs() {
  const slides = [
    { id: 1, image: "/AboutUs_img01.png" },
    { id: 2, image: "/AboutUs_img02.png", caption: "Room XL 1250 sq-ft." },
    {
      id: 3,
      image: "/AboutUs_img03.png",
      caption: "Enhance your dance with our lighting!",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [language, setLanguage] = useState("中文繁體");

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  };

  useEffect(() => {
    const interval = setInterval(goToNext, 2000); // Change 3000 to your desired interval in milliseconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const content = {
    中文繁體: {
      aboutUs: "關於我們",
      description:
        "Xtra Lab成立於2003年，是一家活力充沛且專業的舞蹈學校，位於香港觀塘港鐵站附近，地理位置便利。",
      instructorTeam: "導師團隊",
      teamDescription: `Xtra Lab致力為每位熱愛舞蹈的人提供廣泛且多樣化的課程，涵蓋：Hip Hop、House、Locking、Popping、Jazz、Jazz Funk、Contemporary、Urban Dance、Breaking及Heels等不同舞蹈風格。
        我們的導師團隊由本地及國際的專業舞者組成，他們均經歷專業訓練，並具備豐富的舞台演出、編舞及教學經驗，在香港及國際舞台上屢創佳績。他們不僅教授技術，更希望喚起學員對舞蹈的熱情。您將能輕鬆找到最適合您的課程和導師！`,
      trainingPlan: "培訓計劃",
      trainingDescription: `除常規課程外，Xtra Lab致力培養年輕的舞蹈人才，提供多樣化的培訓及發展機會，支持本地及專業舞者的成長。

        Showcase and Workshop為熱愛舞蹈及渴望成為專業舞者的人士提供密集訓練，助其邁向職業舞蹈的道路。

        編舞訓練課程重點提升本地編舞人才的創意力與技巧，啟發更多優秀創作。

        我們為中學生及大學生提供學習舞蹈的機會，同時為成人學員提供公開演出及舞台體驗。

        此外，Xtra Lab積極參與社區及外展活動，從藝人伴舞到邀請國際舞者任教，致力於推廣本地及海外的舞蹈文化。`,
      danceProduction: "舞蹈製作",
      productionDescription: `多年來，Xtra Lab透過各種演出製作、比賽及舞蹈節，持續為社區帶來不同類型的舞蹈藝術，並設有Kid Dance Project，以啟發更多年輕一代對舞蹈的興趣。

        我們每年的Xtra Lab Showcase於夏季及冬季舉行，讓所有學員都有機會登上公開舞台，積累寶貴經驗。此外，通過舉辦舞蹈比賽，Xtra Lab為本地舞者搭建國際交流平台，促進他們的學習成長、創意發展及舞台演出技能。

        Xtra Lab亦經常受委託為本地歌手的演唱會擔任編舞及舞蹈員。`,
      facilities: "場地",
      facilitiesDescription:
        "Xtra Lab擁有1,250平方呎寬敞的舞蹈室，鄰近觀塘港鐵站，方便本地舞者及學員使用。我們的場地設施亦開放予租用。",
    },
    English: {
      aboutUs: "About Us",
      description:
        "Founded in 2003, Xtra Lab is a vibrant and professional dance studio conveniently located near Kwun Tong MTR station in Hong Kong.",
      instructorTeam: "Instructor Team",
      teamDescription: `Xtra Lab is dedicated to providing a wide range of courses, including Hip Hop, House, Locking, Popping, Jazz, Jazz Funk, Contemporary, Urban Dance, Breaking, and Heels.

        Our instructor team consists of professional dancers from both local and international stages. They are professionally trained, experienced in choreography, stage performance, and teaching. With great achievements both in Hong Kong and internationally, they aim to inspire students' passion for dance. You’ll easily find the perfect course and instructor for you!`,
      trainingPlan: "Training Plans",
      trainingDescription: `In addition to regular courses, Xtra Lab is dedicated to nurturing young dance talents by offering various training and development opportunities to support both local and professional dancers.

        Showcase and Workshop provide intensive training for those passionate about dance and aspiring to become professional dancers.

        Choreography training courses focus on enhancing local choreographers' creativity and skills, inspiring exceptional new works.

        We provide opportunities for secondary and university students to learn dance, while adult students can enjoy public performances and stage experiences.

        Furthermore, Xtra Lab actively engages in community and outreach activities, ranging from artist accompaniment to inviting international dancers to teach, promoting both local and global dance culture.`,
      danceProduction: "Dance Productions",
      productionDescription: `Over the years, Xtra Lab has brought various forms of dance art to the community through performances, competitions, and dance festivals. The Kid Dance Project is designed to inspire interest in dance among the younger generation.

        Our annual Xtra Lab Showcase, held in summer and winter, gives all students the chance to perform on stage and gain valuable experience. By organizing dance competitions, Xtra Lab creates an international exchange platform for local dancers, helping them grow in learning, creativity, and stage performance skills.

        Xtra Lab is also frequently commissioned to provide choreography and dancers for concerts by local singers.`,
      facilities: "Facilities",
      facilitiesDescription:
        "Xtra Lab features a spacious 1,250 sq-ft dance studio conveniently located near Kwun Tong MTR station, open for classes and rentals.",
    },
  };

  return (
    <div className="about-us">
      {/* Language Buttons */}

      {/* Slideshow */}
      {/* Slideshow */}
      <div className="slideshow-container">
        <div className="slide fade">
          <Image
            src={slides[currentIndex].image}
            alt={`Slide ${currentIndex + 1}`}
            width={400} // Set the desired width
            height={300} // Set the desired height
          />
          {/* Render caption only if it exists */}
          {slides[currentIndex].caption && (
            <div className="caption">{slides[currentIndex].caption}</div>
          )}
        </div>
        <button className="prev" onClick={goToPrev}>
          &#10094;
        </button>
        <button className="next" onClick={goToNext}>
          &#10095;
        </button>
      </div>

      {/* Dots for navigation */}
      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentIndex === index ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>

      {/* Content */}
      <div id="AboutU-container">
        <div id="AboutU-language-buttons">
          <span>Select Your Language</span>
          <button
            className={language === "English" ? "active" : ""}
            onClick={() => setLanguage("English")}
          >
            English
          </button>
          <button
            className={language === "中文繁體" ? "active" : ""}
            onClick={() => setLanguage("中文繁體")}
          >
            中文繁體
          </button>
        </div>

        <h1 id="AboutU-heading">{content[language].aboutUs}</h1>
        <p id="AboutU-paragraph">{content[language].description}</p>

        <h2 id="AboutU-subheading">{content[language].instructorTeam}</h2>
        <p id="AboutU-paragraph">{content[language].teamDescription}</p>

        <h2 id="AboutU-subheading">{content[language].trainingPlan}</h2>
        <p id="AboutU-paragraph">{content[language].trainingDescription}</p>

        <h2 id="AboutU-subheading">{content[language].danceProduction}</h2>
        <p id="AboutU-paragraph">{content[language].productionDescription}</p>

        <h2 id="AboutU-subheading">{content[language].facilities}</h2>
        <p id="AboutU-paragraph">{content[language].facilitiesDescription}</p>
      </div>
    </div>
  );
}
