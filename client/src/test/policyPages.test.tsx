import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FAQ from "../pages/FAQ";
import DeliveryPolicy from "../pages/DeliveryPolicy";
import TermsOfService from "../pages/TermsOfService";
import RefundPolicy from "../pages/RefundPolicy";
import Footer from "../components/Footer";

describe("Paystack Compliance & Policy Pages", () => {
  beforeEach(() => {
    window.scrollTo = () => {};
  });

  describe("FAQ Page", () => {
    it("renders frequently asked questions and key business information", () => {
      render(
        <MemoryRouter initialEntries={["/faq"]}>
          <FAQ />
        </MemoryRouter>
      );

      expect(screen.getByRole("heading", { level: 1, name: /frequently asked questions/i })).toBeInTheDocument();
      expect(screen.getByText(/what does cup o’ cake sell\?/i)).toBeInTheDocument();
      expect(screen.getByText(/where do you deliver\?/i)).toBeInTheDocument();
      expect(screen.getByText(/how can i pay for my order\?/i)).toBeInTheDocument();
      expect(screen.getByText(/how do delivery fees work\?/i)).toBeInTheDocument();
      expect(screen.getByText(/can i cancel or change an order\?/i)).toBeInTheDocument();
      expect(document.title).toContain("Frequently Asked Questions");
    });
  });

  describe("Delivery Policy Page", () => {
    it("renders delivery areas, schedule, fees, and kitchen location", () => {
      render(
        <MemoryRouter initialEntries={["/delivery-policy"]}>
          <DeliveryPolicy />
        </MemoryRouter>
      );

      expect(screen.getByRole("heading", { level: 1, name: /delivery policy/i })).toBeInTheDocument();
      expect(screen.getAllByText(/ayeduase, near knust, kumasi/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/how delivery fees are handled/i)).toBeInTheDocument();
      expect(screen.getByText(/operating hours & preparation times/i)).toBeInTheDocument();
      expect(screen.getByText(/unreachable recipients & inaccurate addresses/i)).toBeInTheDocument();
      expect(document.title).toContain("Delivery Policy");
    });
  });

  describe("Terms of Service Page", () => {
    it("renders business identity, order rules, and payment terms", () => {
      render(
        <MemoryRouter initialEntries={["/terms-of-service"]}>
          <TermsOfService />
        </MemoryRouter>
      );

      expect(screen.getByRole("heading", { level: 1, name: /terms of service/i })).toBeInTheDocument();
      expect(screen.getByText(/business identity & overview/i)).toBeInTheDocument();
      expect(screen.getByText(/pricing & delivery charges/i)).toBeInTheDocument();
      expect(screen.getByText(/order placement, payment authorisation, & order confirmation/i)).toBeInTheDocument();
      expect(screen.getByText(/custom cake orders & design approvals/i)).toBeInTheDocument();
      expect(document.title).toContain("Terms of Service");
    });
  });

  describe("Refund Policy Page", () => {
    it("renders cancellation stages, perishable goods assessment, and refund channels", () => {
      render(
        <MemoryRouter initialEntries={["/refund-policy"]}>
          <RefundPolicy />
        </MemoryRouter>
      );

      expect(screen.getByRole("heading", { level: 1, name: /refund & cancellation policy/i })).toBeInTheDocument();
      expect(screen.getByText(/report within 2 hours/i)).toBeInTheDocument();
      expect(screen.getByText(/damaged, incorrect, or missing items/i)).toBeInTheDocument();
      expect(screen.getByText(/how approved refunds are processed/i)).toBeInTheDocument();
      expect(screen.getByText(/paystack refund routing/i)).toBeInTheDocument();
      expect(document.title).toContain("Refund & Cancellation Policy");
    });
  });

  describe("Footer Links", () => {
    it("includes visible links to all four policy pages and social links", () => {
      render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      );

      const faqLinks = screen.getAllByRole("link", { name: /frequently asked questions|faqs/i });
      expect(faqLinks.length).toBeGreaterThan(0);
      expect(faqLinks.some(link => link.getAttribute("href") === "/faq")).toBe(true);

      const deliveryLinks = screen.getAllByRole("link", { name: /delivery policy|delivery/i });
      expect(deliveryLinks.length).toBeGreaterThan(0);
      expect(deliveryLinks.some(link => link.getAttribute("href") === "/delivery-policy")).toBe(true);

      const termsLinks = screen.getAllByRole("link", { name: /terms of service|terms/i });
      expect(termsLinks.length).toBeGreaterThan(0);
      expect(termsLinks.some(link => link.getAttribute("href") === "/terms-of-service")).toBe(true);

      const refundLinks = screen.getAllByRole("link", { name: /refund & cancellation policy|refunds/i });
      expect(refundLinks.length).toBeGreaterThan(0);
      expect(refundLinks.some(link => link.getAttribute("href") === "/refund-policy")).toBe(true);

      // Verify social link
      const instaLink = screen.getByRole("link", { name: /instagram/i });
      expect(instaLink).toHaveAttribute("href", "https://www.instagram.com/cupocake6/");
    });
  });
});
