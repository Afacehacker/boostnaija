import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ChevronLeft, Shield, AlertTriangle, FileText, User, CreditCard, Ban, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Section = ({ icon, title, children, isDark }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`rounded-3xl border p-8 md:p-10 mb-6 ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}
  >
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <h2 className={`text-xl md:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
    </div>
    <div className={`space-y-3 text-sm leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
      {children}
    </div>
  </motion.div>
);

const TermsAndConditions = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className={`border-b ${isDark ? 'border-white/10 bg-slate-900' : 'border-slate-200 bg-white'} sticky top-0 z-50 backdrop-blur-lg`}>
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className={`flex items-center gap-2 font-bold text-sm uppercase tracking-widest transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
            <ChevronLeft size={16} /> Back to Home
          </Link>
          <span className="text-primary font-black text-lg tracking-tighter">BOOST<span className={isDark ? 'text-white' : 'text-slate-900'}>NAIJA</span></span>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-3xl">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-black uppercase tracking-widest text-[10px] mb-6">
            <FileText size={14} /> Legal Document
          </div>
          <h1 className={`text-4xl md:text-6xl font-black tracking-tighter mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Terms & <span className="text-primary italic">Conditions</span>
          </h1>
          <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Last updated: March 2026 &nbsp;·&nbsp; Effective immediately upon registration
          </p>
        </motion.div>

        {/* Intro */}
        <div className={`rounded-3xl border p-8 mb-6 ${isDark ? 'bg-primary/5 border-primary/20' : 'bg-primary/5 border-primary/10'}`}>
          <p className={`text-sm leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Welcome to <strong>BoostNaija</strong>. By creating an account or using our platform, you agree to be fully bound by these Terms and Conditions. Please read them carefully before proceeding. If you do not agree with any part, do not use this service.
          </p>
        </div>

        <Section icon={<User size={22} />} title="1. Eligibility & Account Responsibility" isDark={isDark}>
          <p>You must be at least <strong>13 years of age</strong> to use BoostNaija. By registering, you confirm that all information provided is accurate and up-to-date.</p>
          <p>You are solely responsible for maintaining the confidentiality of your account credentials. Any activity carried out under your account is your responsibility.</p>
          <p>BoostNaija reserves the right to suspend or permanently ban accounts found to be impersonating others, sharing accounts, or providing false information during registration.</p>
        </Section>

        <Section icon={<CreditCard size={22} />} title="2. Payments, Wallet & Refunds" isDark={isDark}>
          <p>All payments made to fund your wallet are <strong>non-refundable</strong> once processed, except in cases where BoostNaija is unable to deliver an ordered service.</p>
          <p>Wallet funds may only be used to purchase services available on our platform. They cannot be withdrawn or transferred to another user or third-party account.</p>
          <p>In cases where a service order fails or is only partially completed due to a platform error, the outstanding amount will be refunded to your wallet balance (not to your original payment method).</p>
          <p>BoostNaija uses secure third-party payment processors (Paystack, Flutterwave). We do not store your card details.</p>
        </Section>

        <Section icon={<Shield size={22} />} title="3. Service Usage & Acceptable Use" isDark={isDark}>
          <p>BoostNaija provides social media marketing (SMM) services including followers, likes, views, and engagement. These services are for <strong>lawful promotional purposes only</strong>.</p>
          <p>You agree <strong>not</strong> to use our services for:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Promoting illegal, harmful, or abusive content</li>
            <li>Spamming, harassment, or targeted abuse</li>
            <li>Circumventing platform rules of any social network</li>
            <li>Reselling services without prior written permission from BoostNaija</li>
          </ul>
          <p>BoostNaija does not guarantee permanent retention of delivered followers, likes, or views, as this depends on the policies of third-party platforms (Instagram, TikTok, YouTube, etc.).</p>
        </Section>

        <Section icon={<Ban size={22} />} title="4. Account Suspension & Termination" isDark={isDark}>
          <p>BoostNaija reserves the right to <strong>suspend or permanently terminate</strong> any account at our sole discretion, without prior notice, if:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>You violate any part of these Terms and Conditions</li>
            <li>Fraudulent activity or chargebacks are detected on your account</li>
            <li>You attempt to abuse or exploit our platform, services, or referral system</li>
            <li>Any illegal activity is associated with your account</li>
          </ul>
          <p>Suspended accounts forfeit any remaining wallet balance and are not eligible for refunds.</p>
        </Section>

        <Section icon={<AlertTriangle size={22} />} title="5. Limitation of Liability" isDark={isDark}>
          <p>BoostNaija is provided <strong>"as is"</strong> without warranties of any kind, express or implied. We do not guarantee uninterrupted or error-free service.</p>
          <p>To the fullest extent allowed by law, BoostNaija shall not be liable for any indirect, incidental, or consequential damages arising from your use of or inability to use the platform.</p>
          <p>Our total liability to you for any claim shall not exceed the total amount deposited in your wallet in the 30 days preceding the claim.</p>
        </Section>

        <Section icon={<HelpCircle size={22} />} title="6. Privacy & Data" isDark={isDark}>
          <p>We collect basic account information (name, email) to operate and improve our services. We do not sell your personal data to third parties.</p>
          <p>By registering, you consent to receiving important service-related emails. You may opt out of marketing messages at any time via your account settings.</p>
          <p>BoostNaija may use cookies and analytics tools to improve the user experience on our platform.</p>
        </Section>

        <Section icon={<FileText size={22} />} title="7. Changes to These Terms" isDark={isDark}>
          <p>BoostNaija reserves the right to update these Terms and Conditions at any time. Continued use of the platform after updates constitutes acceptance of the revised terms.</p>
          <p>We will notify users of significant changes via email or an in-platform notification where possible.</p>
        </Section>

        {/* Contact */}
        <div className={`rounded-3xl border p-8 text-center ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}>
          <p className={`text-sm font-medium mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Questions about these terms? Reach us on TikTok or Telegram.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://www.tiktok.com/@boostnaija" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary font-black text-sm hover:bg-primary hover:text-white transition-all">
              TikTok: @boostnaija
            </a>
            <a href="https://t.me/everythinglogs01" target="_blank" rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl border font-black text-sm transition-all ${isDark ? 'border-white/10 text-slate-300 hover:bg-white/5' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
              Telegram: @everythinglogs01
            </a>
          </div>
        </div>

        <p className={`text-center text-xs font-medium mt-8 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
          © 2026 BoostNaija. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
