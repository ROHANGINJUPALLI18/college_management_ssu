import Image from "next/image";
import Link from "next/link";

const degreePrograms = [
  {
    title: "Bachelor Degree",
    desc: "A Bachelor Degree from Sikkim Skill University is a qualification that the world will recognise. But it's much more than that.",
    img: "https://www.ssu.ac.in/images/institution-icon.png",
    href: "/bachelor-degree",
  },
  {
    title: "Masters Degree",
    desc: "We give our master's students excellence in teaching and the very best learning environments.",
    img: "https://www.ssu.ac.in/images/institution-icon0.png",
    href: "/masters-degree",
  },
  {
    title: "Research Degree",
    desc: "Embarking on a research program at Sikkim Skill University means joining a vibrant community of scholars whose work drives meaningful change and impacts lives worldwide.",
    img: "https://www.ssu.ac.in/images/institution-icon1.png",
    href: "/research-degree",
  },
  {
    title: "Private Students",
    desc: "At Sikkim Skill University, you can pursue a university-level education without physically attending campus, offering you the flexibility to study from anywhere.",
    img: "https://www.ssu.ac.in/images/institution-icon2.png",
    href: "/private-students",
  },
];

export default function DegreePrograms() {
  return (
    <section className="bg-[#231a4c] py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-0">
          {degreePrograms.map((prog, idx) => (
            <div
              key={prog.title}
              className="flex-1 flex flex-col items-center justify-between px-6 py-8 text-center relative"
            >
              <div className="mb-4">
                <Image
                  src={prog.img}
                  alt={prog.title}
                  width={70}
                  height={70}
                  className="mx-auto"
                />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">
                {prog.title}
              </h4>
              <p className="text-white text-base mb-6">{prog.desc}</p>
              <Link
                href={prog.href}
                className="font-bold text-[#ffd600] hover:text-[#ffb300] transition text-lg"
              >
                Learn More
              </Link>
              {/* Divider */}
              {idx < degreePrograms.length - 1 && (
                <span className="hidden md:block absolute top-8 right-0 h-3/4 w-[2px] bg-gradient-to-b from-[#ffd600] via-white to-[#231a4c] mx-auto" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
