import { u as useNavigate, j as jsxRuntimeExports, p as Layout, A as ArrowLeft } from "./index-DlPcOTZa.js";
function Section({
  id,
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id, className: "mb-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "legal-section-title", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "legal-body", children })
  ] });
}
function TermsOfServicePage() {
  const navigate = useNavigate();
  const lastUpdated = "April 26, 2026";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-3xl mx-auto px-4 sm:px-6 py-10",
      "data-ocid": "terms-of-service.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => navigate({ to: "/dashboard" }),
            className: "flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-smooth mb-8 group",
            "data-ocid": "terms.back-button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" }),
              "BACK TO DASHBOARD"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 pb-8 border-b border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2", children: "LEGAL DOCUMENT — TERMS OF SERVICE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "legal-title", children: "Terms of Service" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground", children: [
            "Last updated: ",
            lastUpdated,
            "  ·  Effective immediately upon use"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "legal-body mb-8", children: [
          "Welcome to ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Copie Past-e" }),
          ". These Terms of Service govern your access to and use of the Copie Past-e platform, including our web application, Chrome browser extension, and all associated services. By accessing or using our services, you agree to be bound by these Terms. If you do not agree to these Terms, do not use our services."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { id: "acceptance", title: "1. Acceptance of Terms", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "By creating an account, installing the Chrome extension, or otherwise accessing any part of the Copie Past-e platform, you affirm that you are at least 18 years of age and have the legal capacity to enter into a binding agreement. If you are using our services on behalf of an organization, you represent that you have the authority to bind that organization to these Terms." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4", children: "These Terms constitute the entire agreement between you and Copie Past-e regarding your use of the service and supersede any prior agreements. We reserve the right to update these Terms at any time." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { id: "description", title: "2. Description of Service", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Copie Past-e is a cross-listing management tool that allows users to create, organize, and archive product listings for resale across multiple online marketplaces including Facebook Marketplace, Mercari, eBay, Poshmark, Depop, and Etsy." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "legal-list mt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Master Listings:" }),
              " Create a single source-of-truth record for each item with universal fields."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Platform Drafts:" }),
              " Generate platform-specific draft content tailored to each marketplace's requirements."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Chrome Extension:" }),
              " Autofill marketplace listing forms — you retain full control of all submissions."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Smart OCR:" }),
              " Use AI-powered image analysis to auto-populate listing fields from product photos."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { id: "accounts", title: "3. User Accounts and Security", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "legal-list mt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "You may not share your account credentials with any third party." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "You are responsible for all data you upload, create, or manage through the platform." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "We reserve the right to suspend or terminate accounts that violate these Terms." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Authentication is handled via Internet Identity — we never store raw passwords." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { id: "permitted-use", title: "4. Permitted Use", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Copie Past-e is designed exclusively for",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "manual listing management" }),
            ". The following rules apply to all users:"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "legal-list mt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "The Chrome extension autofills marketplace forms — you must manually review and submit every listing." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Automated posting, bulk submission scripts, or any circumvention of marketplace policies is strictly prohibited." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "You may not use Copie Past-e to list counterfeit, stolen, or prohibited goods." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "You may not reverse-engineer, decompile, or attempt to extract source code from the platform." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "You may not use the service to scrape, harvest, or collect data from third-party marketplaces." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Abuse of the Smart OCR feature (excessive calls, manipulation of inputs) is prohibited." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4", children: "Violation of these rules may result in immediate account termination without refund." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { id: "billing", title: "5. Subscription and Billing", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Copie Past-e offers three subscription tiers: Time Walker ($6.99/month), Time Traveler ($9.99/month), and Time Lord ($19.99/month). All new accounts receive a free 30-day trial." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "legal-list mt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Subscriptions are billed monthly via Stripe. By subscribing, you authorize recurring charges." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Tier benefits are calculated from your subscription start date and stack additively on renewal." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Downgrading your tier takes effect at the next billing cycle." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Cancellation stops future billing but does not refund unused time in the current period." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "If payment fails, your account will be downgraded to read-only access after a 7-day grace period." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { id: "refunds", title: "6. Refund Policy", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-accent/30 bg-accent/5 rounded p-4 font-mono text-xs text-accent", children: "⚠ PLACEHOLDER — This section is to be completed by the legal team before public launch. Specify: refund window (e.g., 14 days), conditions for eligibility, and the process for requesting a refund." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { id: "data", title: "7. Data Handling and Privacy", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Your use of the platform is also governed by our",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "/privacy",
                className: "text-primary hover:text-accent underline underline-offset-2 transition-smooth",
                children: "Privacy Policy"
              }
            ),
            ", which is incorporated into these Terms by reference."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-accent/30 bg-accent/5 rounded p-4 font-mono text-xs text-accent mt-4", children: "⚠ PLACEHOLDER — Cross-reference with Privacy Policy for complete data handling disclosures including retention periods, third-party sharing, and GDPR/CCPA compliance details." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { id: "ip", title: "8. Intellectual Property", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "All content, features, and functionality of the Copie Past-e platform — including but not limited to software, design, text, graphics, and logos — are the exclusive property of Copie Past-e and its licensors." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "legal-list mt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "You retain ownership of all listing content you create and upload." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "By uploading content, you grant us a limited license to store and display that content to provide the service." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "You may not use our trademarks or branding without express written consent." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { id: "warranty", title: "9. Disclaimer of Warranties", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: 'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. COPIE PAST-E DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK.' }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { id: "liability", title: "10. Limitation of Liability", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, COPIE PAST-E SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA LOSS, OR BUSINESS INTERRUPTION, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE THREE MONTHS PRECEDING THE CLAIM." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { id: "changes", title: "11. Changes to Terms", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "We reserve the right to modify these Terms at any time. We will notify active subscribers of material changes via an in-app notification at least 14 days before changes take effect. Your continued use of the service after changes take effect constitutes acceptance of the new Terms." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { id: "contact", title: "12. Contact Information", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-accent/30 bg-accent/5 rounded p-4 font-mono text-xs text-accent", children: "⚠ PLACEHOLDER — Insert official business contact details, support email, and mailing address before launch." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4", children: "For support, billing questions, or account issues, use the in-app Help & Support button or visit your notification center." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] text-muted-foreground", children: [
            "© ",
            (/* @__PURE__ */ new Date()).getFullYear(),
            " Copie Past-e. All rights reserved."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "/privacy",
                className: "font-mono text-[10px] text-muted-foreground hover:text-primary transition-smooth uppercase tracking-widest",
                children: "Privacy Policy"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "/terms",
                className: "font-mono text-[10px] text-primary uppercase tracking-widest",
                children: "Terms of Service"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
export {
  TermsOfServicePage
};
