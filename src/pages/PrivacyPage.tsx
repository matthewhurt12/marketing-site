import LegalPage, { LegalSection } from "@/pages/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" effectiveDate="August 22, 2026">
      <LegalSection title="1. Who We Are">
        <p>
          In Person is owned and operated by Kinetic Social LLC, a Texas
          limited liability company ("we," "us," or "our"). This Privacy Policy
          explains what we collect on this website and waitlist (the "Site"),
          how we use it, and the choices you have. A separate privacy policy
          will cover the In Person app when it launches.
        </p>
      </LegalSection>

      <LegalSection title="2. What We Collect">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <span className="text-foreground">Email address.</span> The only
            information you actively give us is the email address you submit
            when you join the waitlist.
          </li>
          <li>
            <span className="text-foreground">Basic technical data.</span> Like
            most websites, our hosting provider automatically records standard
            server logs (such as IP address, browser type, and pages
            requested) to keep the Site running and secure.
          </li>
          <li>
            <span className="text-foreground">Anonymous usage analytics.</span>{" "}
            We use Vercel Analytics to understand how the Site is used (page
            views, visit counts, general location, and device type). It is
            cookieless and does not identify you personally or track you
            across other websites.
          </li>
          <li>
            <span className="text-foreground">Web font requests.</span> The Site
            loads typefaces through Google Fonts. When your browser requests
            those files, Google may receive standard request information such
            as your IP address and browser details.
          </li>
        </ul>
        <p>
          We do not use third-party advertising trackers or sell your
          information to anyone.
        </p>
      </LegalSection>

      <LegalSection title="3. How We Use Your Email">
        <p>We use your email address only to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>keep you on the waitlist;</li>
          <li>contact you about In Person — early access, launch news, and updates.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Where Your Information Is Stored">
        <p>
          Waitlist emails are processed and stored with our email service
          provider, Resend. A signup notification may also be delivered to our
          private administrative email account, which is currently hosted by
          Google. The Site is hosted on Vercel. These providers process data to
          help us operate the Site and waitlist; the waitlist is never
          published or visible to other visitors.
        </p>
      </LegalSection>

      <LegalSection title="5. Sharing">
        <p>
          We do not sell, rent, or trade your personal information. We share it
          only with the service providers named above (to host the Site, load
          its fonts, operate the waitlist, and send email), or if the law
          requires us to.
        </p>
      </LegalSection>

      <LegalSection title="6. Retention">
        <p>
          We keep your email address until you unsubscribe or ask us to delete
          it, or until the waitlist is no longer needed — whichever comes
          first.
        </p>
      </LegalSection>

      <LegalSection title="7. Your Choices &amp; Rights">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <span className="text-foreground">Unsubscribe.</span> Every email
            we send includes an unsubscribe link.
          </li>
          <li>
            <span className="text-foreground">Access or deletion.</span> Email
            us and we will tell you what we have about you, correct it, or
            delete it.
          </li>
        </ul>
        <p>
          Depending on where you live, you may have additional privacy rights.
          We honor reasonable requests regardless of where you are.
        </p>
      </LegalSection>

      <LegalSection title="8. Children">
        <p>
          The Site is for adults 18 and older. We do not knowingly collect
          information from anyone under 18. If you believe a minor has joined
          the waitlist, contact us and we will delete the information.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. When we do, we
          will update the effective date at the top of this page.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>
          Questions or requests about your privacy? Reach us at{" "}
          <a
            href="mailto:matthewhurt999@gmail.com"
            className="text-lilac hover:opacity-80 aura-transition"
          >
            matthewhurt999@gmail.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
