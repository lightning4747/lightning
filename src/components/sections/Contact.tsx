import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import SendIcon from "@mui/icons-material/Send";
import { useTheme } from "../../hooks/useTheme";
import BorderGlow from "../ui/BorderGlow";
import { FadeSection } from "../ui/FadeSection";

/* ─── Contact Data ──────────────────────────────────────────────────────── */

const CONTACT_INFO = [
  {
    id: "email",
    label: "EMAIL",
    value: "vignesh112847@gmail.com",
    display: "vignesh112847@gmail.com",
    icon: EmailIcon,
    copyable: true,
  },
  {
    id: "phone",
    label: "PHONE",
    value: "9360220856",
    display: "+91 936 022 0856",
    icon: PhoneIcon,
    copyable: true,
  },
  {
    id: "location",
    label: "LOCATION",
    value: "Coimbatore, Tamil Nadu",
    display: "Coimbatore, TN — India",
    icon: LocationOnIcon,
    copyable: false,
  },
];

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/lightning4747",
    icon: GitHubIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/vignesh-t-43a998341/", 
    icon: LinkedInIcon,
  },
];

/* ─── CopyChip ──────────────────────────────────────────────────────────── */

const CopyChip = ({ item, isDarkMode }: { item: typeof CONTACT_INFO[0]; isDarkMode: boolean }) => {
  const [copied, setCopied] = useState(false);
  const Icon = item.icon;

  const handleCopy = () => {
    if (!item.copyable) return;
    navigator.clipboard.writeText(item.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      onClick={handleCopy}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-300
        ${isDarkMode
          ? "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent-primary/40"
          : "bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-blue-300"}`}
    >
      <div className={`p-2.5 rounded-xl transition-colors duration-300 ${isDarkMode ? "bg-accent-primary/15" : "bg-blue-100"}`}>
        <Icon style={{ fontSize: 20, color: isDarkMode ? "var(--accent-primary)" : "#3b82f6" }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-[10px] font-mono tracking-[0.35em] uppercase mb-0.5 ${isDarkMode ? "text-accent-primary/70" : "text-blue-500"}`}>
          {item.label}
        </p>
        <p className={`text-sm font-medium truncate ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
          {item.display}
        </p>
      </div>

      {item.copyable && (
        <motion.div
          initial={false}
          animate={{ scale: copied ? 1.2 : 1 }}
          className={`transition-colors ${isDarkMode ? "text-slate-500 group-hover:text-accent-primary" : "text-slate-300 group-hover:text-blue-500"}`}
        >
          {copied
            ? <CheckIcon style={{ fontSize: 16, color: "#5DBE89" }} />
            : <ContentCopyIcon style={{ fontSize: 16 }} />}
        </motion.div>
      )}
    </motion.div>
  );
};

/* ─── MagneticSocial ────────────────────────────────────────────────────── */

const MagneticSocial = ({ link, isDarkMode }: { link: typeof SOCIAL_LINKS[0]; isDarkMode: boolean }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 25 });
  const springY = useSpring(y, { stiffness: 300, damping: 25 });
  const Icon = link.icon;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.35;
    const dy = (e.clientY - cy) * 0.35;
    x.set(dx);
    y.set(dy);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.15 }}
      className={`relative flex items-center gap-3 px-6 py-3 rounded-full font-mono text-xs tracking-widest uppercase transition-all duration-300
        ${isDarkMode
          ? "bg-white/5 border border-white/10 hover:border-accent-primary/60 text-slate-300 hover:text-accent-primary"
          : "bg-slate-900 border border-slate-700 hover:border-blue-500 text-slate-100 hover:text-blue-300"}`}
    >
      <Icon style={{ fontSize: 16 }} />
      {link.label}
    </motion.a>
  );
};

/* ─── Terminal Greeting ─────────────────────────────────────────────────── */

const LINES = [
  { prefix: "$ ", text: "whoami", delay: 0.3, color: "text-green-400" },
  { prefix: "> ", text: "Vignesh T.", delay: 0.9, color: "" },
  { prefix: "$ ", text: "status", delay: 1.5, color: "text-green-400" },
  { prefix: "> ", text: "open to work — backend & fullstack", delay: 2.1, color: "" },
  { prefix: "$ ", text: "ping vignesh --say-hello", delay: 2.7, color: "text-green-400" },
  { prefix: "> ", text: "message sent ✓", delay: 3.3, color: "text-accent-primary" },
];

const TerminalBlock = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    LINES.forEach((line, i) => {
      setTimeout(() => setVisibleCount(i + 1), line.delay * 1000);
    });
  }, []);

  return (
    <div
      className={`rounded-2xl overflow-hidden font-mono text-sm border
        ${isDarkMode ? "bg-[#0e0e10] border-white/10" : "bg-slate-900 border-slate-700"}`}
    >
      {/* Traffic lights */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
        <div className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-3 text-[10px] tracking-widest text-slate-500">vignesh@portfolio ~ zsh</span>
      </div>

      <div className="p-6 space-y-2 min-h-[220px]">
        {LINES.slice(0, visibleCount).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex gap-2"
          >
            <span className={line.color || "text-slate-400"}>{line.prefix}</span>
            <span className={line.color === "text-green-400" ? "text-slate-200" : (line.color || "text-slate-400")}>
              {line.text}
            </span>
          </motion.div>
        ))}

        {/* Blinking cursor */}
        {visibleCount < LINES.length && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.9 }}
            className="inline-block w-2 h-4 bg-green-400 ml-1 align-middle"
          />
        )}
      </div>
    </div>
  );
};

/* ─── Contact Form ──────────────────────────────────────────────────────── */

const ContactForm = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Compose mailto — replace with real API later
    const subject = `Portfolio Contact from ${form.name}`;
    const body = `${form.message}\n\nFrom: ${form.name} <${form.email}>`;
    window.location.href = `mailto:vignesh112847@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const inputBase = `w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 font-mono border
    ${isDarkMode
      ? "bg-white/5 border-white/10 text-slate-200 placeholder-slate-600 focus:border-accent-primary/60 focus:bg-white/8"
      : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:bg-white"}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={`block text-[10px] font-mono tracking-[0.35em] uppercase mb-2 ${isDarkMode ? "text-accent-primary/70" : "text-blue-500"}`}>
            Name
          </label>
          <input
            className={inputBase}
            placeholder="your name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className={`block text-[10px] font-mono tracking-[0.35em] uppercase mb-2 ${isDarkMode ? "text-accent-primary/70" : "text-blue-500"}`}>
            Email
          </label>
          <input
            type="email"
            className={inputBase}
            placeholder="your@email.com"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <label className={`block text-[10px] font-mono tracking-[0.35em] uppercase mb-2 ${isDarkMode ? "text-accent-primary/70" : "text-blue-500"}`}>
          Message
        </label>
        <textarea
          rows={4}
          className={`${inputBase} resize-none`}
          placeholder="what's on your mind?"
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          required
        />
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-mono text-sm tracking-widest uppercase transition-all duration-300
          ${sent
            ? "bg-green-500/20 text-green-400 border border-green-500/40"
            : isDarkMode
              ? "bg-accent-primary text-black hover:bg-accent-primary/80 border border-transparent"
              : "bg-slate-900 text-white hover:bg-slate-700 border border-slate-700"}`}
      >
        {sent ? (
          <><CheckIcon style={{ fontSize: 16 }} /> Message Dispatched</>
        ) : (
          <><SendIcon style={{ fontSize: 16 }} /> Send Message</>
        )}
      </motion.button>
    </form>
  );
};

