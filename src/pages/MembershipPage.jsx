import { useState } from "react";
import { ArrowRight, Check, Crown, Gem, ShieldCheck, Sparkles } from "lucide-react";
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

  const handleBuyClick = async (data) => {
    const {name, price} = data;
    setSelected(name)
    const order = await axios.post(API_URL+"/payment/create", {
      membershipType: name
    }, {withCredentials: true})

    const {amount, keyId, currency, notes, orderId, } = order.data
    const options = {
        key: keyId, // Replace with your Razorpay key_id
        amount: amount, // Amount is in currency subunits.
        currency: currency,
        name: 'Twingle.Live',
        description: 'Connect to other developers',
        order_id: orderId, // This is the order_id created in the backend
        // callback_url: 'http://localhost:3000/payment-success', // Your success URL
        prefill: {
          name: notes.firstName + " " + notes.lastName,
          email: notes.emailId,
          contact: '9999999999'
        },
        theme: {
          color: '#F37254'
        },
      };
    const rzp = new window.Razorpay(options);
    rzp.open()
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
              <button className="membership-select" onClick={() => handleBuyClick({name, price})}>
                {selected === name ? "Selected" : `BUY ${name}`}
                {selected === name ? <Check size={17} /> : <ArrowRight size={17} />}
              </button>
              <div className="membership-divider" />
              <p className="membership-includes">WHAT’S INCLUDED</p>
              <ul>{features.map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}</ul>
            </article>
          ))}
        </div>

        <p className="membership-status" aria-live="polite">
          {selected ? `${selected} is selected. Membership checkout will be available soon.` : "Choose the membership that feels right for you. You can change your mind anytime."}
        </p>
        <p className="membership-note">Membership checkout is coming soon. No payment will be taken on this page.</p>
      </div>
    </main>
  );
}
