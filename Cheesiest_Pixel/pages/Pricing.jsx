import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check, Shield, Zap, Globe, Heart, Star, Sparkles, Building2,
    Stethoscope, Users, Database, Lock, Activity, Server, Loader2,
    CreditCard, Smartphone, Building, ShieldCheck, CheckCircle,
    ArrowLeft, QrCode, Wallet, FileText, Printer, ArrowRight
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import ParticleBackground from '../components/ParticleBackground';
import { UserRole } from '../types';

// --- Mock Database & Payment Service ---
const SubscriptionDB = {
    createSubscriptionIntent: async (planId, planName, price) => {
        console.log(`[DB_WRITE] Creating order for Plan: ${planName} (${planId})`);
        return new Promise((resolve) => {
            setTimeout(() => {
                const txId = `tx_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
                resolve({
                    success: true,
                    transactionId: txId
                });
            }, 1500);
        });
    }
};

const PRICING_DATA = [
    {
        id: "pat_free",
        category: "Patients",
        title: "Always Free",
        price: "₹0",
        features: ["No charges for signup", "View all records", "Download reports", "QR card access", "Basic reminders"],
        color: "from-emerald-400 to-emerald-600",
        icon: <Heart className="w-5 h-5 text-white" />,
        popular: false,
        role: UserRole.PATIENT
    },
    {
        id: "doc_starter",
        category: "Individual Doctors",
        title: "Starter Plan",
        price: "Free",
        features: ["Up to 150 patient records", "Basic dashboard", "Visit history", "Simple appointment management", "Community forum access"],
        color: "from-blue-400 to-blue-600",
        icon: <Stethoscope className="w-5 h-5 text-white" />,
        popular: false,
        role: UserRole.DOCTOR
    },
    {
        id: "doc_pro",
        category: "Individual Doctors",
        title: "Professional",
        price: "₹99",
        suffix: "/mo",
        features: ["Unlimited patient records", "Advanced analytics", "QR health cards for patients", "PDF report export", "Prescription templates", "Priority email support"],
        color: "from-indigo-400 to-indigo-600",
        icon: <Star className="w-5 h-5 text-white" />,
        popular: true,
        role: UserRole.DOCTOR
    },
    {
        id: "clin_basic",
        category: "Clinics",
        title: "Clinic Basic",
        price: "₹499",
        suffix: "/mo",
        features: ["Up to 10 staff accounts", "Shared clinic dashboard", "Appointment calendar", "Bulk CSV import/export", "Role-based access"],
        color: "from-purple-400 to-purple-600",
        icon: <Building2 className="w-5 h-5 text-white" />,
        popular: true,
        role: UserRole.DOCTOR
    },
    {
        id: "clin_plus",
        category: "Clinics",
        title: "Clinic Plus",
        price: "₹1,499",
        suffix: "/mo",
        features: ["Unlimited staff accounts", "Custom branded portal", "Advanced analytics", "Teleconsult slots", "WhatsApp/SMS reminders"],
        color: "from-fuchsia-500 to-pink-600",
        icon: <Sparkles className="w-5 h-5 text-white" />,
        popular: false,
        role: UserRole.DOCTOR
    },
    {
        id: "res_lite",
        category: "Research",
        title: "Research Lite",
        price: "₹999",
        suffix: "/mo",
        features: ["Access to anonymised datasets", "Filters & cohort builder", "CSV export for analysis", "Trend visualizations", "Basic API Access"],
        color: "from-orange-400 to-orange-600",
        icon: <Globe className="w-5 h-5 text-white" />,
        popular: false,
        role: UserRole.RESEARCHER
    },
    {
        id: "res_pro",
        category: "Research",
        title: "Research Pro",
        price: "₹2,499",
        suffix: "/mo",
        features: ["Full API access", "Comparative outcome dashboards", "Support for funded projects", "Online onboarding/training", "Publication tools"],
        color: "from-red-500 to-rose-600",
        icon: <Zap className="w-5 h-5 text-white" />,
        popular: false,
        role: UserRole.RESEARCHER
    },
    {
        id: "ent_hosp",
        category: "Enterprise",
        title: "Hospitals",
        price: "Custom",
        suffix: "",
        features: ["Multi-branch analytics", "Deep integration (HL7/FHIR)", "Custom workflows", "Dedicated support & SLAs", "On-premise options"],
        color: "from-slate-500 to-slate-700",
        icon: <Shield className="w-5 h-5 text-white" />,
        popular: false,
        role: UserRole.ADMIN
    },
    {
        id: "soc_impact",
        category: "Social Impact",
        title: "Govt / Trust",
        price: "Subsidized",
        suffix: "",
        features: ["Eligible for Free Pro/Clinic Plans", "Verification required", "Equitable access priority", "Full feature set included", "Community support"],
        color: "from-teal-400 to-teal-600",
        icon: <Users className="w-5 h-5 text-white" />,
        popular: false,
        role: UserRole.ADMIN
    }
];

// --- Sub-Components ---

const SystemMetrics = () => {
    const [logIndex, setLogIndex] = useState(0);
    const LIVE_LOGS = [
        "Encrypted record #8921 stored in Vault-A",
        "New practitioner registration: Dr. A. Gupta",
        "AI Model v2.5 inference complete (23ms)",
        "Syncing Ayurveda dataset with WHO-11 standards...",
        "Backup completed successfully.",
        "Real-time vitals stream active for Patient #4421",
        "Tele-consultation session started in Sector-4"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setLogIndex(prev => (prev + 1) % LIVE_LOGS.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-5xl mx-auto mb-20 bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 shadow-xl"
        >
            <div className="flex-1 grid grid-cols-2 gap-4">
                {[
                    { icon: Database, color: "text-blue-500", label: "Secured Records", value: "2.4M+" },
                    { icon: Server, color: "text-emerald-500", label: "Uptime", value: "99.99%" },
                    { icon: Lock, color: "text-purple-500", label: "Encryption", value: "AES-256" },
                    { icon: Activity, color: "text-orange-500", label: "Daily AI Scans", value: "~50k" },
                ].map((item, i) => (
                    <div key={i} className="bg-white/60 dark:bg-white/5 p-4 rounded-2xl border border-white/20 dark:border-white/5 flex flex-col justify-center hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center gap-2 mb-2">
                            <item.icon className={`w-4 h-4 ${item.color}`} />
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{item.label}</span>
                        </div>
                        <span className="text-2xl font-black text-slate-800 dark:text-white">{item.value}</span>
                    </div>
                ))}
            </div>

            <div className="flex-1 bg-slate-900 rounded-2xl p-4 font-mono text-xs overflow-hidden relative shadow-inner border border-slate-800 group">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-slate-400">LIVE SYSTEM FEED</span>
                </div>
                <div className="space-y-2 h-[120px] overflow-hidden flex flex-col justify-end">
                    <AnimatePresence mode='popLayout'>
                        {LIVE_LOGS.slice(Math.max(0, logIndex - 3), logIndex + 1).map((log, i) => (
                            <motion.div
                                key={log + i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-emerald-400 truncate"
                            >
                                <span className="text-slate-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                {log}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[10px] w-full animate-scan pointer-events-none" />
            </div>
        </motion.div>
    );
};

const PricingCard = ({ plan, index, onSelect, isProcessing }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            className="relative w-full h-full"
        >
            {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <span className={`bg-gradient-to-r ${plan.color} text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg flex items-center gap-1`}>
                        <Star className="w-3 h-3 fill-current" /> Most Popular
                    </span>
                </div>
            )}
            <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`relative h-full bg-white/70 dark:bg-slate-800/60 backdrop-blur-2xl border ${plan.popular ? 'border-blue-500/30 dark:border-blue-400/30 shadow-blue-500/10' : 'border-white/50 dark:border-slate-700/50'} p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl overflow-hidden flex flex-col group`}
            >
                <div className={`absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br ${plan.color} blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-full pointer-events-none`} />
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${plan.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10 flex flex-col items-center text-center mb-8">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        {plan.icon}
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 opacity-80">{plan.category}</h3>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{plan.title}</h2>
                    <div className="flex items-end justify-center gap-1">
                        <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">{plan.price}</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1.5">{plan.suffix}</span>
                    </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mb-8" />

                <div className="flex-1 space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 group/item">
                            <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center group-hover/item:bg-gradient-to-r group-hover/item:${plan.color} transition-all duration-300`}>
                                <Check size={12} className="text-slate-400 dark:text-slate-500 group-hover/item:text-white transition-colors" strokeWidth={3} />
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-300 leading-tight font-medium">{feature}</span>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => onSelect(plan)}
                    disabled={isProcessing}
                    className="w-full py-4 rounded-2xl font-bold text-white shadow-lg shadow-slate-200/50 dark:shadow-black/50 bg-slate-900 dark:bg-white dark:text-slate-900 hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-70 transition-all duration-300 relative overflow-hidden group/btn mt-auto"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Choose Plan {plan.price !== '₹0' && plan.price !== 'Free' && <CreditCard className="w-4 h-4 ml-1 opacity-70" />}
                            </>
                        )}
                    </span>
                    <div className={`absolute inset-0 bg-gradient-to-r ${plan.color} opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300`} />
                </button>
            </motion.div>
        </motion.div>
    );
};

const PaymentGateway = ({ plan, onBack, onComplete }) => {
    const [method, setMethod] = useState('CARD');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const [cardNumber, setCardNumber] = useState('');

    const handlePayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            const txId = `TXN-${Math.floor(Math.random() * 1000000)}-${Date.now().toString().slice(-4)}`;
            setTransactionId(txId);
            setIsProcessing(false);
            setIsSuccess(true);
        }, 2500);
    };

    const downloadInvoice = (type) => {
        // Basic simulation of download action
        alert(`${type} Invoice for Transaction ${transactionId} downloaded.`);
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="min-h-[60vh] flex items-center justify-center p-6"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-3xl shadow-2xl text-center max-w-md w-full border border-slate-100 dark:border-slate-700"
                >
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Successful!</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                        Your subscription to <span className="font-bold text-blue-500">{plan?.title || 'Plan'}</span> is now active.
                        <br /><span className="font-mono text-xs opacity-70">Ref: {transactionId}</span>
                    </p>

                    <div className="flex gap-3 mb-8">
                        <button onClick={() => downloadInvoice('PDF')} className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors">
                            <Printer className="w-4 h-4" /> Print / PDF
                        </button>
                        <button onClick={() => downloadInvoice('CSV')} className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors">
                            <FileText className="w-4 h-4" /> CSV
                        </button>
                    </div>

                    <button
                        onClick={onComplete}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Continue to Dashboard <ArrowRight className="w-5 h-5" />
                    </button>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <div className="pt-8 pb-12 px-4 md:px-8 max-w-6xl mx-auto animate-fade-in-up">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Plans
            </button>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Payment Methods */}
                <div className="flex-1">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                <Lock className="w-5 h-5 text-green-500" /> Secure Checkout
                            </h2>
                        </div>

                        <div className="flex flex-col md:flex-row min-h-[400px]">
                            {/* Sidebar Tabs */}
                            <div className="w-full md:w-48 bg-slate-50 dark:bg-slate-900/50 p-2 flex flex-row md:flex-col gap-2 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700">
                                {['CARD', 'UPI', 'NETBANKING'].map(m => (
                                    <button
                                        key={m}
                                        onClick={() => setMethod(m)}
                                        className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${method === m ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                    >
                                        {m === 'CARD' && <CreditCard className="w-4 h-4" />}
                                        {m === 'UPI' && <Smartphone className="w-4 h-4" />}
                                        {m === 'NETBANKING' && <Building className="w-4 h-4" />}
                                        {m === 'CARD' ? 'Card' : m === 'UPI' ? 'UPI' : 'NetBanking'}
                                    </button>
                                ))}
                            </div>

                            {/* Form Area */}
                            <div className="flex-1 p-6 md:p-8 relative">
                                <AnimatePresence mode="wait">
                                    {method === 'CARD' && (
                                        <motion.div key="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Credit / Debit Card</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Card Number</label>
                                                    <div className="relative">
                                                        <input type="text" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())} maxLength={19} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-mono focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" />
                                                        <CreditCard className="absolute right-4 top-3.5 text-slate-400 w-5 h-5" />
                                                    </div>
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="flex-1">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Expiry</label>
                                                        <input type="text" placeholder="MM/YY" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-mono focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">CVV</label>
                                                        <input type="password" placeholder="123" maxLength={3} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-mono focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Card Holder Name</label>
                                                    <input type="text" placeholder="John Doe" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                    {method === 'UPI' && (
                                        <motion.div key="upi" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">UPI / QR</h3>
                                            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 mb-6">
                                                <QrCode className="w-32 h-32 text-slate-800 dark:text-white" />
                                                <p className="text-xs text-slate-500 mt-2">Scan to pay with any UPI App</p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Or Enter UPI ID</label>
                                                <div className="flex gap-2">
                                                    <input type="text" placeholder="username@okaxis" className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" />
                                                    <button className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 rounded-xl font-bold text-sm">Verify</button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                    {method === 'NETBANKING' && (
                                        <motion.div key="netbanking" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Select Bank</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                {['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'Yes Bank'].map(bank => (
                                                    <button key={bank} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition text-sm font-bold flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300">
                                                        <Building className="w-4 h-4 opacity-50" /> {bank}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/80 p-6 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                <span className="hidden sm:inline">256-bit SSL Encrypted Payment</span>
                            </div>
                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:scale-100"
                            >
                                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wallet className="w-5 h-5" />}
                                {isProcessing ? 'Processing...' : `Pay ${plan?.price || 'Now'}`}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="w-full lg:w-96">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 sticky top-24">
                        <h3 className="font-bold text-lg mb-6 text-slate-900 dark:text-white">Order Summary</h3>

                        <div className="flex gap-4 mb-6">
                            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${plan?.color || 'from-slate-500 to-slate-700'} flex items-center justify-center text-white shadow-lg`}>
                                <Building className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{plan?.category || 'Subscription'}</p>
                                <h4 className="font-bold text-xl text-slate-900 dark:text-white">{plan?.title || 'Selected Plan'}</h4>
                                <p className="text-sm text-slate-500">{plan?.suffix || 'Monthly'}</p>
                            </div>
                        </div>

                        <div className="space-y-3 py-6 border-t border-b border-slate-100 dark:border-slate-700 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Subtotal</span>
                                <span className="font-mono font-medium text-slate-900 dark:text-white">{plan?.price}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Tax (18% GST)</span>
                                <span className="font-mono font-medium text-slate-900 dark:text-white">Included</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-green-500">Discount</span>
                                <span className="font-mono font-medium text-green-500">-₹0</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-2">
                            <span className="font-bold text-lg text-slate-900 dark:text-white">Total</span>
                            <span className="font-black text-3xl text-blue-600 dark:text-blue-400">{plan?.price}</span>
                        </div>
                        <p className="text-xs text-slate-400 text-right mb-6">Recurring billing. Cancel anytime.</p>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex gap-3 items-start">
                            <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-blue-700 dark:text-blue-300">SamhitaFusion Guarantee</p>
                                <p className="text-[10px] text-blue-600/80 dark:text-blue-400/80">If you're not satisfied with our AI diagnostics, get a full refund within 14 days.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Pricing Component ---
const Pricing = ({ onLoginClick }) => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    const handlePlanSelect = async (plan) => {
        if (processingId) return;

        // For free plans, skip payment
        if (plan.price === '₹0' || plan.price === 'Free') {
            onLoginClick(plan.role);
            return;
        }

        setProcessingId(plan.id);
        try {
            const result = await SubscriptionDB.createSubscriptionIntent(plan.id, plan.title, plan.price);
            if (result.success) {
                setProcessingId(null);
                setSelectedPlan(plan);
            }
        } catch (error) {
            console.error("Subscription failed", error);
            setProcessingId(null);
        }
    };

    const handlePaymentComplete = () => {
        // After payment, log the user in based on the plan role
        if (selectedPlan) {
            onLoginClick(selectedPlan.role);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg font-sans transition-colors duration-300 relative overflow-x-hidden">
            <ParticleBackground />

            {/* Render Navbar only if not in payment flow to reduce distractions */}
            {!selectedPlan && <PublicNavbar onLoginClick={onLoginClick} />}

            <AnimatePresence mode="wait">
                {selectedPlan ? (
                    <motion.div
                        key="payment"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="relative z-10"
                    >
                        <PaymentGateway
                            plan={selectedPlan}
                            onBack={() => setSelectedPlan(null)}
                            onComplete={handlePaymentComplete}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="pricing"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="pt-32 pb-24 px-4 md:px-8 relative z-10"
                    >
                        {/* Soft Background Blobs */}
                        <div className="fixed top-20 left-10 w-[500px] h-[500px] bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
                        <div className="fixed bottom-20 right-10 w-[600px] h-[600px] bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />

                        <div className="max-w-7xl mx-auto">
                            {/* Header Section */}
                            <div className="text-center mb-12">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                >
                                    <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-4 border border-blue-100 dark:border-blue-800">
                                        Flexible Plans
                                    </span>
                                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                                        Healthcare for <br className="md:hidden" />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">Everyone.</span>
                                    </h1>
                                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
                                        From solo practitioners to enterprise hospitals. <br />
                                        Start for free, scale when you need to.
                                    </p>
                                </motion.div>
                            </div>

                            {/* System Metrics Dashboard */}
                            <SystemMetrics />

                            {/* Grid Layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
                                {PRICING_DATA.map((plan, index) => (
                                    <PricingCard
                                        key={index}
                                        plan={plan}
                                        index={index}
                                        onSelect={handlePlanSelect}
                                        isProcessing={processingId === plan.id}
                                    />
                                ))}
                            </div>

                            {/* Trust Footer */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                                className="mt-24 text-center border-t border-slate-200 dark:border-slate-800 pt-12"
                            >
                                <p className="text-sm text-slate-400 dark:text-slate-500 font-mono uppercase tracking-widest mb-6">Trusted by innovators at</p>
                                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                                    <span className="text-xl font-bold font-serif text-slate-600 dark:text-slate-400">Apollo</span>
                                    <span className="text-xl font-bold font-sans text-slate-600 dark:text-slate-400">AIIMS</span>
                                    <span className="text-xl font-bold font-mono text-slate-600 dark:text-slate-400">Practo</span>
                                    <span className="text-xl font-bold italic text-slate-600 dark:text-slate-400">Tata Health</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Pricing;
