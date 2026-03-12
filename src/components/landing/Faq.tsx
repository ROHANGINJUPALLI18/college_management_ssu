import React from "react";

const faqs = [
  {
    question:
      "Is Sikkim Skill University approved by the University Grants Commission (UGC)?",
    answer:
      "Sikkim Skill University (SSU), established by the Government of Sikkim, is a state university focused on skill development and vocational education. However, as of now, Sikkim Skill University is recognized by the University Grants Commission (UGC) under Section 2(f) of the UGC Act, 1956.",
  },
  {
    question: "When was Sikkim Skill University established?",
    answer:
      "SSU was established in 2022 through a State Act passed by the Sikkim Legislative Assembly.",
  },
  {
    question:
      "What is the status of the degree courses offered at Sikkim Skill University?",
    answer:
      "Sikkim Skill University are as par with any degree offered by a recognised university anywhere in the world. Please note: As an autonomous private university, it has the right to offer academic degree programmes at undergraduate, post graduate master and Ph.D levels, besides diplomas and certificate programs as per Govt. of India.",
  },
  {
    question:
      "Is Sikkim Skill University a member of the Association of Indian Universities (AIU)?",
    answer:
      "Yes, Sikkim Skill University (SSU) is a member of the Association of Indian Universities (AIU). This affiliation is confirmed by the university's official website, where the AIU recognition letter is listed among its accreditations and approvals .",
  },
  {
    question:
      "Are the pharmacy programs at Sikkim Skill University approved by the Pharmacy Council of India (PCI)?",
    answer:
      "Yes, the pharmacy programs offered by Sikkim Skill University (SSU) are approved by the Pharmacy Council of India (PCI). This includes their Diploma in Pharmacy (D. Pharm), Bachelor in Pharmacy (B. Pharm), and Master in Pharmacy (M. Pharm) programs.",
  },
  {
    question:
      "Are the law programs at Sikkim Skill University approved by the Bar Council of India (BCI)?",
    answer:
      "Yes, the law programs at Sikkim Skill University (SSU) are approved by the Bar Council of India (BCI). This includes their B.A. LL.B, B.Com LL.B, BBA LL.B, and LL.M programs. The university's official website lists the BCI approval letter among its recognitions and approvals .",
  },
  {
    question: "When was Sikkim Skill University Established?",
    answer:
      "Sikkim Skill University was established in the year 2021 by the Sikkim Legislative Assembly.",
  },
  {
    question:
      "Will I get a job once I completed my course or pursuing in the final year?",
    answer:
      "The Sikkim Skill University has an excellent placement cell and a large number of our students get placed in good companies even before they have written their final semester examinations.",
  },
  {
    question: "Which modes we can pay in the Sikkim Skill University?",
    answer:
      "You can fee/other related pay in our university account by only NEFT/RTGS/IMPS.",
  },
  {
    question:
      "What are the courses / programs offered by Sikkim Skill University",
    answer:
      "Students can choose either of the courses like MBA, MCA, BBA, BCA, B. A or any other bachelor, master's or research program and many more.",
  },
];

const Faq = () => {
  return (
    <section className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2 text-[#2a1a5e]">
            Frequently Asked <span className="text-[#ffd600]">Questions</span>
          </h2>
          <img
            src="/images/abt-border-txt.png"
            alt=""
            className="mx-auto mb-4"
            style={{ maxWidth: 200 }}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="mb-4 border border-gray-200 rounded-lg shadow-sm"
            >
              <details className="group">
                <summary className="cursor-pointer px-6 py-4 font-semibold text-[#2a1a5e] bg-gray-50 group-open:bg-[#ffd600] group-open:text-[#2a1a5e] rounded-t-lg transition">
                  {faq.question}
                </summary>
                <div className="px-6 py-4 text-gray-700 bg-white rounded-b-lg">
                  {faq.answer}
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
