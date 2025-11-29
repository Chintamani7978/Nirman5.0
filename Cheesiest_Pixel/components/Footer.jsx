import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-t border-slate-200 dark:border-slate-800 pt-20 pb-10 overflow-hidden font-sans text-slate-600 dark:text-slate-400 transition-colors duration-300">

            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Quote Section (Pre-footer) */}
                <div className="mb-20 text-center max-w-3xl mx-auto animate-fade-in-up">
                    <Activity className="w-8 h-8 mx-auto text-primary mb-6 animate-pulse-slow" />
                    <blockquote className="text-2xl md:text-3xl font-display font-light italic text-slate-800 dark:text-white leading-relaxed">
                        "The art of healing comes from nature, not from the physician. Therefore the physician must start from nature, with an open mind."
                    </blockquote>
                    <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                        <span className="w-8 h-px bg-slate-300 dark:bg-slate-700"></span>
                        <span>Paracelsus</span>
                        <span className="w-8 h-px bg-slate-300 dark:bg-slate-700"></span>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20 border-b border-slate-200 dark:border-slate-800 pb-12">

                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg text-white shadow-lg shadow-primary/20">
                                <Activity size={20} />
                            </div>
                            <span className="font-display font-bold text-xl text-slate-800 dark:text-white tracking-tight">
                                Samhita<span className="text-secondary dark:text-dark-secondary">Fusion</span>
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed max-w-xs text-slate-500 dark:text-slate-400">
                            Bridging the gap between ancient Ayurvedic wisdom and modern medical diagnostics through artificial intelligence.
                        </p>
                        <div className="pt-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-white">
                                <span>Made with</span>
                                <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
                                <span>in India</span>
                            </div>
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-wider">Platform</h4>
                        <ul className="space-y-4 text-sm">
                            {['Home', 'About', 'Pricing', 'Contact'].map(item => (
                                <li key={item}>
                                    <Link
                                        to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                        className="hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-primary transition-colors scale-0 group-hover:scale-100 duration-300"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-wider">Resources</h4>
                        <ul className="space-y-4 text-sm">
                            {['Documentation', 'Research Papers', 'API Status', 'Community'].map(item => (
                                <li key={item}>
                                    <a href="#" className="hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-primary transition-colors scale-0 group-hover:scale-100 duration-300"></span>
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect Column */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-wider">Stay Connected</h4>

                        {/* Social Buttons (Custom Animated) */}
                        <div className="flex gap-3">
                            {/* Instagram */}
                            <div className="social-button">
                                <button className="relative w-10 h-10 rounded-full group cursor-pointer" aria-label="Instagram">
                                    <div className="floater w-full h-full absolute top-0 left-0 bg-violet-400 rounded-full duration-300 group-hover:-top-6 group-hover:shadow-xl" />
                                    <div className="icon relative z-10 w-full h-full flex items-center justify-center border-2 border-violet-400 rounded-full bg-transparent transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 22 22" fill="none">
                                            <path className="group-hover:fill-violet-900 fill-white dark:fill-slate-900 dark:group-hover:fill-white duration-300" d="M21.94 6.46809C21.8884 5.2991 21.6994 4.49551 21.4285 3.79911C21.1492 3.05994 20.7194 2.39818 20.1564 1.84802C19.6062 1.28932 18.9401 0.855163 18.2094 0.580194C17.5091 0.309437 16.7096 0.120336 15.5407 0.0688497C14.363 0.0128932 13.9891 0 11.0022 0C8.01527 0 7.64141 0.0128932 6.46808 0.064466C5.29914 0.116039 4.49551 0.305225 3.79932 0.57581C3.05994 0.855163 2.39818 1.28494 1.84802 1.84802C1.28932 2.39813 0.855377 3.06428 0.580193 3.7949C0.309437 4.49551 0.120379 5.2948 0.0688496 6.4637C0.0129362 7.64141 0 8.01527 0 11.0022C0 13.9891 0.0129362 14.363 0.0644659 15.5363C0.116039 16.7053 0.305225 17.5089 0.576025 18.2053C0.855377 18.9444 1.28932 19.6062 1.84802 20.1564C2.39818 20.7151 3.06432 21.1492 3.79494 21.4242C4.49547 21.6949 5.29476 21.884 6.46391 21.9355C7.63702 21.9873 8.0111 22 10.998 22C13.9849 22 14.3588 21.9873 15.5321 21.9355C16.7011 21.884 17.5047 21.695 18.2009 21.4242C18.9321 21.1415 19.5961 20.7091 20.1505 20.1548C20.7048 19.6005 21.1373 18.9365 21.42 18.2053C21.6906 17.5047 21.8798 16.7052 21.9314 15.5363C21.9829 14.363 21.9958 13.9891 21.9958 11.0022C21.9958 8.01527 21.9914 7.64137 21.94 6.46809ZM19.9588 15.4503C19.9114 16.5248 19.731 17.105 19.5805 17.4918C19.2109 18.4502 18.4502 19.2109 17.4918 19.5805C17.105 19.731 16.5206 19.9114 15.4503 19.9586C14.29 20.0103 13.942 20.023 11.0066 20.023C8.07118 20.023 7.71881 20.0103 6.56259 19.9586C5.48816 19.9114 4.90796 19.731 4.52117 19.5805C4.04425 19.4043 3.61014 19.1249 3.25772 18.7596C2.89242 18.4029 2.61306 17.9731 2.43677 17.4961C2.28635 17.1094 2.10589 16.5248 2.05874 15.4547C2.007 14.2943 1.99428 13.9461 1.99428 11.0107C1.99428 8.07535 2.007 7.72298 2.05874 6.56698C2.10589 5.49254 2.28635 4.91235 2.43677 4.52555C2.61306 4.04842 2.89241 3.61439 3.26211 3.26189C3.61865 2.89658 4.04842 2.61723 4.52555 2.44115C4.91235 2.29073 5.49692 2.11023 6.56697 2.06291C7.72736 2.01134 8.07556 1.99844 11.0107 1.99844C13.9505 1.99844 14.2985 2.01134 15.4547 2.06291C16.5292 2.11027 17.1093 2.29069 17.4961 2.44111C17.9731 2.61723 18.4072 2.89658 18.7596 3.26189C19.1249 3.61865 19.4042 4.04842 19.5805 4.52555C19.731 4.91235 19.9114 5.49671 19.9587 6.56698C20.0103 7.72736 20.0232 8.07535 20.0232 11.0107C20.0232 13.9461 20.0104 14.29 19.9588 15.4503Z" />
                                            <path className="group-hover:fill-violet-900 fill-white dark:fill-slate-900 dark:group-hover:fill-white duration-300" d="M11.0026 5.35054C7.88252 5.35054 5.35107 7.88182 5.35107 11.0021C5.35107 14.1223 7.88252 16.6536 11.0026 16.6536C14.1227 16.6536 16.6541 14.1223 16.6541 11.0021C16.6541 7.88182 14.1227 5.35054 11.0026 5.35054ZM11.0026 14.668C8.97844 14.668 7.33654 13.0264 7.33654 11.0021C7.33654 8.97774 8.97844 7.33609 11.0025 7.33609C13.0269 7.33609 14.6685 8.97774 14.6685 11.0021C14.6685 13.0264 13.0268 14.668 11.0026 14.668ZM18.1971 5.12706C18.1971 5.85569 17.6063 6.44646 16.8775 6.44646C16.1489 6.44646 15.5581 5.85569 15.5581 5.12706C15.5581 4.39833 16.1489 3.80774 16.8775 3.80774C17.6063 3.80774 18.1971 4.39829 18.1971 5.12706Z" />
                                        </svg>
                                    </div>
                                </button>
                            </div>

                            {/* GitHub - Black */}
                            <div className="social-button">
                                <button className="relative w-10 h-10 rounded-full group cursor-pointer" aria-label="GitHub">
                                    <div className="floater w-full h-full absolute top-0 left-0 bg-slate-900 dark:bg-white rounded-full duration-300 group-hover:-top-6 group-hover:shadow-xl" />
                                    <div className="icon relative z-10 w-full h-full flex items-center justify-center border-2 border-slate-900 dark:border-white rounded-full bg-transparent transition-colors">
                                        <svg height={20} width={20} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path className="group-hover:fill-slate-900 fill-white dark:fill-slate-900 dark:group-hover:fill-white duration-300" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.17 6.839 9.481.5.092.683-.217.683-.481 0-.237-.009-.866-.013-1.699-2.782.603-3.37-1.338-3.37-1.338-.454-1.15-1.11-1.458-1.11-1.458-.906-.619.069-.606.069-.606 1.002.071 1.527 1.03 1.527 1.03.89 1.529 2.34 1.087 2.911.831.091-.645.348-1.087.634-1.338-2.22-.252-4.555-1.11-4.555-4.94 0-1.09.39-1.986 1.028-2.682-.103-.252-.446-1.268.098-2.642 0 0 .837-.268 2.75 1.024a9.563 9.563 0 012.496-.335 9.58 9.58 0 012.496.335c1.913-1.292 2.75-1.024 2.75-1.024.544 1.374.202 2.39.1 2.642.64.696 1.027 1.592 1.027 2.682 0 3.839-2.338 4.685-4.567 4.933.358.309.678.916.678 1.847 0 1.334-.012 2.412-.012 2.74 0 .267.18.577.688.481A12.01 12.01 0 0022 12c0-5.523-4.477-10-10-10z" />
                                        </svg>
                                    </div>
                                </button>
                            </div>

                            {/* LinkedIn - Blue */}
                            <div className="social-button">
                                <button className="relative w-10 h-10 rounded-full group cursor-pointer" aria-label="LinkedIn">
                                    <div className="floater w-full h-full absolute top-0 left-0 bg-blue-500 rounded-full duration-300 group-hover:-top-6 group-hover:shadow-xl" />
                                    <div className="icon relative z-10 w-full h-full flex items-center justify-center border-2 border-blue-500 rounded-full bg-transparent transition-colors">
                                        <svg height={20} width={20} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path className="group-hover:fill-blue-900 fill-white dark:fill-slate-900 dark:group-hover:fill-white duration-300" d="M20,2H4C2.9,2,2,2.9,2,4v16c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M8.5,19H6V10h2.5V19z M7.3,9 h-0.1C6.4,9,6,8.6,6,8.1V7.9c0-0.5,0.4-0.9,0.9-0.9h0.1C7.6,7,8,7.4,8,7.9v0.1C8,8.6,7.6,9,7.3,9z M19,19h-2.5v-4.9 c0-1.2-0.4-2-1.4-2c-0.8,0-1.3,0.6-1.5,1.2h-0.1V19H10V10h2.3v1.3h0C12.7,10.7,14,9.9,15.5,9.9c2.1,0,3.5,1.4,3.5,3.8V19z" />
                                        </svg>
                                    </div>
                                </button>
                            </div>

                            {/* YouTube - Red */}
                            <div className="social-button">
                                <button className="relative w-10 h-10 rounded-full group cursor-pointer" aria-label="YouTube">
                                    <div className="floater w-full h-full absolute top-0 left-0 bg-red-500 rounded-full duration-300 group-hover:-top-6 group-hover:shadow-xl" />
                                    <div className="icon relative z-10 w-full h-full flex items-center justify-center border-2 border-red-500 rounded-full bg-transparent transition-colors">
                                        <svg height={20} width={20} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path className="group-hover:fill-red-900 fill-white dark:fill-slate-900 dark:group-hover:fill-white duration-300" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                        </svg>
                                    </div>
                                </button>
                            </div>

                        </div>

                        {/* Newsletter */}
                        <div className="relative mt-6">
                            <input
                                type="email"
                                placeholder="Enter email for updates"
                                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary dark:focus:border-primary rounded-full py-3 pl-4 pr-12 text-sm outline-none transition-all placeholder:text-slate-400"
                            />
                            <button className="absolute right-1 top-1 bottom-1 bg-white dark:bg-slate-700 hover:bg-primary hover:text-white dark:hover:text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-sm text-slate-500">
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>

                </div>

                {/* Footer Bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    <p>&copy; {new Date().getFullYear()} SamhitaFusion Health Systems.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-primary transition-colors">Sitemap</a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
