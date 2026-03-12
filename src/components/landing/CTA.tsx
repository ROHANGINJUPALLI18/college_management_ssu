// Call-to-action section
import React from "react";
import Link from "next/link";

const CTA = () => (
  <section className="py-12 bg-[#ffd600] text-[#2a1a5e]">
    <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
      <div className="mb-6 md:mb-0">
        <h2 className="text-2xl font-bold mb-2">Ready to Enroll?</h2>
        <p className="text-lg">
          Start your journey at Sikkim Skill University today.
        </p>
      </div>
      <Link
        href="#"
        className="bg-[#2a1a5e] text-white font-semibold px-6 py-3 rounded hover:bg-[#3e1a72]"
      >
        Enroll Now
      </Link>
    </div>
  </section>
);

export default CTA;
