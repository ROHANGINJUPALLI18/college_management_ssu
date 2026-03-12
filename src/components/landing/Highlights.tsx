// Highlights or statistics section
import React from "react";

const highlights = [
  { label: "Programs", value: "50+" },
  { label: "Students", value: "10,000+" },
  { label: "Faculty", value: "200+" },
  { label: "Placements", value: "100%" },
];

const Highlights = () => (
  <section className="py-12 bg-[#2a1a5e] text-white">
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {highlights.map((item, idx) => (
          <div key={idx} className="rounded-lg bg-[#3e1a72] p-6">
            <div className="text-3xl font-bold mb-2">{item.value}</div>
            <div className="text-lg">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Highlights;
