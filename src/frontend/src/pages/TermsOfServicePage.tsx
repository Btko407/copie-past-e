import { Layout } from "@/components/Layout";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

function Section({
  id,
  title,
  children,
}: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10">
      <h2 className="legal-section-title">{title}</h2>
      <div className="legal-body">{children}</div>
    </section>
  );
}

export function TermsOfServicePage() {
  const navigate = useNavigate();
  const lastUpdated = "April 26, 2026";

  return (
    <Layout>
      <div
        className="max-w-3xl mx-auto px-4 sm:px-6 py-10"
        data-ocid="terms-of-service.page"
      >
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => navigate({ to: "/dashboard" })}
          className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-smooth mb-8 group"
          data-ocid="terms.back-button"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          BACK TO DASHBOARD
        </button>

        {/* Header */}
        <div className="mb-8 pb-8 border-b border-border/40">
          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
            LEGAL DOCUMENT — TERMS OF SERVICE
          </div>
          <h1 className="legal-title">Terms of Service</h1>
          <p className="font-mono text-xs text-muted-foreground">
            Last updated: {lastUpdated} &nbsp;·&nbsp; Effective immediately upon
            use
          </p>
        </div>

        {/* Introduction */}
        <p className="legal-body mb-8">
          Welcome to <strong className="text-foreground">Copie Past-e</strong>.
          These Terms of Service govern your access to and use of the Copie
          Past-e platform, including our web application, Chrome browser
          extension, and all associated services. By accessing or using our
          services, you agree to be bound by these Terms. If you do not agree to
          these Terms, do not use our services.
        </p>

        <Section id="acceptance" title="1. Acceptance of Terms">
          <p>
            By creating an account, installing the Chrome extension, or
            otherwise accessing any part of the Copie Past-e platform, you
            affirm that you are at least 18 years of age and have the legal
            capacity to enter into a binding agreement. If you are using our
            services on behalf of an organization, you represent that you have
            the authority to bind that organization to these Terms.
          </p>
          <p className="mt-4">
            These Terms constitute the entire agreement between you and Copie
            Past-e regarding your use of the service and supersede any prior
            agreements. We reserve the right to update these Terms at any time.
          </p>
        </Section>

        <Section id="description" title="2. Description of Service">
          <p>
            Copie Past-e is a cross-listing management tool that allows users to
            create, organize, and archive product listings for resale across
            multiple online marketplaces including Facebook Marketplace,
            Mercari, eBay, Poshmark, Depop, and Etsy.
          </p>
          <ul className="legal-list mt-4">
            <li>
              <strong>Master Listings:</strong> Create a single source-of-truth
              record for each item with universal fields.
            </li>
            <li>
              <strong>Platform Drafts:</strong> Generate platform-specific draft
              content tailored to each marketplace's requirements.
            </li>
            <li>
              <strong>Chrome Extension:</strong> Autofill marketplace listing
              forms — you retain full control of all submissions.
            </li>
            <li>
              <strong>Smart OCR:</strong> Use AI-powered image analysis to
              auto-populate listing fields from product photos.
            </li>
          </ul>
        </Section>

        <Section id="accounts" title="3. User Accounts and Security">
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account. You must immediately notify us of any unauthorized use of
            your account.
          </p>
          <ul className="legal-list mt-4">
            <li>
              You may not share your account credentials with any third party.
            </li>
            <li>
              You are responsible for all data you upload, create, or manage
              through the platform.
            </li>
            <li>
              We reserve the right to suspend or terminate accounts that violate
              these Terms.
            </li>
            <li>
              Authentication is handled via Internet Identity — we never store
              raw passwords.
            </li>
          </ul>
        </Section>

        <Section id="permitted-use" title="4. Permitted Use">
          <p>
            Copie Past-e is designed exclusively for{" "}
            <strong className="text-foreground">
              manual listing management
            </strong>
            . The following rules apply to all users:
          </p>
          <ul className="legal-list mt-4">
            <li>
              The Chrome extension autofills marketplace forms — you must
              manually review and submit every listing.
            </li>
            <li>
              Automated posting, bulk submission scripts, or any circumvention
              of marketplace policies is strictly prohibited.
            </li>
            <li>
              You may not use Copie Past-e to list counterfeit, stolen, or
              prohibited goods.
            </li>
            <li>
              You may not reverse-engineer, decompile, or attempt to extract
              source code from the platform.
            </li>
            <li>
              You may not use the service to scrape, harvest, or collect data
              from third-party marketplaces.
            </li>
            <li>
              Abuse of the Smart OCR feature (excessive calls, manipulation of
              inputs) is prohibited.
            </li>
          </ul>
          <p className="mt-4">
            Violation of these rules may result in immediate account termination
            without refund.
          </p>
        </Section>

        <Section id="billing" title="5. Subscription and Billing">
          <p>
            Copie Past-e offers three subscription tiers: Time Walker
            ($6.99/month), Time Traveler ($9.99/month), and Time Lord
            ($19.99/month). All new accounts receive a free 30-day trial.
          </p>
          <ul className="legal-list mt-4">
            <li>
              Subscriptions are billed monthly via Stripe. By subscribing, you
              authorize recurring charges.
            </li>
            <li>
              Tier benefits are calculated from your subscription start date and
              stack additively on renewal.
            </li>
            <li>
              Downgrading your tier takes effect at the next billing cycle.
            </li>
            <li>
              Cancellation stops future billing but does not refund unused time
              in the current period.
            </li>
            <li>
              If payment fails, your account will be downgraded to read-only
              access after a 7-day grace period.
            </li>
          </ul>
        </Section>

        <Section id="refunds" title="6. Refund Policy">
          <div className="border border-accent/30 bg-accent/5 rounded p-4 font-mono text-xs text-accent">
            ⚠ PLACEHOLDER — This section is to be completed by the legal team
            before public launch. Specify: refund window (e.g., 14 days),
            conditions for eligibility, and the process for requesting a refund.
          </div>
        </Section>

        <Section id="data" title="7. Data Handling and Privacy">
          <p>
            Your use of the platform is also governed by our{" "}
            <a
              href="/privacy"
              className="text-primary hover:text-accent underline underline-offset-2 transition-smooth"
            >
              Privacy Policy
            </a>
            , which is incorporated into these Terms by reference.
          </p>
          <div className="border border-accent/30 bg-accent/5 rounded p-4 font-mono text-xs text-accent mt-4">
            ⚠ PLACEHOLDER — Cross-reference with Privacy Policy for complete
            data handling disclosures including retention periods, third-party
            sharing, and GDPR/CCPA compliance details.
          </div>
        </Section>

        <Section id="ip" title="8. Intellectual Property">
          <p>
            All content, features, and functionality of the Copie Past-e
            platform — including but not limited to software, design, text,
            graphics, and logos — are the exclusive property of Copie Past-e and
            its licensors.
          </p>
          <ul className="legal-list mt-4">
            <li>
              You retain ownership of all listing content you create and upload.
            </li>
            <li>
              By uploading content, you grant us a limited license to store and
              display that content to provide the service.
            </li>
            <li>
              You may not use our trademarks or branding without express written
              consent.
            </li>
          </ul>
        </Section>

        <Section id="warranty" title="9. Disclaimer of Warranties">
          <p>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
            WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. COPIE PAST-E DOES NOT
            WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE
            OF VIRUSES OR OTHER HARMFUL COMPONENTS. YOUR USE OF THE SERVICE IS
            AT YOUR SOLE RISK.
          </p>
        </Section>

        <Section id="liability" title="10. Limitation of Liability">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, COPIE PAST-E
            SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
            CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA
            LOSS, OR BUSINESS INTERRUPTION, ARISING OUT OF OR IN CONNECTION WITH
            YOUR USE OF THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE
            POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY SHALL NOT EXCEED
            THE AMOUNT YOU PAID US IN THE THREE MONTHS PRECEDING THE CLAIM.
          </p>
        </Section>

        <Section id="changes" title="11. Changes to Terms">
          <p>
            We reserve the right to modify these Terms at any time. We will
            notify active subscribers of material changes via an in-app
            notification at least 14 days before changes take effect. Your
            continued use of the service after changes take effect constitutes
            acceptance of the new Terms.
          </p>
        </Section>

        <Section id="contact" title="12. Contact Information">
          <div className="border border-accent/30 bg-accent/5 rounded p-4 font-mono text-xs text-accent">
            ⚠ PLACEHOLDER — Insert official business contact details, support
            email, and mailing address before launch.
          </div>
          <p className="mt-4">
            For support, billing questions, or account issues, use the in-app
            Help & Support button or visit your notification center.
          </p>
        </Section>

        {/* Footer navigation */}
        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} Copie Past-e. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="/privacy"
              className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-smooth uppercase tracking-widest"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="font-mono text-[10px] text-primary uppercase tracking-widest"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
