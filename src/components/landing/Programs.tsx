// Programs / Courses section with card layout
import React from "react";
import Image from "next/image";

const programs = [
  {
    title: "COMPUTER SCIENCE",
    desc: "B.Sc | B.Sc (Hons) | M.Sc",
    img: "https://www.ssu.ac.in/images/Categories-1.jpg",
    lineImg: "https://www.ssu.ac.in/images/category-title-line.png",
  },
  {
    title: "ENGINEERING",
    desc: "Diploma | BCA | BCA (Tieup with iNurture) | MCA",
    img: "https://www.ssu.ac.in/images/Categories-2.jpg",
    lineImg: "https://www.ssu.ac.in/images/category-title-line.png",
  },
  {
    title: "AGRICULTURE",
    desc: "Diploma | BCA | B.Sc (Hons) | B.Sc + MBA | M.Sc | Diploma",
    img: "https://www.ssu.ac.in/images/Categories-3.jpg",
    lineImg: "https://www.ssu.ac.in/images/category-title-line.png",
  },
  {
    title: "ARTS & HUMANITIES",
    desc: "BA | MA | MPES",
    img: "https://www.ssu.ac.in/images/Categories-4.jpg",
    lineImg: "https://www.ssu.ac.in/images/category-title-line.png",
  },
  {
    title: "FASHION & DESIGN",
    desc: "Certificate | PG Diploma | BA | MA",
    img: "https://www.ssu.ac.in/images/Categories-6.jpg",
    lineImg: "https://www.ssu.ac.in/images/category-title-line.png",
  },
  {
    title: "LIBRARY SCIENCE",
    desc: "D.Lib | B.Lib | M.Lib",
    img: "https://www.ssu.ac.in/images/Categories-7.jpg",
    lineImg: "https://www.ssu.ac.in/images/category-title-line.png",
  },
  {
    title: "MANAGEMENT",
    desc: "B.Com | M.Com | BBA | MBA",
    img: "https://www.ssu.ac.in/images/Categories-8.jpg",
    lineImg: "https://www.ssu.ac.in/images/category-title-line.png",
  },
  {
    title: "LAW",
    desc: "BA + LL.B, LL.B LL.M (1 Year) | LL.M (2 Years)",
    img: "https://www.ssu.ac.in/images/Categories-9.jpg",
    lineImg: "https://www.ssu.ac.in/images/category-title-line.png",
  },
  {
    title: "PHYSIOTHERAPY",
    desc: "BPT | MPT",
    img: "https://www.ssu.ac.in/images/Categories-10.jpg",
    lineImg: "https://www.ssu.ac.in/images/category-title-line.png",
  },
  {
    title: "JOURNALISM & MASS COMMUNICATION",
    desc: "BJMC | MJMC | Diploma | PG Diploma",
    img: "https://www.ssu.ac.in/images/course/journalist.png",
    hoverImg: "https://www.ssu.ac.in/images/course/JOURNALISM%20&%20MASSC.png",
    lineImg: "https://www.ssu.ac.in/images/category-title-line.png",
  },
  {
    title: "NATUROPATHY & YOGA SCIENCES",
    desc: "PGDYN | PGDYT | BNYS | BA YS | MAYS | B.Sc YS | M.Sc YS |",
    img: "https://www.ssu.ac.in/images/course/photheropy.png",
    hoverImg: "https://www.ssu.ac.in/images/TT.png",
    lineImg: "https://www.ssu.ac.in/images/category-title-line.png",
  },
  {
    title: "DOCTORAL PROGRAMMES",
    desc: "Ph.D (Full Time) / Ph.D (Part Time)",
    img: "https://www.ssu.ac.in/images/course/agriculture.png",
    hoverImg: "https://www.ssu.ac.in/images/agricultureEE.png",
    lineImg: "https://www.ssu.ac.in/images/category-title-line.png",
  },
];

const Programs = () => (
  <section id="programs" className="py-12 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#2a1a5e]">
        Explore Top Categories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {programs.map((prog, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-between min-h-[320px] transition hover:shadow-xl border border-gray-200"
          >
            <div className="w-full flex flex-col items-center">
              <h4 className="text-lg font-bold text-[#2a1a5e] mb-2 uppercase tracking-wide">
                {prog.title}
              </h4>
              <div className="flex justify-center mb-2">
                <Image
                  src={prog.lineImg}
                  alt="Category line"
                  width={120}
                  height={10}
                />
              </div>
              <div className="flex justify-center mb-4">
                <Image
                  src={prog.img}
                  alt={prog.title}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <h5 className="text-base text-[#2a1a5e] font-semibold mb-4 text-center">
                {prog.desc}
              </h5>
            </div>
            <button className="w-full mt-auto bg-[#ffd600] text-[#2a1a5e] font-bold py-2 rounded-lg hover:bg-[#ffb300] transition">
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Programs;
