import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  ChevronDown,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ShoppingBag,
  CreditCard,
  Truck,
  RotateCcw,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
  category: "ordering" | "payment" | "delivery" | "refunds";
}

const faqs: FAQItem[] = [
  {
    category: "ordering",
    question: "What does Cup O’ Cake sell?",
    answer:
      "Cup O’ Cake offers handcrafted cakes, cupcakes, cake parfaits, gift boxes, and custom cakes for birthdays, celebrations, anniversaries, and other special occasions. All our baked goods are prepared fresh in Ayeduase, near KNUST, Kumasi. Product descriptions, available sizes, flavor selections, and starting prices are displayed on our website.",
  },
  {
    category: "ordering",
    question: "How do I place an order?",
    answer:
      "Browse our available products on the homepage or menu section, choose your preferred cake or cupcakes, select your size, flavor combinations, and any custom notes, then add them to your cart. Proceed to checkout where you will provide your recipient details, delivery address, preferred delivery date, and complete your secure payment. For bespoke celebration cakes requiring special design arrangements, you can also reach us directly via WhatsApp or phone.",
  },
  {
    category: "ordering",
    question: "Do you accept custom cake orders?",
    answer:
      "Yes! We love creating custom cakes tailored to your theme, color palette, and flavor preferences. Because custom designs require dedicated planning and specialized hand-piped decorating, please contact our team at least 48 to 72 hours in advance. Design specifications, sizes, prices, and fulfillment timing must be agreed upon before your order is finalized.",
  },
  {
    category: "ordering",
    question: "What are your working days and operating hours?",
    answer:
      "We operate from Tuesday to Sunday. We are closed on Mondays for kitchen maintenance and ingredient sourcing. Please note that we work on a pre-order basis to ensure maximum freshness: regular delivery dispatches go out after 5:00 PM on operational days. We do not accept same-day orders on Sundays.",
  },
  {
    category: "payment",
    question: "How can I pay for my order?",
    answer:
      "We accept secure Mobile Money payments (MTN MoMo, Telecel Cash, and AirtelTigo Money) powered by Paystack. During checkout, you can select your mobile network and enter your phone number. You will receive an authorization prompt or OTP on your handset to approve the transaction. An order is confirmed once payment verification is successfully received from Paystack.",
  },
  {
    category: "payment",
    question: "Is online payment safe and secure?",
    answer:
      "Yes. All online transactions are encrypted and processed by Paystack, a certified and regulated payment processor. Cup O’ Cake does not store your Mobile Money PIN, banking passwords, or payment credentials on our servers.",
  },
  {
    category: "payment",
    question: "How do delivery fees work?",
    answer:
      "The amount charged at checkout covers the subtotal for your baked products. Delivery comes at an extra cost based on your specific location in Kumasi. The exact delivery fee and courier handover arrangements will be communicated and confirmed before your order is dispatched.",
  },
  {
    category: "delivery",
    question: "Where do you deliver?",
    answer:
      "Cup O’ Cake is located in Ayeduase, near KNUST, Kumasi, Ghana. We regularly deliver across Ayeduase, the KNUST campus, Kotei, Kentinkrono, Boadi, Oforikrom, and throughout the Kumasi metropolitan area. If your delivery destination is outside these areas, please contact our team before ordering to verify courier availability and applicable delivery rates.",
  },
  {
    category: "delivery",
    question: "How long does delivery take?",
    answer:
      "Because our products are handcrafted fresh to order, we fulfill orders based on scheduled pre-orders. Standard daily orders are dispatched during our afternoon fulfillment window (typically after 5:00 PM). Custom multi-tier or detailed celebration cakes require 48–72 hours advance notice. We do not offer unconfirmed instant or 24-hour delivery.",
  },
  {
    category: "delivery",
    question: "Can I pick up my order in person?",
    answer:
      "Yes. In-person pickups can be arranged from our kitchen location at Evandy Hostel (Annex), Ayeduase, near KNUST. If you prefer to pick up your order yourself, please indicate this in your order notes at checkout or contact us on WhatsApp so we can have your package ready.",
  },
  {
    category: "refunds",
    question: "Can I cancel or change an order?",
    answer:
      "If you need to make changes or cancel an order, please contact us immediately via phone or WhatsApp at +233 55 174 5309. Because bakery items are perishable and preparation often begins hours before dispatch, modifications and cancellations depend on how far along your order is in production. All requests are handled in accordance with our published Refund Policy.",
  },
  {
    category: "refunds",
    question: "What if my order arrives damaged or incorrect?",
    answer:
      "We take great care in packaging and handling your bakes. However, if your order arrives damaged or differs from what was confirmed, please notify us immediately upon delivery (within 2 hours of receipt). Provide your order reference number and clear photographs of the product and packaging. We will promptly investigate and resolve the issue under our Refund Policy.",
  },
  {
    category: "refunds",
    question: "How do I contact Cup O’ Cake?",
    answer:
      "You can reach us through multiple channels: by phone or WhatsApp at +233 55 174 5309 or +233 50 213 5186, by email at cupocake6@gmail.com, or through our verified social media channels. We are always happy to assist with your order questions.",
  },
];

