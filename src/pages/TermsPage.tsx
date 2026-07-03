import LegalPage, { LegalSection } from "@/pages/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" effectiveDate="July 2, 2026">
      <LegalSection title="1. Agreement to These Terms">
        <p>
          These Terms &amp; Conditions ("Terms") govern your use of the In Person
          website and waitlist (the "Site"). The Site is owned and operated by
          Kinetic Social LLC, a Texas limited liability company ("we," "us," or
          "our"). By using the Site or joining the waitlist, you agree to these
          Terms. If you do not agree, please do not use the Site.
        </p>
      </LegalSection>

      <LegalSection title="2. About the Site">
        <p>
          The Site is a marketing and pre-launch waitlist page for In Person, an
          upcoming dating service. The Site is not the In Person app itself. The
          app, its features, pricing, and availability are still in development
          and may change or may never launch. Separate terms will govern your
          use of the app when it becomes available.
        </p>
      </LegalSection>

      <LegalSection title="3. Eligibility">
        <p>
          In Person is a dating service intended for adults. You must be at
          least 18 years old to join the waitlist or use the Site.
        </p>
      </LegalSection>

      <LegalSection title="4. The Waitlist">
        <p>
          Joining the waitlist means giving us your email address so we can
          contact you about In Person, including early access and launch
          updates. Joining the waitlist:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>does not guarantee you access to the app, early or otherwise;</li>
          <li>does not create any obligation for us to launch the app on any timeline;</li>
          <li>does not cost anything and does not create a paid relationship between us.</li>
        </ul>
        <p>
          You can leave the waitlist at any time by using the unsubscribe link
          in any email we send, or by contacting us at the address below.
        </p>
      </LegalSection>

      <LegalSection title="5. Acceptable Use">
        <p>
          You agree not to misuse the Site — including submitting email
          addresses that are not yours, attempting to disrupt or overload the
          Site, scraping the Site, or using it for any unlawful purpose.
        </p>
      </LegalSection>

      <LegalSection title="6. Intellectual Property">
        <p>
          The Site and everything on it — including the In Person name, logo,
          design, text, and graphics — belong to Kinetic Social LLC or its
          licensors. You may not copy, reproduce, or use them without our prior
          written permission.
        </p>
      </LegalSection>

      <LegalSection title="7. Disclaimers">
        <p>
          The Site is provided "as is" and "as available," without warranties
          of any kind, express or implied. We do not promise the Site will be
          uninterrupted, error-free, or secure, and we may change or take down
          the Site at any time.
        </p>
      </LegalSection>

      <LegalSection title="8. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, Kinetic Social LLC will not
          be liable for any indirect, incidental, special, consequential, or
          punitive damages arising out of your use of the Site. Our total
          liability for any claim relating to the Site will not exceed one
          hundred U.S. dollars ($100).
        </p>
      </LegalSection>

      <LegalSection title="9. Governing Law">
        <p>
          These Terms are governed by the laws of the State of Texas, without
          regard to its conflict-of-law rules. Any dispute relating to these
          Terms or the Site will be resolved in the state or federal courts
          located in Texas.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to These Terms">
        <p>
          We may update these Terms from time to time. When we do, we will
          update the effective date at the top of this page. Continuing to use
          the Site after changes take effect means you accept the updated
          Terms.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact">
        <p>
          Questions about these Terms? Reach us at{" "}
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
