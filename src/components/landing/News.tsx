// News / Events section
import React from "react";

const news = [
  {
    title: "Admission Open: 2026-2027",
    desc: "Apply for B.Com, B.Sc, BCA, B.Tech, D.Pharm, B.Pharm, LLB, Diploma, MBA, MCA, MA.",
    date: "March 2026",
  },
  {
    title: "Convocation Ceremony",
    desc: "Annual convocation for graduating students.",
    date: "February 2026",
  },
  {
    title: "SkillAdvance WEIP",
    desc: "Industry partnership for skill development.",
    date: "January 2026",
  },
];

const News = () => (
  <section id="news" className="py-12 bg-white">
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#2a1a5e]">
        News & Events
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {news.map((item, idx) => (
          <div key={idx} className="bg-gray-100 rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-2">{item.date}</div>
            <h3 className="text-lg font-semibold mb-2 text-[#2a1a5e]">
              {item.title}
            </h3>
            <p className="text-gray-700">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default News;
