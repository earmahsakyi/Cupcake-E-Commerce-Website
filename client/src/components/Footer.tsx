import { Cake, Instagram, Phone, Mail, MapPin, Clock, HelpCircle, FileText, Truck, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { FaSnapchat, FaWhatsapp, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="container py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-soft">
                <Cake className="h-5 w-5" />
              </span>
              <span className="font-serif text-xl font-semibold text-foreground">Cup O' Cake</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Handcrafted cupcakes, celebration cakes, cake parfaits & custom bakes. Baked fresh to order in Ayeduase, near KNUST, Kumasi, Ghana.
            </p>

            <div className="mt-6">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-foreground">Follow Our Bakes</h5>
              <div className="mt-3 flex gap-2.5">
                <a
                  href="https://www.instagram.com/cupocake6/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Cup O' Cake on Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground shadow-sm"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://www.tiktok.com/@cupocake2"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Cup O' Cake on TikTok"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground shadow-sm"
                >
                  <FaTiktok className="h-4 w-4" />
                </a>
                <a
                  href="https://wa.me/233551745309"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with Cup O' Cake on WhatsApp"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground shadow-sm"
                >
                  <FaWhatsapp className="h-4 w-4" />
                </a>
                <a
                  href="https://www.snapchat.com/add/cupocake6"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Cup O' Cake on Snapchat"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground shadow-sm"
                >
                  <FaSnapchat className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 className="font-serif text-base font-semibold text-foreground">Customer Support & Policies</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/faq"
                  className="inline-flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-primary" /> Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link
                  to="/delivery-policy"
                  className="inline-flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <Truck className="h-3.5 w-3.5 text-primary" /> Delivery Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="inline-flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <FileText className="h-3.5 w-3.5 text-primary" /> Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="inline-flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-primary" /> Refund & Cancellation Policy
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  to="/cart"
                  className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  View Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif text-base font-semibold text-foreground">Contact Us</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  <a href="tel:+233551745309" className="hover:text-primary">+233 55 174 5309</a>
                  <br />
                  <a href="tel:+233502135186" className="hover:text-primary">+233 50 213 5186</a>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a href="mailto:cupocake6@gmail.com" className="hover:text-primary">
                  cupocake6@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  Evandy Hostel (Annex), Ayeduase
                  <br />
                 KNUST, Kumasi, Ghana
                </span>
              </li>
            </ul>
          </div>

          {/* Operations & Hours */}
          <div>
            <h4 className="font-serif text-base font-semibold text-foreground">Operating Schedule</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2 font-medium text-foreground">
                <Clock className="h-4 w-4 text-primary" /> Monday - Sunday
              </li>
              <li className="text-xs">Mondays: Closed for kitchen prep</li>
              <li className="mt-3 rounded-2xl bg-card p-3 border border-border/60 text-xs">
                <span className="font-semibold text-foreground block mb-1">Pre-Orders Only:</span>
                Daily deliveries go out after 5:00 PM. Same-day orders not accepted on Sundays.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center sm:text-left">
            <span>© {new Date().getFullYear()} Cup O' Cake. All rights reserved.</span>
            <span>•</span>
            <Link to="/faq" className="hover:text-primary transition-colors">FAQs</Link>
            <Link to="/delivery-policy" className="hover:text-primary transition-colors">Delivery</Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="/refund-policy" className="hover:text-primary transition-colors">Refunds</Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs">Secured by Paystack</span>
            <Link to="/admin/login" className="hover:text-primary transition-colors">Staff login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
