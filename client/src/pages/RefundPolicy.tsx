import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  CreditCard,
  Phone,
  Mail,
  ShieldCheck,
  FileQuestion,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = "Refund & Cancellation Policy | Cup O’ Cake";
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
            <RotateCcw className="h-3.5 w-3.5" /> Customer Protection & Returns
          </span>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            Refund & Cancellation Policy
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            At Cup O’ Cake, we want every celebration to be joyful and memorable. Because our cakes and cupcakes are perishable food products baked fresh to order, please review how cancellations, damages, and refunds are handled.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Last updated: October 2026
          </p>
        </div>

        {/* Highlights Cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3 max-w-4xl">
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-serif text-base font-semibold text-foreground">Report Within 2 Hours</h3>
            <p className="mt-1 text-xs text-muted-foreground">Perishable goods require timely notice and photo evidence upon delivery.</p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-serif text-base font-semibold text-foreground">Fair Case Assessment</h3>
            <p className="mt-1 text-xs text-muted-foreground">Damaged, missing, or incorrect bakes are reviewed fairly for replacement or refund.</p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <CreditCard className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-serif text-base font-semibold text-foreground">Paystack Refund Routing</h3>
            <p className="mt-1 text-xs text-muted-foreground">Approved refunds are credited back to the original Mobile Money account.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-12 max-w-4xl space-y-10">
          {/* Section 1 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">1</span>
              How to Contact Us Regarding an Issue
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                If you encounter any problem with your order, contact our team immediately:
              </p>
              <ul className="space-y-1.5 list-disc list-inside">
                <li><strong className="text-foreground">Phone / WhatsApp:</strong> +233 55 174 5309 or +233 50 213 5186 (fastest channel)</li>
                <li><strong className="text-foreground">Email:</strong> cupocake6@gmail.com</li>
              </ul>
              <p>
                Please have the following details ready when reaching out:
              </p>
              <ul className="space-y-1.5 list-disc list-inside pl-1 text-foreground font-medium">
                <li>Your Order Reference Number (provided on your confirmation screen or SMS);</li>
                <li>The customer name and phone number used at checkout;</li>
                <li>A clear description of the issue (e.g. incorrect flavor, damaged frosting, missing box items);</li>
                <li>Clear photographs of the delivered product, including the packaging box.</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">2</span>
              Damaged, Incorrect, or Missing Items
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Because our items are food products, please inspect your delivery immediately upon arrival.
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong className="text-foreground">Courier Damage:</strong> If a cake arrives structurally collapsed or significantly damaged due to transit handling by our arranged courier, report it within <strong className="text-foreground">2 hours of delivery</strong>. We will review the photos and, depending on the severity, offer an immediate fresh replacement (if time permits for your event), a store credit, or a partial or full refund.
                </li>
                <li>
                  <strong className="text-foreground">Incorrect Item or Flavor:</strong> If the items delivered do not match the product or flavor options confirmed in your order, contact us immediately. If we cannot deliver the correct item in time, you will receive a full refund or compensation for the affected item.
                </li>
                <li>
                  <strong className="text-foreground">Missing Items:</strong> If any part of your order is missing upon delivery, we will either arrange immediate dispatch of the missing item or issue a prompt refund for the missing portion.
                </li>
              </ul>
              <div className="mt-3 rounded-2xl bg-secondary/50 p-4 text-xs text-muted-foreground sm:text-sm">
                <p>
                  <strong>Customer Care Note:</strong> Minor cosmetic imperfections resulting from the delicate nature of hand-piped frosting during normal transit do not constitute structural damage, but we always listen and strive to make things right.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">3</span>
              Order Cancellations
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Cancellations are assessed based on the production stage of your order at the time the cancellation request is received:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong className="text-foreground">Before Baking / Preparation Commences:</strong> If you cancel your order before ingredients have been prepared or baking has started (typically at least 24 hours prior to scheduled dispatch), you will be eligible for a full refund or the option to reschedule your delivery date without fee.
                </li>
                <li>
                  <strong className="text-foreground">After Baking / Decorating Has Begun:</strong> Because our bakes cannot be reused or resold once personalized and prepared, orders cancelled on the day of delivery after baking or decorating has commenced cannot be refunded in full. A partial refund or credit may be offered at our discretion to cover only the unexpended delivery or non-perishable components.
                </li>
                <li>
                  <strong className="text-foreground">Dispatched Orders:</strong> Once an order is with the courier for delivery, it cannot be cancelled or refunded.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">4</span>
              Custom Cake Orders & Special Agreements
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Custom cakes involve bespoke sourcing of toppers, customized boards, tiered support dowels, and dedicated baker time.
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Cancellations made <strong className="text-foreground">more than 48 hours</strong> prior to the agreed fulfillment date may receive a refund less any non-recoverable costs incurred for bespoke materials already procured.</li>
                <li>Cancellations made <strong className="text-foreground">within 24 hours</strong> of the agreed fulfillment date are non-refundable, as the cake has already been baked and decorated specifically for your event.</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">5</span>
              How Approved Refunds are Processed
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                When a refund is approved by Cup O’ Cake:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong className="text-foreground">Original Payment Method:</strong> Refunds are initiated through our payment processor, Paystack, directly back to the original Mobile Money wallet (MTN MoMo, Telecel Cash, or AirtelTigo Money) used during checkout.
                </li>
                <li>
                  <strong className="text-foreground">Processing Timeframe:</strong> Once initiated by Cup O’ Cake, Paystack and the corresponding telecom network typically process the credit within <strong className="text-foreground">1 to 5 business days</strong>. The exact time required for the funds to reflect in your wallet depends on your mobile network provider’s processing cycle.
                </li>
                <li>
                  <strong className="text-foreground">No Cash or Third-Party Diversion:</strong> For compliance and anti-fraud protection, refunds cannot be paid out in cash or directed to a different phone number without verified written authorization from the original account holder.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">6</span>
              Consumer Rights Under Ghanaian Law
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Nothing in this policy is intended to limit or exclude any statutory rights you may hold as a consumer under applicable consumer protection legislation in the Republic of Ghana. We are committed to resolving customer issues honestly, transparently, and fairly.
              </p>
            </div>
          </section>

          {/* Support Box */}
          <div className="rounded-3xl bg-secondary/40 p-6 border border-border/70 sm:p-8">
            <h3 className="font-serif text-lg font-semibold text-foreground sm:text-xl">
              Need Assistance with an Order or Refund?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Our customer team is available Tuesday to Sunday to assist you. Have your order reference ready for immediate support.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
              <a href="tel:+233551745309" className="inline-flex items-center gap-2 text-foreground hover:text-primary">
                <Phone className="h-4 w-4 text-primary" /> +233 55 174 5309
              </a>
              <a href="mailto:cupocake6@gmail.com" className="inline-flex items-center gap-2 text-foreground hover:text-primary">
                <Mail className="h-4 w-4 text-primary" /> cupocake6@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default RefundPolicy;