const categoryTabs = [
  { id: "all", label: "All Questions", icon: HelpCircle },
  { id: "ordering", label: "Ordering & Custom Bakes", icon: ShoppingBag },
  { id: "payment", label: "Payments & Fees", icon: CreditCard },
  { id: "delivery", label: "Delivery & Pickup", icon: Truck },
  { id: "refunds", label: "Cancellations & Refunds", icon: RotateCcw },
] as const;

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = "Frequently Asked Questions (FAQ) | Cup O’ Cake";
  }, []);

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredFaqs =
    activeCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="container pt-28 pb-16 sm:pt-32 sm:pb-24">
        {/* Breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        {/* Header */}
        <div className="mt-6 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Help & Support
          </span>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Have questions about ordering our cakes, delivery around KNUST and Kumasi, or Mobile Money payments? Here is everything you need to know about Cup O’ Cake.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-8 flex flex-wrap gap-2 sm:gap-3">
          {categoryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
                  isActive
                    ? "bg-gradient-primary text-primary-foreground shadow-soft"
                    : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-8 space-y-4 max-w-4xl">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndices.includes(index);
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-card transition-shadow hover:shadow-soft"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-serif text-base font-semibold text-foreground sm:p-6 sm:text-lg"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <div
                    className={`grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-primary-soft text-primary transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="border-t border-border/50 px-5 pt-3 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-6 sm:text-base">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Direct Contact Callout */}
        <div className="mt-14 max-w-4xl rounded-3xl bg-gradient-warm p-7 border border-border/60 shadow-card sm:p-10">
          <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Still have questions?</span>
              <h2 className="mt-1 font-serif text-2xl font-semibold text-foreground sm:text-3xl">
                We’re here to help!
              </h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                If your question isn’t answered above or you would like to discuss a custom cake for an upcoming celebration, get in touch with our team directly.
              </p>
            </div>
            <div className="space-y-3 text-sm">
              <a
                href="tel:+233551745309"
                className="flex items-center gap-3 rounded-2xl bg-card p-3 text-foreground shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Call or WhatsApp</p>
                  <p className="font-semibold">+233 55 174 5309</p>
                </div>
              </a>
              <a
                href="mailto:cupocake6@gmail.com"
                className="flex items-center gap-3 rounded-2xl bg-card p-3 text-foreground shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email Us</p>
                  <p className="font-semibold">cupocake6@gmail.com</p>
                </div>
              </a>
              <div className="flex items-center gap-3 rounded-2xl bg-card p-3 text-foreground shadow-sm">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Bakery Location</p>
                  <p className="font-semibold">Evandy Hostel Annex, Ayeduase, KNUST</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default FAQ;