/* ─── Main Contact Section ──────────────────────────────────────────────── */

export const Contact: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <section
      id="contact"
      className="relative py-32 px-6 md:px-10 overflow-hidden"
    >
      {/* Ambient background blobs */}
      <div
        className="absolute -top-64 -left-64 w-[600px] h-[600px] rounded-full opacity-[0.06] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--accent-primary), transparent)" }}
      />
      <div
        className="absolute -bottom-64 -right-64 w-[500px] h-[500px] rounded-full opacity-[0.05] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #5B9CF6, transparent)" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ── Header ── */}
        <FadeSection direction="down" delay={0.1}>
          <div className="mb-20">
            <span className={`text-4xl font-mono font-bold tracking-tighter ${isDarkMode ? "text-accent-primary" : "text-blue-500"}`}>
              / contact
            </span>
            <p className={`mt-4 text-base max-w-md leading-relaxed ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>
              Have an idea, an opportunity, or just want to say hello? Let's build something exceptional together.
            </p>
          </div>
        </FadeSection>

        {/* ── Body — Two Columns ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* LEFT — Info + Terminal */}
          <FadeSection direction="left" delay={0.2}>
            <div className="space-y-6">
              {/* Terminal */}
              <TerminalBlock isDarkMode={isDarkMode} />

              {/* Contact Info Chips */}
              <div className="space-y-3 pt-2">
                {CONTACT_INFO.map(item => (
                  <CopyChip key={item.id} item={item} isDarkMode={isDarkMode} />
                ))}
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3 pt-2">
                {SOCIAL_LINKS.map(link => (
                  <MagneticSocial key={link.label} link={link} isDarkMode={isDarkMode} />
                ))}
              </div>
            </div>
          </FadeSection>

          {/* RIGHT — Form */}
          <FadeSection direction="right" delay={0.3}>
            {isDarkMode ? (
              <BorderGlow
                borderRadius={32}
                glowColor="180 80 80"
                backgroundColor="#131316"
                glowIntensity={0.9}
                glowRadius={50}
                animated={true}
                className="h-full"
              >
                <div className="p-8 md:p-10">
                  <h3 className="text-xl font-display font-bold tracking-tight text-slate-100 mb-1">
                    Send a Message
                  </h3>
                  <p className="text-slate-500 font-mono text-xs tracking-widest uppercase mb-8">
                    — I'll get back within 24 hrs
                  </p>
                  <ContactForm isDarkMode={isDarkMode} />
                </div>
              </BorderGlow>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100 p-8 md:p-10">
                <h3 className="text-xl font-display font-bold tracking-tight text-slate-900 mb-1">
                  Send a Message
                </h3>
                <p className="text-slate-400 font-mono text-xs tracking-widest uppercase mb-8">
                  — I'll get back within 24 hrs
                </p>
                <ContactForm isDarkMode={isDarkMode} />
              </div>
            )}
          </FadeSection>
        </div>

        {/* ── Footer rule ── */}
        <FadeSection direction="up" delay={0.5}>
          <div className={`mt-24 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4
            ${isDarkMode ? "border-white/5" : "border-slate-200"}`}>
            <span className={`font-mono text-[10px] tracking-[0.4em] uppercase ${isDarkMode ? "text-slate-600" : "text-slate-400"}`}>
              © 2026 Vignesh T. — Built with React + TypeScript
            </span>
            <span className={`font-mono text-[10px] tracking-[0.4em] uppercase ${isDarkMode ? "text-slate-600" : "text-slate-400"}`}>
              Coimbatore, TN — India
            </span>
          </div>
        </FadeSection>
      </div>
    </section>
  );
};
