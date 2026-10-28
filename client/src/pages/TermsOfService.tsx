import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Truck,
  RotateCcw,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = "Terms of Service | Cup O’ Cake";
  }, []);

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
            <FileText className="h-3.5 w-3.5" /> Legal & Compliance
          </span>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Welcome to Cup O’ Cake. These terms outline how orders, payments, fulfillment, and customer communications operate when you purchase from our bakery website.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Effective Date: October 2026
          </p>
        </div>

        {/* Terms Sections */}
        <div className="mt-12 max-w-4xl space-y-10">
          {/* Section 1 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">1</span>
              Business Identity & Overview
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                These Terms of Service govern the relationship between you (the customer) and <strong className="text-foreground">Cup O’ Cake</strong>, a registered sole proprietorship bakery operating in the Republic of Ghana.
              </p>
              <ul className="space-y-1.5 pt-1 text-foreground font-medium">
                <li>• <strong>Business Name:</strong> Cup O’ Cake</li>
                <li>• <strong>Principal Location:</strong> Evandy Hostel (Annex), Ayeduase, near KNUST, Kumasi, Ashanti Region, Ghana</li>
                <li>• <strong>Contact Phone / WhatsApp:</strong> +233 55 174 5309 | +233 50 213 5186</li>
                <li>• <strong>Contact Email:</strong> cupocake6@gmail.com</li>
                <li>• <strong>Website:</strong> https://www.cup-o-cake.com/</li>
              </ul>
              <p>
                By accessing our website, adding products to your cart, and placing an order, you agree to comply with and be bound by these terms.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">2</span>
              Product Descriptions, Imagery, & Customisation
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Cup O’ Cake specializes in handcrafted celebration cakes, cupcakes, cake parfaits, and custom dessert boxes.
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong className="text-foreground">Artisanal Nature:</strong> Because every cake and cupcake is hand-baked and hand-piped, slight visual variations in frosting texture, color shade, floral placement, or decorative arrangement may occur compared to display photographs.
                </li>
                <li>
                  <strong className="text-foreground">Product Availability:</strong> All offerings are subject to kitchen capacity and ingredient availability. In the rare event that an ingredient, flavor, or packaging element is unavailable, we will contact you immediately to propose an equivalent substitute or offer an order adjustment.
                </li>
                <li>
                  <strong className="text-foreground">Allergens & Dietary Information:</strong> Our products may contain flour (gluten), dairy (milk, butter, cream), eggs, and traces of nuts. If you have specific dietary requirements or food allergies, please notify us before placing your order.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">3</span>
              Pricing & Delivery Charges
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                All prices on the Cup O’ Cake website are quoted in <strong className="text-foreground">Ghana Cedis (GH₵)</strong>. We reserve the right to revise prices when necessary, but any price changes will not affect orders that have already been confirmed and paid.
              </p>
              <p>
                <strong className="text-foreground">Delivery Fees:</strong> The prices listed on our menu and at checkout represent the baked goods subtotal. Delivery charges are calculated and billed separately based on your delivery drop-off location in Kumasi, as outlined in our <Link to="/delivery-policy" className="text-primary font-semibold underline underline-offset-2">Delivery Policy</Link>. Delivery charges must be settled prior to or upon courier dispatch as agreed with our team.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">4</span>
              Order Placement, Payment Authorisation, & Order Confirmation
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Submitting an order through our checkout constitutes an offer to purchase. An order is not formally accepted or scheduled for production until:
              </p>
              <ol className="space-y-1.5 list-decimal list-inside pl-1">
                <li>All required recipient and delivery details are accurately provided;</li>
                <li>Your payment is verified and confirmed by our payment provider, Paystack; and</li>
                <li>A confirmed order reference is generated by our system.</li>
              </ol>
              <p>
                Online payments are processed securely through <strong className="text-foreground">Paystack</strong> via Ghana Mobile Money (MTN MoMo, Telecel Cash, and AirtelTigo Money). You will receive an SMS and/or on-screen confirmation once your transaction has been verified.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">5</span>
              Custom Cake Orders & Design Approvals
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                For custom bakes, tiered wedding cakes, and personalized celebrations:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Design specifications, flavor choices, size requirements, inscriptions, and target fulfillment timing must be communicated and mutually agreed in writing (e.g. via WhatsApp or email).</li>
                <li>Custom orders require at least <strong className="text-foreground">48 to 72 hours</strong> advance booking to allow for sourcing specialized cake boards, toppers, and decorative materials.</li>
                <li>Once the design is agreed upon and payment is confirmed, changes to design concepts or colors may incur additional fees if materials or preparation steps have already been executed.</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">6</span>
              Customer Responsibilities for Contact & Delivery
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                You are responsible for ensuring that all information submitted during checkout is complete and accurate, including:
              </p>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Recipient name and an active phone number accessible for calls and SMS/WhatsApp;</li>
                <li>Clear delivery address, hostel name, room number, or landmark within our coverage area;</li>
                <li>Preferred delivery date and recipient availability during our regular dispatch window (after 5:00 PM).</li>
              </ul>
              <p>
                Cup O’ Cake is not liable for delayed or failed handovers resulting from incorrect phone numbers, unanswered calls to the recipient, or inaccessible premises.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">7</span>
              Modifications, Cancellations, & Complaints
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                If you need to change your delivery details, delivery date, or cancel an order, contact us immediately at <strong className="text-foreground">+233 55 174 5309</strong>. Because baking schedules begin well in advance of dispatch, all cancellations and returns are subject to our <Link to="/refund-policy" className="text-primary font-semibold underline underline-offset-2">Refund Policy</Link>.
              </p>
              <p>
                If you have a complaint regarding a damaged, missing, or incorrect item, please notify us within <strong className="text-foreground">2 hours of delivery</strong> with clear photo evidence so that our team can investigate and reach a fair resolution.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">8</span>
              Reasonable Limitations & Operational Disruptions
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                While we strive to provide a seamless customer experience, Cup O’ Cake shall not be held liable for fulfillment delays or service interruptions resulting from events beyond our reasonable control (force majeure). These events include severe weather conditions, road closures, telecommunication or mobile money network blackouts, or supplier ingredient shortages.
              </p>
              <p>
                In any such situation, we will communicate transparently with you and offer either a rescheduled delivery or a fair refund in accordance with consumer rights under Ghanaian law.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">9</span>
              Updates to Terms & Contact Information
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                We may periodically update these Terms of Service to reflect operational, legal, or regulatory adjustments. Updated versions will be published on this page with an updated revision date.
              </p>
              <p>
                For questions regarding these terms, please contact:
              </p>
              <div className="mt-3 rounded-2xl bg-secondary/50 p-4 text-xs text-muted-foreground sm:text-sm">
                <p><strong>Cup O’ Cake Bakery</strong></p>
                <p>Evandy Hostel (Annex), Ayeduase, near KNUST, Kumasi, Ghana</p>
                <p>Phone: +233 55 174 5309 | Email: cupocake6@gmail.com</p>
              </div>
            </div>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default TermsOfService;

