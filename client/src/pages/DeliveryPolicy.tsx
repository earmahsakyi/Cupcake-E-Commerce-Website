import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Truck,
  ArrowLeft,
  MapPin,
  Clock,
  AlertCircle,
  Phone,
  CheckCircle2,
  Calendar,
  ShieldAlert,
  FileText,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DeliveryPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = "Delivery Policy | Cup O’ Cake";
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

        {/* Page Header */}
        <div className="mt-6 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-1.5 text-xs font-semibold text-primary">
            <Truck className="h-3.5 w-3.5" /> Fulfilment & Shipping
          </span>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            Delivery Policy
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Cup O’ Cake prepares all cakes and baked treats fresh to order. Please review how we handle preparation, delivery scheduling, fees, and handover across Kumasi and surrounding areas.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Last updated: October 2026
          </p>
        </div>

        {/* Quick Highlights Grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl">
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-serif text-base font-semibold text-foreground">Kitchen Location</h3>
            <p className="mt-1 text-xs text-muted-foreground">Ayeduase, near KNUST, Kumasi, Ashanti Region, Ghana.</p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-serif text-base font-semibold text-foreground">Dispatch Window</h3>
            <p className="mt-1 text-xs text-muted-foreground">Daily dispatches typically go out after 5:00 PM (Tue–Sun).</p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-serif text-base font-semibold text-foreground">Pre-Order Basis</h3>
            <p className="mt-1 text-xs text-muted-foreground">Baked fresh to order. Custom celebration cakes need 48–72h notice.</p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Truck className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-serif text-base font-semibold text-foreground">Delivery Fees</h3>
            <p className="mt-1 text-xs text-muted-foreground">Calculated based on delivery drop-off location in Kumasi.</p>
          </div>
        </div>

        {/* Main Policy Content Sections */}
        <div className="mt-12 max-w-4xl space-y-10">
          {/* Section 1 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">1</span>
              Kitchen Base & Verified Delivery Coverage
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Cup O’ Cake operates its baking kitchen from <strong className="text-foreground">Evandy Hostel (Annex), Ayeduase, near KNUST, Kumasi, Ghana</strong>. Because our cakes, cupcakes, and parfaits are delicate and freshly iced, we manage delivery carefully using trusted local courier services and dispatch riders.
              </p>
              <p>
                Our verified regular delivery coverage includes:
              </p>
              <ul className="grid gap-2 sm:grid-cols-2 text-foreground font-medium pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  Ayeduase & KNUST Campus (All Hostels & Halls)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  Kotei, Boadi & Emena
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  Kentinkrono, Oforikrom & Anwomaso
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  Wider Kumasi Metropolitan Environs (arranged by request)
                </li>
              </ul>
              <div className="mt-4 rounded-2xl bg-secondary/50 p-4 text-xs text-muted-foreground sm:text-sm">
                <p>
                  <strong>Deliveries outside Kumasi:</strong> For locations outside the immediate Kumasi metropolitan area, customers must contact Cup O’ Cake before placing an order to confirm courier feasibility, transit safety for fragile cakes, and specific delivery charges.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">2</span>
              How Delivery Fees are Handled
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                The total amount calculated and paid during website checkout represents the cost of your selected baked items. As clearly notified on our checkout page, <strong className="text-foreground">delivery comes at an extra cost</strong>.
              </p>
              <p>
                Delivery fees are calculated based on the distance between our Ayeduase kitchen and your delivery drop-off point, as well as the courier method required (e.g. bike dispatch for cupcakes vs. car dispatch for large tiered cakes).
              </p>
              <p>
                Before dispatch, Cup O’ Cake communicates the applicable delivery charge and handover details directly with you via phone or WhatsApp. Alternatively, you may opt to arrange your own courier pickup or pick up your order in person at no extra cost.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">3</span>
              Operating Hours & Preparation Times
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                We bake on a pre-order schedule to ensure that every cake is fresh, flavorful, and structurally intact.
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong className="text-foreground">Working Days:</strong> Tuesday through Sunday. We are closed on Mondays.
                </li>
                <li>
                  <strong className="text-foreground">Daily Delivery Window:</strong> Standard pre-order deliveries go out in the late afternoon/evening, typically <strong className="text-foreground">after 5:00 PM</strong>, once the day’s baking and setting processes are complete.
                </li>
                <li>
                  <strong className="text-foreground">Standard Cake Orders:</strong> Must be placed at least 24 hours in advance to secure your baking slot.
                </li>
                <li>
                  <strong className="text-foreground">Custom & Wedding Cakes:</strong> Must be ordered at least <strong className="text-foreground">48 to 72 hours</strong> in advance to allow adequate time for bespoke design work, custom toppers, and structure stabilization.
                </li>
                <li>
                  <strong className="text-foreground">Sundays:</strong> We do not take same-day orders on Sundays. All Sunday deliveries must be pre-ordered and confirmed by Saturday.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">4</span>
              Customer Responsibilities: Contact & Address Accuracy
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Cakes are delicate, perishable items requiring immediate handover. To guarantee smooth delivery, customers must:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Provide a valid, active phone number that is reachable via voice call and WhatsApp during the delivery window.</li>
                <li>Provide accurate delivery directions, including hostel name, room/block number, landmark, street name, or gate description.</li>
                <li>Ensure that the recipient (or a designated representative) is available at the specified location when the courier arrives.</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">5</span>
              Unreachable Recipients & Inaccurate Addresses
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                When our courier reaches your delivery destination, they will call the contact number provided. The courier will wait up to 15 minutes while attempting to establish contact.
              </p>
              <p>
                If the recipient cannot be reached or the delivery address provided is incorrect or inaccessible:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>The courier will return the cake to our Ayeduase kitchen to prevent heat damage or spoilage.</li>
                <li>The customer will be notified via phone, WhatsApp, or email.</li>
                <li>Any subsequent redelivery attempt will incur an additional courier delivery fee payable prior to re-dispatch.</li>
                <li>Because freshly baked items have limited shelf lives, perishable goods cannot be held indefinitely. Orders not claimed within 24 hours of scheduled fulfillment may be disposed of without refund.</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">6</span>
              Changes in Delivery Schedule or Weather Disruption
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                In the rare event that adverse weather (such as heavy rainfall), traffic conditions, or unexpected logistical disruptions affect our dispatch schedule, Cup O’ Cake will contact you immediately to provide updated timing estimates or coordinate alternate handover arrangements.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground sm:text-2xl">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">7</span>
              Reporting Delayed, Damaged, or Incorrect Deliveries
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Please inspect your order immediately upon arrival before the courier departs.
              </p>
              <p>
                If your cake or baked treats arrive damaged, defective, or incorrect, you must report the issue to us within <strong className="text-foreground">2 hours of delivery</strong>. To help us resolve the matter quickly, please provide:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Your Order Reference Number and recipient name.</li>
                <li>Clear photographs showing the exterior box and the condition of the damaged item.</li>
                <li>A brief description of what was damaged or missing.</li>
              </ul>
              <p>
                All complaints will be reviewed promptly and handled under our published <Link to="/refund-policy" className="text-primary font-semibold underline underline-offset-2 hover:text-primary/80">Refund Policy</Link>.
              </p>
            </div>
          </section>

          {/* Contact Box */}
          <div className="rounded-3xl bg-secondary/40 p-6 border border-border/70 sm:p-8">
            <h3 className="font-serif text-lg font-semibold text-foreground sm:text-xl">
              Questions About Your Delivery?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              If you have special delivery instructions or need to update your address before dispatch, reach out right away:
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
              <a href="tel:+233551745309" className="inline-flex items-center gap-2 text-foreground hover:text-primary">
                <Phone className="h-4 w-4 text-primary" /> +233 55 174 5309
              </a>
              <a href="mailto:cupocake6@gmail.com" className="inline-flex items-center gap-2 text-foreground hover:text-primary">
                <FileText className="h-4 w-4 text-primary" /> cupocake6@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default DeliveryPolicy;

