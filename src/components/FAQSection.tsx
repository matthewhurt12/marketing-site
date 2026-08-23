import { ChevronDown } from "lucide-react";

const questions = [
  {
    question: "Is In Person available now?",
    answer: "Not yet. In Person is in development. Join the waitlist for early-access and launch updates.",
  },
  {
    question: "How is it different from other dating apps?",
    answer: "In Person is designed around one thoughtful introduction at a time, with the person and the plan considered together. There is no endless profile deck to manage.",
  },
  {
    question: "How does matching work?",
    answer: "The experience starts with a conversation about what matters to you and the kind of date you would actually enjoy. When there is a promising introduction, In Person is designed to show one clear match and why it may be worth considering.",
  },
  {
    question: "Do I choose whether to meet someone?",
    answer: "Always. An introduction is an invitation, not an obligation. A date only confirms after both people accept.",
  },
  {
    question: "Where will In Person launch?",
    answer: "Launch markets have not been announced. Join the waitlist to hear when access becomes available near you.",
  },
  {
    question: "How much will it cost?",
    answer: "Pricing has not been announced. Joining the waitlist is free and does not require payment.",
  },
  {
    question: "What happens when I join the waitlist?",
    answer: "We use your email to send early-access and launch updates. Joining does not guarantee access or a launch date, and you can unsubscribe at any time.",
  },
];

export default function FAQSection() {
  return (
    <section id="questions" className="bg-[#f3edf0] px-5 py-24 text-[#211543] sm:px-6 md:py-36">
      <div className="mx-auto grid max-w-[76rem] gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#7558be]">The details</p>
          <h2 className="mt-5 font-display text-[clamp(3.2rem,6vw,5.8rem)] font-bold leading-[0.92] tracking-[-0.05em]">
            Questions are a good sign.
          </h2>
          <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-[#211543]/54">
            The product is still being built. Here is what is clear now—and what we will not pretend to know yet.
          </p>
        </div>

        <div className="border-t border-[#211543]/12">
          {questions.map((item, index) => (
            <details key={item.question} className="group border-b border-[#211543]/12">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7 marker:hidden">
                <span className="flex items-baseline gap-4">
                  <span className="hidden font-sans text-[9px] font-bold tracking-[0.16em] text-[#7558be]/45 sm:inline">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-xl font-semibold sm:text-2xl">{item.question}</span>
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#211543]/12 transition group-open:rotate-180 group-open:bg-[#211543] group-open:text-white">
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </span>
              </summary>
              <div className="pb-7 pl-0 pr-14 sm:pl-10">
                <p className="max-w-2xl font-sans text-sm leading-relaxed text-[#211543]/58 sm:text-base">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
