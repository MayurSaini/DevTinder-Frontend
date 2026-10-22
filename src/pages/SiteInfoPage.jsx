import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import "./SiteInfoPage.css";

// Replace these with verified merchant details before submitting the site to a payment provider.
export const merchantDetails = {
  legalName: "Mayur Saini",
  supportEmail: "mayurkasherwal528@gmail.com",
  phone: "+91 8171433760",
  address: "Yogipuram Colony, Jamalpur Kalan, Haridwar, Uttarakhand - 249407",
  website: "https://twingle.live",
};

const updated = "22 October 2026";
const chatPlans = [
  { duration: "7 days", price: "₹100" },
  { duration: "1 month", price: "₹300" },
  { duration: "3 months", price: "₹750" },
  { duration: "6 months", price: "₹1,400" },
  { duration: "1 year", price: "₹2,500" },
];

const pageContent = {
  about: {
    eyebrow: "A little about us",
    title: "Meaningful connections, built for developers.",
    intro: "Twingle.Live is a platform designed to help developers discover and connect with people who share their interest in building software.",
    sections: [
      ["What you can do", "Create a profile, discover other developers, send and respond to connection requests, and manage your connections in one place. Chat is a paid feature available after a connection request is accepted. Both people in the connection need an active chat plan to chat."],
      ["Our approach", "We aim to make it easier to find peers for conversation, collaboration, and community. Please use the platform respectfully and keep your profile information accurate."],
      ["Who operates Twingle.Live", merchantDetails.legalName ? `Twingle.Live is operated by ${merchantDetails.legalName}.` : "Twingle.Live is the name of this service. The legal name of its operator will be published here once confirmed."],
    ],
  },
  terms: {
    eyebrow: "The ground rules",
    title: "Terms of Use",
    intro: "These terms apply when you access or use Twingle.Live. By creating an account or using the service, you agree to them.",
    sections: [
      ["Using the service", "You must be legally able to agree to these terms. Keep your login credentials secure and provide information that is accurate and current. You are responsible for activity carried out through your account."],
      ["Respectful conduct", "Do not impersonate another person, harass or threaten anyone, publish unlawful or misleading content, attempt to access another account, interfere with the service, or use Twingle.Live for spam or fraud. We may restrict or suspend access when necessary to protect users or the service."],
      ["Your content", "You retain responsibility for content you submit. You confirm that you have the rights needed to share it. You allow us to host and display it as needed to operate Twingle.Live and its features. Do not post sensitive financial information or payment credentials."],
      ["Availability and changes", "We may update or suspend features to maintain or improve the service. We will make reasonable efforts to keep the service available, but uninterrupted access cannot be guaranteed."],
      ["Paid chat and payments", "Chat is a paid feature. A connection request must be accepted before chat access can be used. Both people in a connection need an active chat plan. Plans are one-time purchases in fixed durations listed on the Pricing page. They do not renew automatically and expire at the end of the selected period. Chat access is not available until payment is confirmed."],
      ["Contact", `For questions about these terms, contact ${merchantDetails.supportEmail || "our support team using the contact details on the Contact page"}.`],
    ],
  },
  privacy: {
    eyebrow: "Your information",
    title: "Privacy Policy",
    intro: "This policy explains how Twingle.Live handles information when you use the service. We use information as needed to provide, secure, and improve the platform.",
    sections: [
      ["Information you provide", "This may include your name, email address, password, profile details, photo, and information you choose to share in your profile or communications."],
      ["How we use information", "We use account and profile information to create and maintain your account, show profiles and connection features, respond to support requests, protect the service, diagnose problems, and meet legal obligations."],
      ["Sharing", "We display profile information to other users according to the platform's features. We may use service providers to host or operate Twingle.Live, and may disclose information when legally required or needed to protect users and the service."],
      ["Payment information", "When paid chat checkout is introduced, the payment provider will handle payment credentials. Twingle.Live will not ask you to share or store full card numbers, CVV, UPI PINs, or payment passwords. We may receive and use payment status and transaction references to grant chat access, keep payment records, and resolve payment issues."],
      ["Security and retention", "We use reasonable safeguards and retain information for as long as needed to provide the service, meet legal obligations, resolve disputes, and enforce our terms. No online service can promise absolute security."],
      ["Your choices and contact", `You may request access, correction, or deletion of your account information by contacting ${merchantDetails.supportEmail || "the support contact listed on our Contact page"}. Some information may need to be retained where required by law or for legitimate operational needs.`],
    ],
  },
  refund: {
    eyebrow: "Payments and cancellations",
    title: "Refund & Cancellation Policy",
    intro: "Chat is Twingle.Live’s paid feature. After a connection request is accepted, chat access is available with a paid plan for the selected duration. Payment checkout is not active yet.",
    sections: [
      ["Failed, duplicate, or missing access", "Paid chat checkout is not active yet. Once payments are enabled, if you are charged but chat access is not granted, or you see a duplicate charge, contact us with your account email, transaction date, amount, and payment reference. Never send full card details, CVV, UPI PIN, or passwords."],
      ["Refund requests and timing", "For an eligible paid transaction, contact us as soon as possible with the transaction details. We will review the request and tell you whether it is approved. Approved refunds will be initiated to the original payment method within 5–7 business days of approval. Your bank or payment provider may take additional time to post the refund."],
      ["Plan duration and expiry", "Each chat plan is a one-time purchase and does not renew automatically. Access begins after payment confirmation and expires at the end of the selected duration. You can choose to purchase another plan after expiry."],
      ["How to contact us", `Email ${merchantDetails.supportEmail || "the support contact shown on our Contact page"} with the subject “Payment or refund request”.`],
    ],
  },
  delivery: {
    eyebrow: "Digital service information",
    title: "Delivery Policy",
    intro: "Twingle.Live is an online service. It does not ship physical goods. Chat is available digitally after a connection request is accepted and both people have active paid plans.",
    sections: [
      ["Access to the service", "Profiles, discovery, and connection requests are available online after registration. Chat is available digitally after an accepted connection request and successful payment confirmation for both people's plans."],
      ["Delays or access problems", "If a confirmed purchase is not available in your account, contact support with your account email and payment reference so we can investigate."],
      ["Contact", `For delivery or access questions, contact ${merchantDetails.supportEmail || "the support contact listed on our Contact page"}.`],
    ],
  },
  contact: {
    eyebrow: "We’re here to help",
    title: "Contact Twingle.Live",
    intro: "For account, safety, or payment questions, contact Twingle.Live using the details below.",
    sections: [],
  },
  pricing: {
    eyebrow: "Plans and pricing",
    title: "Simple, clear pricing.",
    intro: "Choose a one-time, fixed-duration plan to unlock chat after a connection request is accepted. Plans do not renew automatically. Access begins after payment confirmation and expires at the end of the selected period. Prices are in Indian rupees. Payment checkout is not active yet.",
    sections: [
      ["Free features", "Create a profile, discover developers, and send or respond to connection requests."],
      ["Paid chat access", "After a connection request is accepted, both people need their own active paid plan to chat. Plans are one-time purchases for the duration listed above and expire when that period ends. They do not renew automatically. Any applicable taxes will be shown in the checkout total before payment."],
      ["Questions", `For pricing or payment questions, contact ${merchantDetails.supportEmail}.`],
    ],
  },
};

