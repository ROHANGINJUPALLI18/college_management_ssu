// Features / Why Choose Us section
import React from "react";

const features = [
  {
    title: "International Students",
    desc: "From modern classrooms to student lounges and cultural hubs, our campus offers world-class facilities designed to enhance your academic and personal experience.",
    img: "https://www.ssu.ac.in/coursepanel/~image/course/1745838840.png",
  },
  {
    title: "Sports",
    desc: "The university encourages students to participate in intercollegiate sports competitions, and there are training programs available for those wishing to pursue sports professionally.",
    img: "https://www.ssu.ac.in/coursepanel/~image/course/1745838875.png",
  },
  {
    title: "Campus Life",
    desc: "SSU campus life is full of engaging activities, from cultural festivals to music and dance performances. Students are encouraged to express their creativity and talents through various clubs and societies.",
    img: "https://www.ssu.ac.in/coursepanel/~image/course/1745838913.png",
  },
  {
    title: "Labs",
    desc: "The university labs are equipped with the latest technology and tools that mirror what students will use in their professional careers, giving them a competitive edge when entering the workforce.",
    img: "https://www.ssu.ac.in/coursepanel/~image/course/1745838941.png",
  },
  {
    title: "Safety and security",
    desc: "SSU prioritizes the safety of all students, including international students. The campus is well-guarded with 24/7 security personnel, surveillance cameras, and emergency response protocols in place.",
    img: "https://www.ssu.ac.in/coursepanel/~image/course/1745838963.png",
  },
  {
    title: "Strong alumni network",
    desc: "The alumni network is a valuable resource for students as they embark on their careers. Networking with alumni can help open doors to internships, jobs, and entrepreneurial ventures.",
    img: "https://www.ssu.ac.in/coursepanel/~image/course/1745838988.png",
  },
  {
    title: "Library",
    desc: "The library provides a peaceful and conducive environment for learning, including group study areas, private reading rooms, and computer workstations.",
    img: "https://www.ssu.ac.in/coursepanel/~image/course/1745841784.png",
  },
  {
    title: "Student support services",
    desc: "The university provides access to health clinics, mental health support, and wellness programs, ensuring students overall well-being.",
    img: "https://www.ssu.ac.in/coursepanel/~image/course/1745841149.png",
  },
  {
    title: "Diverse student life",
    desc: "Students have the opportunity to learn about different cultures, celebrate various festivals, and build long-lasting friendships across nationalities.",
    img: "https://www.ssu.ac.in/coursepanel/~image/course/1745841187.png",
  },
  {
    title: "Community engagement",
    desc: "SSU encourages students to engage in community service and social development initiatives.",
    img: "https://www.ssu.ac.in/coursepanel/~image/course/1745841219.png",
  },
  {
    title: "Sustainable practices",
    desc: "Students are encouraged to participate in sustainability initiatives like tree planting, recycling drives, and awareness campaigns on climate change and conservation.",
    img: "https://www.ssu.ac.in/coursepanel/~image/course/1745841245.png",
  },
  {
    title: "Modern facilities",
    desc: "SSU boasts modern classrooms, lecture halls, seminar rooms, and conference facilities equipped with multimedia and digital learning tools.",
    img: "https://www.ssu.ac.in/coursepanel/~image/course/1745841276.png",
  },
];

const Features = () => (
  <section id="features" className="py-12 bg-gray-100">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-left text-[#2a1a5e]">
        <span className="text-[#003366] font-semibold text-lg mb-2 block">
          Our Campus
        </span>
        Why Choose Us
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#2a1a5e]/30 shadow-lg rounded-[18px] p-6 flex items-start gap-4 min-h-[180px] hover:shadow-xl transition"
          >
            <div className="flex-shrink-0">
              <div className="bg-yellow-300 rounded-lg w-16 h-16 flex items-center justify-center">
                <img
                  src={feature.img}
                  alt={feature.title}
                  className="w-10 h-10 object-contain"
                />
              </div>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-[#2a1a5e] mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-700 text-base">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
