// About / University introduction section
import React from "react";
import Image from "next/image";

const About = () => (
  <section id="about" className="bg-gray-100 py-12">
    <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
      <div className="md:w-1/2">
        <Image
          src="https://www.ssu.ac.in/images/about-new-ssu.jpg"
          alt="About SSU"
          width={350}
          height={100}
          className="rounded-lg object-cover"   
        />
      </div>
      <div className="md:w-1/2">
        <h2 className="text-3xl font-bold mb-4 text-[#2a1a5e]">
          About Sikkim Skill University
        </h2>
        <p className="text-lg mb-2">
          Sikkim Skill University is a pioneering institution committed to
          transforming the higher education landscape through skill-based,
          vocational, and industry-integrated learning. Established in alignment
          with NEP 2020 and the Skill India Mission, SSU empowers learners with
          practical knowledge, professional competence, and entrepreneurial
          capabilities.
        </p>
        <p className="text-md text-gray-700">
          Education at SSU extends beyond traditional classrooms, connecting
          learning with livelihood, creativity, and community development.
          Flexible academic pathways promote lifelong learning, employability,
          and continuous professional growth.
        </p>
      </div>
    </div>
  </section>
);

export default About;
