import { useCallback, useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, Check, Crown, Gem, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import "./MembershipPage.css";
import axios from "axios";
import { API_URL } from "../api/constant";

const plans = [
  {
    name: "Silver",
    price: "₹100",
    label: "A little more room to connect",
    icon: ShieldCheck,
    className: "silver",
    features: ["See who’s interested in you", "Send more connection requests", "A verified premium profile badge", "Ad-free experience"],
  },
  {
    name: "Gold",
    price: "₹200",
    label: "Make every introduction count",
    icon: Crown,
    className: "gold",
    featured: true,
    features: ["Everything in Silver", "Priority profile placement", "See when your profile is viewed", "Weekly profile spotlight"],
  },
  {
    name: "Platinum",
    price: "₹300",
    label: "The complete Twingle experience",
    icon: Gem,
    className: "platinum",
    features: ["Everything in Gold", "Unlimited connection requests", "Advanced discovery filters", "Exclusive Platinum profile styling"],
  },
];

export default function MembershipPage() {
  const [selected, setSelected] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [checkingPremium, setCheckingPremium] = useState(true);
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState("");

  const verifyPremiumUser = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/premium/verify`, { withCredentials: true });
      const premium = Boolean(response.data.isPremium);
      setIsPremium(premium);
      return premium;
    } catch {
      setMessage("We couldn’t check your membership right now. Please refresh or try again shortly.");
      return false;
    } finally {
      setCheckingPremium(false);
    }
  }, []);

  useEffect(() => {
    verifyPremiumUser();
  }, [verifyPremiumUser]);

  const handleBuyClick = async (plan) => {
    if (buying || isPremium) return;
    setSelected(plan.name);
    setBuying(true);
    setMessage("");

    try {
      const order = await axios.post(`${API_URL}/payment/create`, {
        membershipType: plan.name,
      }, { withCredentials: true });
      const { amount, keyId, currency, notes, orderId } = order.data;

      if (!window.Razorpay) throw new Error("Payment checkout is unavailable. Please try again later.");

      const checkout = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        name: "Twingle.Live",
        description: `${plan.name} membership`,
        order_id: orderId,
        prefill: {
          name: [notes?.firstName, notes?.lastName].filter(Boolean).join(" "),
          email: notes?.emailId,
        },
        theme: { color: "#a977ec" },
        handler: async () => {
          setMessage("Payment received. We’re confirming your membership…");
          const confirmed = await verifyPremiumUser();
          setBuying(false);
          if (confirmed) setMessage("Your Premium membership is active. Enjoy the extra perks!");
          else setMessage("Payment was received, but we couldn’t confirm your membership yet. Please refresh shortly or contact support.");
        },
        modal: {
          ondismiss: () => setBuying(false),
        },
      });
      checkout.open();
    } catch (error) {
      setBuying(false);
      setMessage(error.response?.data?.message || error.message || "We couldn’t start checkout. Please try again.");
    }
  };

  if (checkingPremium) {
    return <main className="membership-page"><div className="membership-checking" role="status"><span className="membership-spinner" />Checking your membership…</div></main>;
  }

  if (isPremium) {
    return (
      <main className="membership-page">
        <section className="membership-active" aria-labelledby="membership-active-title">
          <div className="membership-active-icon"><BadgeCheck size={34} /></div>
          <span className="membership-eyebrow"><Sparkles size={15} /> TWINGLE PREMIUM</span>
          <h1 id="membership-active-title">You’re in.<br /><span>Enjoy the extras.</span></h1>
          <p>Your Premium membership is active. Your profile is ready to make an even better impression.</p>
          <div className="membership-active-benefits">
            <span><Check size={17} /> Your Premium benefits are unlocked</span>
            <span><Check size={17} /> Discover and connect with the community</span>
          </div>
          <Link className="membership-back-link" to="/feed">Explore Twingle <ArrowRight size={17} /></Link>
          {message && <p className="membership-feedback" role="status">{message}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="membership-page">
      <div className="membership-shell">
        <div className="membership-heading">
          <span className="membership-eyebrow"><Sparkles size={15} /> TWINGLE PREMIUM</span>
          <h1>Find your people.<br /><span>Make it count.</span></h1>
          <p>Give your profile a little more shine and make meaningful connections on your terms.</p>
        </div>

        <div className="membership-plans" aria-label="Membership plans">
          {plans.map(({ name, price, label, icon: Icon, className, featured, features }) => (
            <article className={`membership-card ${className}${featured ? " is-featured" : ""}${selected === name ? " is-selected" : ""}`} key={name}>
              {featured && <span className="membership-popular">MOST POPULAR</span>}
              <div className="membership-plan-icon"><Icon size={21} strokeWidth={1.8} /></div>
              <h2>{name}</h2>
              <p className="membership-plan-label">{label}</p>
              <div className="membership-price"><strong>{price}</strong><span>Membership price</span></div>
              <button className="membership-select" onClick={() => handleBuyClick({ name, price })} disabled={buying}>
                {buying && selected === name ? "Opening checkout…" : `Get ${name}`}
                {buying && selected === name ? <span className="membership-button-spinner" /> : <ArrowRight size={17} />}
              </button>
              <div className="membership-divider" />
              <p className="membership-includes">WHAT’S INCLUDED</p>
              <ul>{features.map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}</ul>
            </article>
          ))}
        </div>

        <p className="membership-status" aria-live="polite">{message || "Choose the membership that feels right for you."}</p>
        <p className="membership-note">Secure checkout by Razorpay. Your membership activates once payment is confirmed.</p>
      </div>
    </main>
  );
}
