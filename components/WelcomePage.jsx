import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const menuLinks = [
  { label: 'Overview', href: '#overview' },
  { label: 'Features', href: '#features' },
  { label: 'Organizers', href: '#organizers' },
  { label: 'Participants', href: '#participants' },
  { label: 'Contact', href: '#contact' },
];

const WelcomePage = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 text-white font-sans">
      <motion.header
        className="px-6 py-6"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 backdrop-blur">
          <Link to="/" className="text-lg font-semibold tracking-tight text-white">
            HackSphere <span role="img" aria-label="laptop">💻</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-3 text-sm">
            {menuLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-full px-3 py-1 text-white/80 transition hover:bg-white/15 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <Link
              to="/login"
              className="rounded-full border border-white/60 px-4 py-2 font-semibold text-white transition hover:bg-white/15"
            >
              Sign in
            </Link>
            <Link
              to="/organizer-login"
              className="rounded-full bg-white px-4 py-2 font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-100"
            >
              Launch Event
            </Link>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          className="w-full max-w-4xl text-center space-y-10"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.h1
            id="overview"
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
            variants={fadeUp}
          >
            HackSphere <span role="img" aria-label="laptop">💻</span>
            <span className="ml-2" role="img" aria-label="detective">🕵️‍♀️</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            All-in-one platform for University Hackathons and CTF Challenges.
          </motion.p>

          <motion.p
            className="text-base md:text-lg text-white/80 max-w-3xl mx-auto"
            variants={fadeUp}
          >
            HackSphere helps universities simplify the entire hackathon lifecycle — from registration to results — all in one place.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            variants={fadeUp}
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/organizer-login"
                className="inline-flex items-center justify-center rounded-full bg-white/90 text-indigo-700 px-8 py-3 text-base font-semibold shadow-lg shadow-purple-500/30 transition hover:bg-white"
              >
                <span role="img" aria-label="graduation cap">🎓</span>
                <span className="ml-2">I’m an Organizer</span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/participant-login"
                className="inline-flex items-center justify-center rounded-full border border-white/70 px-8 py-3 text-base font-semibold transition hover:bg-white/15"
              >
                <span role="img" aria-label="rocket">🚀</span>
                <span className="ml-2">I’m a Participant</span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            id="features"
            className="grid gap-6 md:grid-cols-2 pt-12"
            variants={staggerContainer}
          >
            <motion.div
              className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-8 text-left shadow-xl shadow-purple-900/20 transition hover:border-white/40"
              variants={fadeUp}
              whileHover={{ translateY: -6 }}
            >
              <h3 className="text-2xl font-semibold mb-3">Coding Hackathons</h3>
              <p className="text-white/85 leading-relaxed">
                Organize innovative coding marathons with seamless team formation, problem distribution, submission tracking, and real-time progress analytics.
              </p>
            </motion.div>

            <motion.div
              className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-8 text-left shadow-xl shadow-indigo-900/20 transition hover:border-white/40"
              variants={fadeUp}
              whileHover={{ translateY: -6 }}
            >
              <h3 className="text-2xl font-semibold mb-3">CTF Challenges</h3>
              <p className="text-white/85 leading-relaxed">
                Launch cybersecurity puzzles, automate scoring, and energize participants with live leaderboards, hints, and insightful challenge metrics.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            id="organizers"
            className="mx-auto max-w-3xl rounded-3xl border border-white/20 bg-white/10 p-8 text-left backdrop-blur-md"
            variants={fadeUp}
          >
            <h3 className="text-2xl font-semibold text-white">For Organizers</h3>
            <p className="mt-3 text-white/85 leading-relaxed">
              Coordinate every stage of your university events with intuitive tools for judging criteria, announcements,
              analytics, and certificate automation. HackSphere keeps your organizing committee in sync and on schedule.
            </p>
          </motion.div>

          <motion.div
            id="participants"
            className="mx-auto max-w-3xl rounded-3xl border border-white/20 bg-white/10 p-8 text-left backdrop-blur-md"
            variants={fadeUp}
          >
            <h3 className="text-2xl font-semibold text-white">For Participants</h3>
            <p className="mt-3 text-white/85 leading-relaxed">
              Build teams, track submissions, receive judge feedback, and celebrate achievements with digital certificates—all inside
              one vibrant, student-friendly platform tailored for hackathons and CTF challenges.
            </p>
          </motion.div>
        </motion.div>
      </main>

      <section id="contact" className="px-6 pb-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 rounded-3xl border border-white/15 bg-white/10 px-6 py-8 text-center backdrop-blur">
          <h4 className="text-xl font-semibold text-white">Ready to launch your next campus challenge?</h4>
          <p className="text-sm text-white/85">
            Reach out to the CodeNova Team and we’ll help you tailor HackSphere for your university’s hackathons and CTF events.
          </p>
          <a
            href="mailto:team@codenova.io"
            className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-100"
          >
            Contact CodeNova Team
          </a>
        </div>
      </section>

      <footer className="w-full border-t border-white/15 bg-black/15 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-sm text-white/80 sm:flex-row sm:items-center sm:justify-between">
          <span>© {currentYear} HackSphere. All rights reserved.</span>
          <a
            href="https://codenova.example.com"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white hover:underline"
          >
            Built with ❤️ by CodeNova Team for Cursor Hackathon 2025.
          </a>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;


