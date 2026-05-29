import { Cake, Instagram, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { FaSnapchat,FaWhatsapp,FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="container py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
                <Cake className="h-5 w-5" />
              </span>
              <span className="font-serif text-xl font-semibold text-foreground">Cup O' Cake</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Handcrafted cupcakes & celebration cakes, baked fresh daily in Ghana.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-base font-semibold text-foreground">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-primary" /> +233 55 174 5309 | +233 50 213 5186</li>
              <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-primary" /> cupocake6@gmail.com</li>
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" /> Evandy Hostel(Annex) Ayeduase, KNUST</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-base font-semibold text-foreground">Hours</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Mon – Fri: 8am – 8pm</li>
              <li>Saturday: 9am – 9pm</li>
              <li>Sunday: 10am – 6pm</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-base font-semibold text-foreground">Follow us</h4>
            <div className="mt-4 flex gap-3">
              <a href="https://www.instagram.com/cupocake6/" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://www.tiktok.com/@cupocake2" aria-label="TikTok" className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
                <FaTiktok className="h-4 w-4" />
              </a>
              <a href="https://wa.me/233551745309" aria-label="WhatsApp" className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
                <FaWhatsapp className="h-4 w-4" />
              </a>
              <a href="https://www.snapchat.com/add/cupocake6" aria-label="Snapchat" className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
                <FaSnapchat className="h-4 w-4" />
              </a>
            </div>
            <Link
              to="/cart"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-105"
            >
              View Cart
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Cup O' Cake Ghana. Made with ❤️ in Kumasi.</span>
          <Link to="/admin/login" className="hover:text-primary">Staff login</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
