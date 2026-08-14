"use client";

import { FormEvent, useState } from "react";

const stripeLink =
  process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ||
  "https://buy.stripe.com/test_8x2bJ02PE3eRcGDb741RC00";

const ranks = [
  { name: "Bronze", steps: "0-499", tone: "rank-bronze" },
  { name: "Silver", steps: "500+", tone: "rank-silver" },
  { name: "Gold", steps: "1,500+", tone: "rank-gold" },
  { name: "Platinum", steps: "3,000+", tone: "rank-platinum" },
  { name: "Emerald", steps: "5,000+", tone: "rank-emerald" },
  { name: "Master", steps: "7,500+", tone: "rank-master" },
  { name: "Champion", steps: "10,000+", tone: "rank-champion" },
];

export default function Home() {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleWaitlistSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Unable to join waitlist");
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="landing-shell">
      <section className="hero-panel">
        <nav className="brand-row" aria-label="Site">
          <a href="/" className="brand-mark">
            The Stair Club
          </a>
        </nav>

        <div className="hero-copy">
          <h1>
            Make the stairs <span>competitive.</span> Hit your goal.{" "}
            <span>Own</span> the leaderboard.
          </h1>
          <p>
            Track stairs, build streaks, hit daily goals, and compete with
            friends on live leaderboards.
          </p>
        </div>

        <div className="button-row" aria-label="Signup actions">
          <a className="early-button" href={stripeLink}>
            Early Adopter
          </a>
            <button
            className="waitlist-button"
            type="button"
            aria-expanded={showWaitlist}
            onClick={() => {
              setShowWaitlist((visible) => !visible);
              setStatus("idle");
            }}
          >
            Join Waitlist
          </button>
        </div>

        {showWaitlist ? (
          <form className="waitlist-form" onSubmit={handleWaitlistSubmit}>
            <label htmlFor="waitlist-email">Email address</label>
            <div className="email-row">
              <input
                id="waitlist-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setStatus("idle");
                }}
                required
              />
              <button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Saving..." : "Submit"}
              </button>
            </div>
            <p className={status === "success" ? "form-note success" : status === "error" ? "form-note error" : "form-note"}>
              {status === "success"
                ? "You are on the waitlist."
                : status === "error"
                  ? "Something went wrong. Please try again."
                  : "We will send launch updates and early access details."}
            </p>
          </form>
        ) : null}

        <section className="rank-strip" aria-label="Rank divisions">
          {ranks.map((rank) => (
            <article className={`rank-card ${rank.tone}`} key={rank.name}>
              <div className="rank-icon" aria-hidden="true">
                <span />
              </div>
              <h2>{rank.name}</h2>
              <p>{rank.steps} stairs</p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
