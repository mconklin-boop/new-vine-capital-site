import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const services = [
    {
      title: "Submit a New Deal",
      description:
        "For real estate opportunities, acquisition scenarios, bridge requests, refinance transactions, and investor-focused funding needs.",
      icon: "🏠",
      cta: "Submit Deal",
      href: "/submit-deal",
    },
    {
      title: "Apply for Business Lending",
      description:
        "For fuel cards, equipment leasing, vehicle financing, working capital, and other business-purpose lending solutions.",
      icon: "📄",
      cta: "Apply Now",
      href: "/apply-now",
    },
    {
      title: "Private Capital Solutions",
      description:
        "Custom structured financing for borrowers who need direct communication, practical terms, and efficient execution.",
      icon: "💼",
      cta: "Contact Us",
      href: "#contact",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Choose Your Path",
      description:
        "Submit a real estate deal or apply for business-purpose financing through the correct intake path.",
    },
    {
      step: "02",
      title: "Review & Structure",
      description:
        "We assess the numbers, collateral, timeline, and strategy to determine the right structure.",
    },
    {
      step: "03",
      title: "Receive Terms",
      description:
        "You get a clear proposal with straightforward expectations, requirements, and next steps.",
    },
    {
      step: "04",
      title: "Close & Fund",
      description:
        "Once approved, we move efficiently so you can close, execute, and keep momentum.",
    },
  ];

  const benefits = [
    "Direct access to decision-makers",
    "Fast, practical underwriting",
    "Flexible deal structuring",
    "Relationship-first lending approach",
    "Built for investors and business owners",
    "Professional, values-driven service",
  ];

  const faqs = [
    {
      q: "What types of deals does New Vine Capital consider?",
      a: "We focus on real estate transactions, business-purpose vehicle and equipment financing, and select private lending scenarios where speed and flexibility matter.",
    },
    {
      q: "How quickly can you review a request?",
      a: "Timing depends on complexity and documentation, but our process is designed to be direct and efficient so strong opportunities can move quickly.",
    },
    {
      q: "Do you work with investors and business owners?",
      a: "Yes. New Vine Capital is built to serve investors, operators, and entrepreneurs who need a funding partner that understands execution, structure, and speed.",
    },
    {
      q: "How do I know whether to submit a deal or apply now?",
      a: "Use Submit a New Deal for real estate and collateral-based opportunities. Use Apply Now for business lending products like fuel cards, equipment leasing, vehicle financing, and working capital.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4ead2]">
      <header className="sticky top-0 z-50 border-b border-[#8c6a2d]/25 bg-[#050505]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="New Vine Capital logo"
              width={56}
              height={56}
              className="h-14 w-14 object-contain"
            />
            <div>
              <div className="text-xl font-semibold tracking-[0.18em] text-[#d7bb74]">
                NEW VINE CAPITAL
              </div>
              <div className="text-xs uppercase tracking-[0.35em] text-[#9ba082]">
                Private Lending • Strategic Capital
              </div>
            </div>
          </Link>

          <nav className="hidden gap-8 text-sm text-[#d8cfb6] md:flex">
            <a href="#services" className="transition hover:text-[#d7bb74]">
              Services
            </a>
            <a href="#process" className="transition hover:text-[#d7bb74]">
              Process
            </a>
            <a href="#about" className="transition hover:text-[#d7bb74]">
              About
            </a>
            <a href="#faq" className="transition hover:text-[#d7bb74]">
              FAQ
            </a>
            <a href="#contact" className="transition hover:text-[#d7bb74]">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,187,116,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(83,101,68,0.18),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit rounded-full border border-[#8c6a2d]/40 bg-[#1b160d] px-4 py-2 text-sm text-[#d7bb74]">
              Capital built for execution
            </div>
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-[#f8f1de] md:text-6xl">
              Funding solutions built for real opportunities and serious borrowers.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#d2c9b3]">
              New Vine Capital provides flexible, relationship-driven financing for real estate,
              business assets, and private lending opportunities with clarity, speed, and
              practical deal structure.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/submit-deal"
                className="rounded-2xl bg-[#d7bb74] px-6 py-4 text-center text-sm font-semibold text-[#16120a] shadow-lg shadow-[#d7bb74]/20 transition hover:-translate-y-0.5 hover:bg-[#e5ca86]"
              >
                Submit a New Deal
              </Link>
              <Link
                href="/apply-now"
                className="rounded-2xl border border-[#8c6a2d]/35 bg-[#0f120d]/80 px-6 py-4 text-center text-sm font-semibold text-[#f4ead2] transition hover:bg-[#172015]"
              >
                Apply Now
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#8c6a2d]/25 bg-[#0d0d0b] p-4">
                <div className="text-2xl font-semibold text-[#d7bb74]">Fast</div>
                <div className="mt-1 text-sm text-[#c5bea9]">
                  Direct review and efficient decisions
                </div>
              </div>
              <div className="rounded-2xl border border-[#8c6a2d]/25 bg-[#0d0d0b] p-4">
                <div className="text-2xl font-semibold text-[#d7bb74]">Flexible</div>
                <div className="mt-1 text-sm text-[#c5bea9]">
                  Structured around real-world deals
                </div>
              </div>
              <div className="rounded-2xl border border-[#8c6a2d]/25 bg-[#0d0d0b] p-4">
                <div className="text-2xl font-semibold text-[#d7bb74]">Focused</div>
                <div className="mt-1 text-sm text-[#c5bea9]">
                  Built for investors and operators
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-[#8c6a2d]/25 bg-gradient-to-br from-[#11110d] to-[#17140f] p-6 shadow-2xl shadow-black/40">
              <div className="rounded-[1.5rem] border border-[#8c6a2d]/20 bg-[#090909] p-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm uppercase tracking-[0.25em] text-[#9ba082]">
                      New Vine Capital
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-[#f8f1de]">
                      Strategic Private Funding
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[#8c6a2d]/35 bg-[#1b160d] px-4 py-2 text-sm font-medium text-[#d7bb74]">
                    Direct Lending
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-[#8c6a2d]/20 bg-[#0f120d] p-5">
                    <div className="text-sm text-[#9ba082]">Primary Focus</div>
                    <div className="mt-2 text-lg font-medium text-[#f4ead2]">
                      Real Estate, Business Assets, Vehicles, Equipment, and Special Opportunity Lending
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[#8c6a2d]/20 bg-[#0d0d0b] p-5">
                      <div className="text-sm text-[#9ba082]">Approach</div>
                      <div className="mt-2 text-base font-medium text-[#f4ead2]">
                        Relationship-first, numbers-driven
                      </div>
                    </div>
                    <div className="rounded-2xl border border-[#8c6a2d]/20 bg-[#0d0d0b] p-5">
                      <div className="text-sm text-[#9ba082]">Commitment</div>
                      <div className="mt-2 text-base font-medium text-[#f4ead2]">
                        Clear communication and practical terms
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#8c6a2d]/25 bg-[#1a2117] p-5 text-[#efe5cf]">
                    New Vine Capital is positioned as a professional funding partner for borrowers
                    who value speed, structure, and direct communication.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-sm uppercase tracking-[0.25em] text-[#d7bb74]">Services</div>
          <h2 className="mt-3 text-3xl font-semibold text-[#f8f1de] md:text-4xl">
            Capital solutions designed to move deals forward.
          </h2>
          <p className="mt-4 text-[#c5bea9]">
            We work with opportunities that require more than a generic lending process. Our focus
            is responsiveness, structure, and fit.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-[1.75rem] border border-[#8c6a2d]/20 bg-[#0d0d0b] p-7 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:bg-[#13130f]"
            >
              <div className="text-4xl">{service.icon}</div>
              <h3 className="mt-5 text-xl font-semibold text-[#f4ead2]">{service.title}</h3>
              <p className="mt-3 leading-7 text-[#c5bea9]">{service.description}</p>
              <Link
                href={service.href}
                className="mt-6 inline-flex rounded-xl border border-[#8c6a2d]/30 bg-[#1a2117] px-4 py-3 text-sm font-semibold text-[#d7bb74] transition hover:bg-[#232d1f]"
              >
                {service.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="process" className="border-y border-[#8c6a2d]/15 bg-[#0a0a08]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-sm uppercase tracking-[0.25em] text-[#d7bb74]">Process</div>
            <h2 className="mt-3 text-3xl font-semibold text-[#f8f1de] md:text-4xl">
              A straightforward path from inquiry to funding.
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((item) => (
              <div
                key={item.step}
                className="rounded-[1.75rem] border border-[#8c6a2d]/20 bg-[#10100d] p-6"
              >
                <div className="text-sm font-semibold tracking-[0.25em] text-[#d7bb74]">
                  {item.step}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-[#f4ead2]">{item.title}</h3>
                <p className="mt-3 leading-7 text-[#c5bea9]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="text-sm uppercase tracking-[0.25em] text-[#d7bb74]">About</div>
            <h2 className="mt-3 text-3xl font-semibold text-[#f8f1de] md:text-4xl">
              A values-driven capital company with a practical business mindset.
            </h2>
            <p className="mt-6 max-w-3xl leading-8 text-[#c5bea9]">
              New Vine Capital is a Colorado-based financing company built around relationship
              capital, disciplined underwriting, and direct communication. We believe capital
              should help strong opportunities move, not slow them down with unnecessary friction.
            </p>
            <p className="mt-4 max-w-3xl leading-8 text-[#c5bea9]">
              Our approach is simple: understand the opportunity, structure the deal clearly, and
              operate with integrity from first contact to closing. Whether the need is tied to real
              estate, business assets, or private lending, we aim to provide a professional and
              dependable experience.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#8c6a2d]/20 bg-gradient-to-br from-[#1a2117] to-[#0d0d0b] p-8">
            <h3 className="text-2xl font-semibold text-[#f8f1de]">Why borrowers work with us</h3>
            <div className="mt-6 grid gap-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="rounded-2xl border border-[#8c6a2d]/20 bg-[#090909]/80 px-4 py-4 text-[#e7dcc2]"
                >
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="border-y border-[#8c6a2d]/15 bg-[#0a0a08]">
        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <div className="text-sm uppercase tracking-[0.25em] text-[#d7bb74]">FAQ</div>
            <h2 className="mt-3 text-3xl font-semibold text-[#f8f1de] md:text-4xl">
              Common questions
            </h2>
          </div>
          <div className="mt-10 space-y-5">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-[1.5rem] border border-[#8c6a2d]/20 bg-[#10100d] p-6"
              >
                <h3 className="text-lg font-semibold text-[#f4ead2]">{faq.q}</h3>
                <p className="mt-3 leading-7 text-[#c5bea9]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-[#8c6a2d]/20 bg-[#0d0d0b] p-8">
            <div className="text-sm uppercase tracking-[0.25em] text-[#d7bb74]">Contact</div>
            <h2 className="mt-3 text-3xl font-semibold text-[#f8f1de]">Let’s talk about your deal.</h2>
            <p className="mt-4 leading-8 text-[#c5bea9]">
              Use this site as the front door for deal submissions, borrower inquiries, and
              investor conversations.
            </p>

            <div className="mt-8 space-y-5 text-[#f0e6cf]">
              <div>
                <div className="text-sm text-[#9ba082]">Email</div>
                <a
                  href="mailto:deals@newvinecapital.com"
                  className="mt-1 block font-medium transition hover:text-[#d7bb74]"
                >
                  deals@newvinecapital.com
                </a>
              </div>
              <div>
                <div className="text-sm text-[#9ba082]">Phone</div>
                <a
                  href="tel:7208174277"
                  className="mt-1 block font-medium transition hover:text-[#d7bb74]"
                >
                  720-817-4277
                </a>
              </div>
              <div>
                <div className="text-sm text-[#9ba082]">Address</div>
                <div className="mt-1 font-medium">
                  1500 N Grant St #7339
                  <br />
                  Denver, CO 80203
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#8c6a2d]/20 bg-[#10100d] p-8 shadow-2xl shadow-black/20">
            <h3 className="text-2xl font-semibold text-[#f8f1de]">Choose Your Starting Point</h3>
            <p className="mt-3 text-[#c5bea9]">
              Select the path that fits your request. Real estate opportunities go through deal
              submission. Other lending products begin with an application.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link
                href="/submit-deal"
                className="rounded-2xl border border-[#8c6a2d]/25 bg-[#1a2117] p-5 transition hover:bg-[#232d1f]"
              >
                <div className="text-lg font-semibold text-[#f4ead2]">Submit a New Deal</div>
                <div className="mt-2 text-sm leading-6 text-[#c5bea9]">
                  Real estate deals, acquisitions, refinance scenarios, bridge requests, and
                  collateral-based opportunities.
                </div>
              </Link>

              <Link
                href="/apply-now"
                className="rounded-2xl border border-[#8c6a2d]/25 bg-[#0a0a08] p-5 transition hover:bg-[#141411]"
              >
                <div className="text-lg font-semibold text-[#f4ead2]">Apply Now</div>
                <div className="mt-2 text-sm leading-6 text-[#c5bea9]">
                  Fuel cards, equipment leasing, vehicle financing, working capital, and other
                  business lending solutions.
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#8c6a2d]/15 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="New Vine Capital logo"
                width={42}
                height={42}
                className="h-10 w-10 object-contain"
              />
              <div>
                <div className="text-sm font-semibold tracking-[0.18em] text-[#d7bb74]">
                  NEW VINE CAPITAL
                </div>
                <div className="text-xs text-[#9f9a89]">
                  Private Lending • Strategic Capital
                </div>
              </div>
            </div>

            <div className="text-sm text-[#9f9a89]">
              deals@newvinecapital.com • 720-817-4277 • 1500 N Grant St #7339 Denver, CO 80203
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
