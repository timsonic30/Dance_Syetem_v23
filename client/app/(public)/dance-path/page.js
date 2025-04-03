"use client";

import { useState, useEffect } from "react";
import "./dancePath.css";
import { Section } from "lucide-react";

export default function DancePath() {
  const [rotation, setRotation] = useState(0); // State to control rotation
  const [filteredColor, setFilteredColor] = useState(""); // State to track active filter

  // Rotation effect for the banner
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prevRotation) => prevRotation + 1); // Increment rotation
    }, 20); // Rotation speed

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Dance styles array
  const styles = [
    {
      id: 1,
      image: "/hiphop.jpg",
      title: "Hip Hop",
      description: "起源於街頭文化，Hip Hop舞蹈風格充滿動感和節奏感，追求自由表達個性，展現自信與活力。以強烈的律動和節拍驅動，結合獨特的動作和創意，全球文化重要一環。",
      color: "#FFA449",
      text1: "Hip Hop Guy",
      text2: "Level : 10+",
    },
    {
      id: 2,
      image: "/urbandance.jpg",
      title: "Urban Dance",
      description: "Urban Dance結合街頭舞蹈元素及創意表現，注重音樂的節奏與動作的多元性，強調潮流文化和藝術融合，深受年輕舞者追捧。",
      color: "#77B1FB",
      text1: "Urban Lover",
      text2: "Level : 10+",
    },
    {
      id: 3,
      image: "/house.jpg",
      title: "House",
      description: "源自夜店舞蹈，House舞充滿輕快的步伐和流暢的動作，融合快節奏音樂與靈活的身體表現。注重腳步變化和節奏掌控，傳遞自由能量。",
      color: "#FFA449",
      text1: "Hip Hop Guy",
      text2: "Level : 10+",
    },
    {
      id: 4,
      image: "/locking.jpg",
      title: "Locking",
      description: "Locking是一種充滿戲劇性及創意的街舞風格，以“鎖定”動作為特點，展現清晰且誇張的表演。動作炫酷且具視覺吸引力。",
      color: "#FFA449",
      text1: "Hip Hop Guy",
      text2: "Level : 10+",
    },
    {
      id: 5,
      image: "/popping.jpg",
      title: "Popping",
      description: "Popping以肌肉快速收縮與放鬆創造出“彈跳”效果為特色，呈現機械般視覺感。結合律動、控制和精準動作，展現科幻感。",
      color: "#FFA449",
      text1: "Hip Hop Guy",
      text2: "Level : 10+",
    },
    {
      id: 6,
      image: "/girlshiphop.jpg",
      title: "Girls Hip Hop",
      description: "Girls Hip Hop結合街舞元素與女性風格，以細膩動作和時尚表現為特色，展現自信與獨特魅力。此風格充滿活力且具表現力，受到女性舞者的喜愛。",
      color: "#FFA449",
      text1: "Hip Hop Guy",
      text2: "Level : 10",
    },
    {
      id: 7,
      image: "/breaking.jpg",
      title: "Breaking",
      description: "結合力量、技巧及創造力的街舞風格，包括地板動作、旋轉等表現形式，展現舞者的爆發力和控制力，是街舞文化象徵。",
      color: "#E4E400",
      text1: "B boy, B girl",
      text2: "Level : 10+",
    },
    {
      id: 8,
      image: "/sexyjazz.jpg",
      title: "Sexy Jazz",
      description: "Sexy Jazz是一種融合爵士舞與性感元素的舞蹈風格，注重肢體線條的優雅展現及情感表達。",
      color: "#CD7DD5",
      text1: "Sexy Baby",
      text2: "Level : 10+",
    },
    {
      id: 9,
      image: "/jazzfunk.jpg",
      title: "Jazz Funk",
      description: "Jazz Funk是一種融合爵士舞和街舞元素的時尚風格，動作流暢、多樣化，展現自信與個性，是流行文化和音樂的代表。",
      color: "#CD7DD5",
      text1: "Sexy Baby",
      text2: "Level : 10+",
    },
    {
      id: 10,
      image: "/heels.jpg",
      title: "Chair/Heels",
      description: "Chair/Heels是融合道具椅子與高跟鞋舞蹈的風格，展現自信、性感與舞台表現力。",
      color: "#CD7DD5",
      text1: "Sexy Baby",
      text2: "Level : 10+",
    },
    {
      id: 11,
      image: "/twerk.jpg",
      title: "Twerk",
      description: "Twerk是一種充滿力量和活力的舞蹈風格，通過臀部律動展現節奏感和肢體控制。",
      color: "#CD7DD5",
      text1: "Sexy Baby",
      text2: "Level : 10+",
    },
    {
      id: 12,
      image: "/jazz.jpg",
      title: "Jazz",
      description: "Jazz舞蹈風格融合流動性與力量，結合戲劇化肢體表現和鮮明節奏，富藝術感且充滿感染力。",
      color: "#6A6A6A",
      text1: "Dancer Artist",
      text2: "Level : 10+",
    },
    {
      id: 13,
      image: "/contemporary.jpg",
      title: "Contemporary",
      description: "強調情感表達與肢體流動性，融合現代舞技術及抽象美感。",
      color: "#6A6A6A",
      text1: "Dancer Artist",
      text2: "Level : 10+",
    },
    {
      id: 14,
      image: "/waacking.jpg",
      title: "Waacking",
      description: "Waacking是一種以快速旋轉的手臂動作及誇張的姿態為特點，充滿強烈戲劇性。",
      color: "#6A6A6A",
      text1: "Dancer Artist",
      text2: "Level : 10+",
    },
    {
      id: 15,
      image: "/choreography.jpg",
      title: "Choreography",
      description: "Choreography強調舞蹈編排與藝術創作，追求音樂與動作的高度契合。",
      color: "#6A6A6A",
      text1: "Dancer Artist",
      text2: "Level : 10+",
    },
    {
      id: 16,
      image: "/kpop.jpg",
      title: "K-Pop",
      description: "起源於韓國的流行音樂舞蹈，結合多種風格如爵士、街舞及現代舞，動作整齊且極具舞台感。",
      color: "#5BECE5",
      text1: "K-pop Lover",
      text2: "Level : 10+",
    },
  ];

  // Filtered styles based on the selected color
  const filteredStyles = filteredColor
    ? styles.filter((style) => style.color === filteredColor)
    : styles;

  // Available filter colors
  const colors = [
    { color: "#FFA449", label: "Hip Hop Guy" },
    { color: "#77B1FB", label: "Urban Lover" },
    { color: "#E4E400", label: "B boy, B girl" },
    { color: "#CD7DD5", label: "Sexy Baby" },
    { color: "#5BECE5", label: "K-pop Lover" },
  ];

  return (
    <div>
      {/* Rotating Banner */}
      <div className="DPTopBanner-container" id="DPTopBanner-container">
        <img
          src="/logo_xtraLab.png"
          alt="Dance Banner"
          className="DP-rotating-banner"
          id="DP-rotating-banner"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </div>
  
      {/* Header Section */}
      <div className="DP-DancePHead" id="DP-DancePHead">
        <h1>Dance Path & Dance Styles Honors</h1>
        <div className="DP-headIntro" id="DP-headIntro">
          舞蹈是無國界語言！解鎖獨特自我，創造更高境界的專屬舞台！
          <br />
          加入升Level之旅，閃爍魅力！習舞之旅，出發吧!
          <br />
          開拓舞者稱號及榮譽，見證習舞成長之路！
        </div>
      </div>
  
      {/* Filter Buttons */}
      <div className="DP-filter-buttons" id="DP-filter-buttons">
        {colors.map((color) => (
          <button
            key={color.color}
            className="DP-filter-button"
            id={`DP-filter-button-${color.label}`}
            style={{
              backgroundColor: color.color,
              color: color.color === "#E4E400" ? "#000" : "#fff", // Conditional text color
              border: "none",
              padding: "10px 15px",
              margin: "5px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() =>
              setFilteredColor(filteredColor === color.color ? "" : color.color)
            }
          >
            {color.label}
          </button>
        ))}
        <button
          className="DP-filter-button"
          id="DP-filter-button-show-all"
          style={{
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            padding: "10px 15px",
            margin: "5px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => setFilteredColor("")}
        >
          Show All
        </button>
      </div>
  
      {/* Dance Styles Section */}
      <div className="DP-dance-style-ForBFormat" id="DP-dance-style-ForBFormat">
        <div className="DP-dance-style-wrapper">
          {filteredStyles.map((style) => (
            <div
              key={style.id}
              className="DP-dance-style-container"
              id="DP-dance-style-container"
            >
              <img
                src={style.image}
                alt={style.title}
                className="DP-dance-style-image"
                id="DP-dance-style-image"
              />
              <div className="DP-text-box" id="DP-text-box">
                <h2>{style.title}</h2>
                <p>{style.description}</p>
                <div
                  className="DP-StyleTag-box"
                  id="DP-StyleTag-box"
                  data-color={style.color}
                  style={{
                    backgroundColor: style.color,
                    color: style.color === "#E4E400" ? "#000" : "#fff", // Conditional text color
                  }}
                >
                  <div className="DP-StyleTag-row" id="DP-StyleTag-row">
                    {style.text1 && <h3>{style.text1}</h3>}
                    {style.text2 && <span>{style.text2}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}  