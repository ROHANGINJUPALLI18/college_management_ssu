import React from "react";

const steps = [
  {
    step: "STEP 1",
    icon: "https://www.ssu.ac.in/images/process-icon-1.png",
    title: "Application",
    desc: "Fill the online application form. Complete the form with details.",
  },
  {
    step: "STEP 2",
    icon: "https://www.ssu.ac.in/images/process-icon-2.png",
    title: "Registration Fee Payment",
    desc: "Follow the Simple Steps to complete the application and registration payment through the portal.",
  },
  {
    step: "STEP 3",
    icon: "https://www.ssu.ac.in/images/process-icon-3.png",
    title: "SSU Aptitude Test & Personal Interview",
    desc: "The personal interview allows you to showcase your individual strengths.",
  },
  {
    step: "STEP 4",
    icon: "https://www.ssu.ac.in/images/process-icon-4.png",
    title: "Get Your Admission Offer Letter",
    desc: "Once we have reviewed your application, you may submit your documents & exam results for further processing of your application process.",
  },
  {
    step: "STEP 5",
    icon: "https://www.ssu.ac.in/images/process-icon-5.svg",
    title: "Enrollment",
    desc: "Complete the enrollment process by paying the enrollment fees.",
  },
];

const AdmissionProcess = () => (
  <section className="bg-[#231a4c] py-12">
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#ffd600] mb-2">
          Begin Your Future at Sikkim Skill University
        </h2>
        <div className="flex justify-center mb-4">
          <img src="/images/course-heading.png" alt="" className="h-4" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:justify-center md:items-stretch gap-8">
        {steps.map((step, idx) => (
          <div
            key={step.step}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center w-full md:w-[240px] min-h-[340px] relative"
          >
            <h5 className="text-[#231a4c] font-bold mb-2">{step.step}</h5>
            <div className="mb-3">
              <img
                src={step.icon}
                alt={step.title}
                className="mx-auto h-16 w-16 object-contain"
              />
            </div>
            <h4 className="text-lg font-bold text-[#231a4c] mb-2">
              {step.title}
            </h4>
            <p className="text-gray-700 text-base">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AdmissionProcess;
