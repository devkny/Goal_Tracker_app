import { Link } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">
      {/* Noise overlay */}
      <div className="landing-noise" />

      {/* Nav */}
      <header className="landing-nav">
        <span className="landing-logo">Goal<span>Flow</span></span>
        <div className="landing-nav-links">
          <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
          <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="landing-hero">
        <div className="hero-glow" />
        <p className="hero-eyebrow">// your personal accountability system</p>
        <h1 className="hero-title">
          Turn dopamine<br />
          spikes into<br />
          <span className="hero-title-accent">real progress.</span>
        </h1>
        <p className="hero-sub">
          You've had the motivation. You've made the plan. Then life happens.
          GoalFlow keeps you accountable — one goal, one plan, one report at a time.
        </p>
        <div className="hero-cta">
          <Link to="/signup" className="btn btn-primary">Start for free →</Link>
          <Link to="/login" className="btn btn-ghost">I have an account</Link>
        </div>

        {/* Fake terminal card */}
        <div className="hero-terminal">
          <div className="terminal-bar">
            <span className="dot red" /><span className="dot amber" /><span className="dot green" />
            <span className="terminal-title">goalflow.log</span>
          </div>
          <div className="terminal-body">
            <div className="terminal-line"><span className="t-dim">goal</span> <span className="t-white">→</span> <span className="t-green">Become a proficient dev</span></div>
            <div className="terminal-line"><span className="t-dim">  plan</span> <span className="t-white">→</span> <span className="t-blue">Build 2 apps / week</span></div>
            <div className="terminal-line"><span className="t-dim">    ✅ action</span> <span className="t-white">Weather App</span> <span className="t-dim">— React, Node</span></div>
            <div className="terminal-line"><span className="t-dim">    ✅ action</span> <span className="t-white">Todo App</span> <span className="t-dim">— Vue, Express</span></div>
            <div className="terminal-line"><span className="t-dim">  plan</span> <span className="t-white">→</span> <span className="t-blue">Complete 2 courses</span></div>
            <div className="terminal-line"><span className="t-dim">    ✅ action</span> <span className="t-white">HTML &amp; CSS</span> <span className="t-dim">— freeCodeCamp</span></div>
            <div className="terminal-line"><span className="t-dim">    ⬜ action</span> <span className="t-white">JavaScript</span> <span className="t-dim">— in progress...</span></div>
            <div className="terminal-line blink"><span className="t-green">█</span></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        {[
          {
            icon: '◎',
            title: 'Set Goals',
            desc: 'Define the big ambition — become a developer, grow your channel, get consistent.',
          },
          {
            icon: '⊟',
            title: 'Build Action Plans',
            desc: 'Break goals into concrete, completable actions with deadlines.',
          },
          {
            icon: '◈',
            title: 'Write Reports',
            desc: 'When done, document what you built, what you learned, and which tech you used.',
          },
          {
            icon: '◉',
            title: 'See Your Growth',
            desc: 'Charts show your completion rate, streak, and most-used skills over time.',
          },
        ].map((f) => (
          <div key={f.title} className="feature-card">
            <span className="feature-icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA strip */}
      <section className="landing-bottom">
        <h2>Ready to stop forgetting your goals?</h2>
        <Link to="/signup" className="btn btn-primary">Create your account →</Link>
      </section>
    </div>
  );
}