function PricingOptions() {
  return (
    <section className="pricing-options" aria-label="Chat access plans">
      {chatPlans.map((plan) => (
        <article className="pricing-option" key={plan.duration}>
          <span className="pricing-duration">{plan.duration}</span>
          <strong>{plan.price}</strong>
          <span className="pricing-access">Chat access</span>
        </article>
      ))}
    </section>
  );
}

function ContactDetails() {
  const isComplete = merchantDetails.legalName && merchantDetails.supportEmail && merchantDetails.phone && merchantDetails.address;
  return (
    <div className="contact-details">
      {!isComplete && <div className="merchant-notice"><strong>Merchant details need to be completed.</strong><span>Add the verified legal business name, monitored support email, phone number, and verifiable business address in <code>src/pages/SiteInfoPage.jsx</code> before submitting this site for payment review.</span></div>}
      <div className="contact-item"><Mail size={19} /><div><span>Email</span>{merchantDetails.supportEmail ? <a href={`mailto:${merchantDetails.supportEmail}`}>{merchantDetails.supportEmail}</a> : <strong>Support email to be added</strong>}</div></div>
      <div className="contact-item"><Phone size={19} /><div><span>Phone</span>{merchantDetails.phone ? <a href={`tel:${merchantDetails.phone}`}>{merchantDetails.phone}</a> : <strong>Phone number to be added</strong>}</div></div>
      <div className="contact-item"><MapPin size={19} /><div><span>Business address</span><strong>{merchantDetails.address || "Verifiable business address to be added"}</strong></div></div>
      <div className="contact-item"><span className="contact-placeholder" /><div><span>Legal business name</span><strong>{merchantDetails.legalName || "Legal business name to be added"}</strong></div></div>
      <div className="contact-item"><span className="contact-placeholder" /><div><span>Website</span><a href={merchantDetails.website}>{merchantDetails.website}</a></div></div>
    </div>
  );
}

export default function SiteInfoPage({ page }) {
  const content = pageContent[page];
  if (!content) return null;
  return (
    <main className="site-info-page">
      <div className="site-info-shell">
        <div className="site-info-heading"><span className="site-info-eyebrow">{content.eyebrow}</span><h1>{content.title}</h1><p>{content.intro}</p></div>
        {page === "contact" ? <ContactDetails /> : <>
          {page === "pricing" && <PricingOptions />}
          <div className="policy-card">{content.sections.map(([heading, body]) => <section className="policy-section" key={heading}><h2>{heading}</h2><p>{body}</p></section>)}</div>
        </>}
        <p className="site-info-updated">Last updated: {updated}</p>
        <nav className="policy-links" aria-label="Policies">
          <Link to="/about">About</Link><Link to="/contact">Contact</Link><Link to="/pricing">Pricing</Link><Link to="/terms">Terms</Link><Link to="/privacy">Privacy</Link><Link to="/refund-policy">Refunds & cancellations</Link><Link to="/shipping-policy">Delivery</Link>
        </nav>
      </div>
    </main>
  );
}
