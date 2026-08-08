import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, waitForCurrentUser, signOut } from '../lib/firebase'
import { api } from '../lib/api'
import ReactMarkdown from 'react-markdown'
import { 
    ChevronLeft, 
    ChevronRight, 
    User, 
    Plus, 
    LogOut, 
    Loader2, 
    Menu, 
    LogIn,
    ArrowRight,
    Copy,
    Check,
    Trash2,
    X, 
    ExternalLink,
    Coins,
    Database, 
    FileText,
    Heart,
    MessageSquare,
    Sparkles,
    BookOpen,
    Gift,
    Cpu,
    ArrowUpRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// --- CUSTOM CSS & ANIMATIONS ---
const animationStyles = `
/* Custom Scrollbar */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
::-webkit-scrollbar-track {
    background: transparent;
}
::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
    background: #B8860B;
}

/* Animations */
@keyframes pop-in {
    0% { opacity: 0; transform: scale(0.95) translateY(10px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-pop-in {
    animation: pop-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes shimmer-text {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
}
.shimmer-text {
    background: linear-gradient(to right, #B8860B 20%, #FFD700 40%, #FFD700 60%, #B8860B 80%);
    background-size: 200% auto;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    animation: shimmer-text 3s linear infinite;
}

@keyframes shimmer-bar {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}
.shimmer-bar-bg {
    position: relative;
    overflow: hidden;
    background: #1a1a1a;
}
.shimmer-bar-bg::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.4), transparent);
    animation: shimmer-bar 1.5s infinite;
}

@keyframes deplete-timer {
    from { width: 100%; }
    to { width: 0%; }
}
.animate-deplete {
    animation: deplete-timer 7s linear forwards;
}
`;

// ... (Konstanta Data Prompt) ...
const SUGGESTED_PROMPTS = [
    "Explain the ruling on triple talaq at once in the Shafi'i Madhhab, including evidence from Hadith.",
    "What are the differences in scholars' views regarding the minimum amount of marriage dowry?",
    "What are the correct procedures for the lunar eclipse prayer (Khusuf) based on the Prophet's Hadith?",
    "What are the pillars and conditions for valid buying and selling (muamalah) in Islam?",
    "Please find the most authentic iftitah prayer and mention its sanad.",
    "Explain the tafsir of Surah Al-Kahfi verses 60-82 (The story of Prophet Musa and Khidr).",
    "What are the main lessons and wisdom from Surah Yusuf as a whole?",
    "Mention the Asbabun Nuzul (reason for revelation) of Surah Al-Baqarah verse 255 (Ayat Kursi).",
    "Draft a brief taushiyah (advice) about the importance of guarding the tongue from ghibah.",
    "Find hadiths explaining the virtues of reading Surah Al-Mulk before sleeping.",
    "Plan a realistic weekly schedule for Murajaah (reviewing) 5 juz of the Qur'an.",
    "Provide practical tips for maintaining intention and consistency in memorizing the Qur'an.",
    "Mention 3 fundamental differences between rawatib sunnah prayers and dhuha prayer.",
    "Recommend Fiqh books that are mandatory for beginners to study.",
    "What is the Islamic view on usury (riba) in online transactions?",
    "Find evidence (dalil) that explains the law of Qisas."
];

const DEFAULT_SIDEBAR_WIDTH = 280;
const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH_PERCENT = 0.4;
const MOBILE_SIDEBAR_WIDTH = 280;

// --- COMPONENT RENDERERS ---

function SingleQuranicContent({ data }) {
    if (!data) return null;
    const [isVerseCopied, setIsVerseCopied] = useState(false);

    const handleCopyVerse = () => {
        if (!data.arabic_text) return;
        navigator.clipboard.writeText(data.arabic_text);
        setIsVerseCopied(true);
        setTimeout(() => setIsVerseCopied(false), 2000);
    };

    return (
        <div className="relative group my-2">
            {/* Header Ayat */}
            <div className="flex flex-wrap items-center justify-between mb-3 pb-2 border-b border-white/10 gap-2">
                <h4 className="font-bold text-sm text-[#FFD700] tracking-wide uppercase flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {data.surah_name} <span className="text-white/50">|</span> Ayat {data.ayah_number}
                </h4>
                <div className="text-xs text-white/40 font-mono">QS. {data.surah_number}:{data.ayah_number}</div>
            </div>
            
            {/* Arabic Text */}
            {data.arabic_text ? (
                <div className="relative bg-[#151515] rounded-xl p-4 sm:p-5 border border-white/5 shadow-inner">
                    <button 
                        onClick={handleCopyVerse}
                        className="absolute top-2 left-2 text-white/30 hover:text-[#FFD700] transition p-2 rounded-lg hover:bg-white/5"
                        title="Copy Verse"
                    >
                        {isVerseCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    {/* Ukuran text Arab responsif: lebih besar di desktop */}
                    <p className="text-2xl sm:text-3xl font-serif text-right leading-[2.2] text-[#E0E0D6] select-text pt-2 sm:pt-0">
                        {data.arabic_text}
                    </p>
                </div>
            ) : (
                 <p className="text-sm italic text-center text-white/30 my-2">[Arabic text not available]</p>
            )}

            {/* Translation */}
            <div className="mt-4 px-2">
                <p className="text-[14px] sm:text-[15px] leading-relaxed italic text-white/80">
                    "{data.translation}"
                </p>
            </div>

            {/* Tafsir */}
            {data.tafsir_summary && (
                <div className="mt-4 p-3 bg-[#B8860B]/10 rounded-lg border border-[#B8860B]/20">
                    <p className="text-xs text-[#FFD700] font-bold mb-1">Brief Tafsir</p>
                    <p className="text-xs text-white/70 leading-relaxed">
                        {data.tafsir_summary}
                    </p>
                </div>
            )}
        </div>
    );
}

function SingleHadithContent({ data }) {
    if (!data) return null;
    
    return (
        <div className="relative my-2">
             <div className="flex flex-wrap items-center justify-between mb-3 pb-2 border-b border-white/10 gap-2">
                <h4 className="font-bold text-sm text-[#E0E0D6] flex items-center gap-2">
                    <span className="bg-white/10 px-2 py-0.5 rounded text-xs text-[#B8860B]">HADITH</span>
                    {data.book}
                </h4>
                <div className="text-xs text-white/40 font-mono">No. {data.number}</div>
            </div>

            {data.arabic_text && (
                <div className="bg-[#151515] rounded-xl p-4 sm:p-5 border border-white/5 mb-3 shadow-inner">
                    <p className="text-xl sm:text-2xl font-serif text-right leading-[2.0] text-[#E0E0D6] select-text">{data.arabic_text}</p>
                </div>
            )}
            
            <p className="text-sm italic text-white/80 mb-2 leading-relaxed">"{data.translation}"</p>
            
            <div className="flex flex-wrap gap-2 mt-3 text-xs text-white/50">
                {data.narrator && <span className="bg-white/5 px-2 py-1 rounded border border-white/5">Narrated by: {data.narrator}</span>}
                {data.details && <span className="bg-white/5 px-2 py-1 rounded border border-white/5">{data.details}</span>}
            </div>
        </div>
    );
}

function LetterContentRenderer({ data }) {
    if (!data) return null;
    return (
        <div className="mt-4 p-4 sm:p-6 rounded-xl border border-white/10 bg-[#151515] shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#B8860B] opacity-50"></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 border-b border-white/10 pb-4 gap-2">
                <h4 className="font-bold text-lg text-[#FFD700]">{data.letter_type}</h4>
                <span className="text-xs text-white/40 font-mono">{data.date}</span>
            </div>

            <div className="space-y-1 text-sm text-white/70 mb-6">
                <p>To: <span className="text-[#E0E0D6] font-medium">{data.recipient}</span></p>
                <p>From: <span className="text-[#E0E0D6] font-medium">{data.sender}</span></p>
            </div>

            <div className="prose prose-invert prose-sm max-w-none text-white/90 leading-relaxed">
                <p className="font-medium mb-2">{data.salutation}</p>
                {data.body_paragraphs.map((p, i) => (
                    <p key={i} className="mb-3 text-justify">{p}</p>
                ))}
                <p className="mt-6 font-medium">{data.closing}</p>
            </div>
        </div>
    );
}

function DalilContainerRenderer({ quranList, hadithList }) {
    const [activeTab, setActiveTab] = useState('quran'); 
    const [activeIndex, setActiveIndex] = useState(0);

    const hasQuran = quranList && quranList.length > 0;
    const hasHadith = hadithList && hadithList.length > 0;

    useEffect(() => {
        if (hasQuran) {
            setActiveTab('quran');
            setActiveIndex(0);
        } else if (hasHadith) {
            setActiveTab('hadith');
            setActiveIndex(0);
        } else {
            setActiveIndex(0);
        }
    }, [quranList, hadithList, hasQuran, hasHadith]);

    if (!hasQuran && !hasHadith) return null;

    const activeList = activeTab === 'quran' ? quranList : hadithList;
    const activeData = activeList?.[activeIndex];

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setActiveIndex(0);
    };

    const handleIndexChange = (direction) => {
        const newIndex = activeIndex + direction;
        if (newIndex >= 0 && newIndex < activeList.length) {
            setActiveIndex(newIndex);
        }
    };

    const IndividualRenderer = activeTab === 'quran' ? SingleQuranicContent : SingleHadithContent;

    return (
        <div className="mt-6 mb-2 rounded-2xl border border-[#B8860B]/30 bg-black/20 overflow-hidden shadow-lg backdrop-blur-sm">
            {/* Tabs */}
            <div className="flex items-center bg-black/40 border-b border-white/5">
                {hasQuran && (
                    <button
                        onClick={() => handleTabChange('quran')}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 relative
                            ${activeTab === 'quran' ? 'text-[#FFD700]' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
                    >
                        Al-Qur'an <span className="ml-1 text-xs opacity-60">({quranList.length})</span>
                        {activeTab === 'quran' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFD700] shadow-[0_-2px_6px_rgba(255,215,0,0.5)]" />}
                    </button>
                )}
                {hasHadith && (
                    <button
                        onClick={() => handleTabChange('hadith')}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 relative
                            ${activeTab === 'hadith' ? 'text-[#FFD700]' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
                    >
                        Hadith <span className="ml-1 text-xs opacity-60">({hadithList.length})</span>
                        {activeTab === 'hadith' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFD700] shadow-[0_-2px_6px_rgba(255,215,0,0.5)]" />}
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className="p-3 sm:p-5 min-h-[150px]">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={`${activeTab}-${activeIndex}`}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeData ? (
                            <IndividualRenderer data={activeData} />
                        ) : (
                             <p className="text-white/30 italic text-center py-4">Data not available.</p>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Pagination */}
            {activeList && activeList.length > 1 && (
                <div className="flex justify-between items-center px-4 py-3 bg-black/20 border-t border-white/5">
                    <button
                        onClick={() => handleIndexChange(-1)}
                        disabled={activeIndex === 0}
                        className="p-2 rounded-lg text-white/50 hover:text-[#FFD700] hover:bg-white/5 disabled:opacity-20 disabled:hover:bg-transparent transition"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-xs font-mono text-white/40">
                        {activeIndex + 1} / {activeList.length}
                    </span>
                    <button
                        onClick={() => handleIndexChange(1)}
                        disabled={activeIndex === activeList.length - 1}
                        className="p-2 rounded-lg text-white/50 hover:text-[#FFD700] hover:bg-white/5 disabled:opacity-20 disabled:hover:bg-transparent transition"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}

function SmartAnswerRenderer({ message }) {
    const [isMainCopied, setIsMainCopied] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState("Contacting Huffadz..."); 
    const answerContent = message.answerContent;

    useEffect(() => {
        if (message.isLoading) {
            const statuses = [
                "Generating..."
                
            ];
            let index = 0;
            const interval = setInterval(() => {
                index = (index + 1) % statuses.length;
                setLoadingStatus(statuses[index]);
            }, 2500);
            return () => clearInterval(interval);
        }
    }, [message.isLoading]);

    if (message.isLoading) {
        return (
            <div className="flex items-center gap-3 p-2">
                <div className="relative">
                    <div className="w-3 h-3 bg-[#B8860B] rounded-full animate-ping absolute opacity-75"></div>
                    <div className="w-3 h-3 bg-[#FFD700] rounded-full relative"></div>
                </div>
                <span className="shimmer-text font-medium text-sm">{loadingStatus}</span>
            </div>
        );
    }
    
    if (!answerContent || typeof answerContent !== 'object') {
         return <div className="text-[#E0E0D6] leading-relaxed">{String(message.content)}</div>;
    }

    const { 
        introductory_text, 
        long_form_content, 
        quran_examples, 
        hadith_examples, 
        letter_example, 
        sources, 
        summary_text, 
        quran_example, 
        hadith_example 
    } = answerContent;
    
    const mainText = summary_text || long_form_content || introductory_text || '';
    const quranList = quran_examples?.length > 0 ? quran_examples : (quran_example ? [quran_example] : []);
    const hadithList = hadith_examples?.length > 0 ? hadith_examples : (hadith_example ? [hadith_example] : []);

    let structuredContent = null;
    if (letter_example) {
        structuredContent = <LetterContentRenderer data={letter_example} />;
    }

    const handleCopyMain = () => {
        const textToCopy = (answerContent.introductory_text || '') + '\n\n' + (answerContent.long_form_content || '');
        navigator.clipboard.writeText(textToCopy.replace(/\*\*/g, ''));
        setIsMainCopied(true);
        setTimeout(() => setIsMainCopied(false), 2000);
    };

    return (
        <div className="text-left text-[#E0E0D6] space-y-4">
            {mainText && (
                <div className="prose prose-invert prose-p:leading-relaxed prose-li:text-[#E0E0D6] prose-strong:text-[#FFD700] prose-headings:text-[#E0E0D6] max-w-none prose-sm sm:prose-base">
                    <ReactMarkdown>{mainText}</ReactMarkdown>
                </div>
            )}
            
            {structuredContent}

            {mainText && !structuredContent && (
                 <div className="flex justify-end mt-2">
                    <button
                        onClick={handleCopyMain}
                        className="flex items-center gap-1.5 text-xs text-white/40 hover:text-[#FFD700] transition py-1 px-2 rounded hover:bg-white/5"
                    >
                        {isMainCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {isMainCopied ? 'Copied' : 'Copy'}
                    </button>
                 </div>
            )}

            <DalilContainerRenderer quranList={quranList} hadithList={hadithList} />
            
            {sources?.length > 0 && (
                <div className="mt-6 pt-3 border-t border-white/10 flex items-start gap-2">
                    <div className="mt-0.5"><BookOpen className="w-3 h-3 text-white/30" /></div>
                    <p className="text-[11px] text-white/40 leading-tight">
                        <span className="font-semibold text-white/50">References:</span> {sources.join(', ')}
                    </p>
                </div>
            )}
        </div>
    );
}

// --- SIDEBAR ---
function Sidebar({ 
    width, 
    isCollapsed, 
    conversations, 
    currentId, 
    onSelectConversation, 
    onNewConversation,
    onDeleteConversation,
    currentUser,
    userProfile,
    isMobile 
}) {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const displayUserName = userProfile?.username || currentUser?.email?.split('@')[0] || 'Guest';
    const displayInitial = displayUserName.substring(0,1).toUpperCase();

    const handleSignOut = async () => {
        setIsMenuOpen(false);
        await signOut(auth);
        navigate('/auth');
    };

    return (
        <aside 
            className={`flex flex-col h-full bg-[#0a0a0a] backdrop-blur-xl border-r border-white/5 shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                ${isMobile ? 'absolute z-40 h-full' : 'relative flex-shrink-0'}
            `}
            style={{ 
                width: width, 
                opacity: width === 0 ? 0 : 1,
                transform: width === 0 ? 'translateX(-100%)' : 'translateX(0)',
                overflow: 'hidden'
            }}
        >
            {/* Header */}
            <div className="flex-shrink-0 p-4 pt-5 flex items-center justify-between">
                 <button 
                    onClick={onNewConversation} 
                    className="w-full group flex items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#b38b1f] p-[1px] shadow-lg hover:shadow-[#B8860B]/20 transition-all active:scale-[0.98]"
                >
                    <div className="flex-1 flex items-center justify-center gap-2 bg-[#121212] hover:bg-[#1a1a1a] rounded-[10px] py-2.5 transition-colors h-full w-full">
                        <Plus className="w-4 h-4 text-[#FFD700]" />
                        <span className="font-medium text-sm text-[#E0E0D6] group-hover:text-white">New Conversation</span>
                    </div>
                </button>
            </div>

            {/* List Percakapan */}
            <div className="relative flex-1 overflow-y-auto px-3 py-2 custom-scrollbar">
                <div className="space-y-1">
                    <p className="px-3 text-xs font-semibold text-white/20 uppercase tracking-wider mb-2 mt-2">History</p>
                    
                    {currentUser && conversations.map((c) => (
                        <div key={c.conversation_id} className="relative group">
                            <button
                                onClick={() => onSelectConversation(c.conversation_id)}
                                className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-200 flex items-center gap-3
                                    ${c.conversation_id === currentId 
                                        ? 'bg-white/10 text-white shadow-md border border-white/5' 
                                        : 'text-white/60 hover:bg-white/5 hover:text-white/90'}`}
                            >
                                <MessageSquare className={`w-4 h-4 flex-shrink-0 ${c.conversation_id === currentId ? 'text-[#FFD700]' : 'text-white/30'}`} />
                                <span className="truncate text-sm font-medium flex-1">{c.title}</span>
                            </button>
                            
                            {/* Tombol Hapus Hover */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteConversation(c.conversation_id);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-rose-400 hover:bg-rose-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    {!currentUser && (
                         <div className="mt-10 mx-2 p-5 text-center rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5">
                            <div className="w-12 h-12 rounded-full bg-[#B8860B]/20 flex items-center justify-center mx-auto mb-3 text-[#FFD700]">
                                <LogIn className="w-6 h-6" />
                            </div>
                            <h5 className="font-medium text-white mb-1">Sign In</h5>
                            <p className="text-xs text-white/50 mb-4 leading-relaxed">Save your conversation history so it doesn't get lost.</p>
                            <button 
                                onClick={() => navigate('/auth')}
                                className="w-full py-2 rounded-lg bg-[#B8860B] text-[#121212] font-bold text-xs hover:bg-[#d4a017] transition shadow-lg shadow-[#B8860B]/10"
                            >
                                Login / Register
                            </button>
                        </div>
                    )}
                    
                    {currentUser && conversations.length === 0 && (
                        <div className="text-center py-10 px-4">
                            <p className="text-sm text-white/30 italic">No conversation history yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer User */}
            {currentUser && (
                <div className="p-3 border-t border-white/5 bg-[#0a0a0a]">
                    <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute left-3 right-3 bottom-[70px] rounded-xl bg-[#1E1E1E] border border-white/10 shadow-2xl overflow-hidden z-20"
                        >
                            <div className="p-3 border-b border-white/5">
                                <p className="text-xs font-medium text-white/40 uppercase tracking-wider">Account</p>
                                <p className="text-sm text-white truncate">{currentUser.email}</p>
                            </div>
                            <button onClick={handleSignOut} className="w-full text-left px-4 py-3 text-sm text-rose-400 hover:bg-white/5 flex items-center gap-2 transition-colors">
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </motion.div>
                    )}
                    </AnimatePresence>

                    <button 
                        onClick={() => setIsMenuOpen(v => !v)}
                        className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 border border-transparent
                            ${isMenuOpen ? 'bg-white/10 border-white/5' : 'hover:bg-white/5'}`}
                    >
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#B8860B] to-[#8a6508] flex items-center justify-center text-[#121212] font-bold shadow-lg text-sm">
                            {displayInitial}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <div className="truncate font-semibold text-sm text-[#E0E0D6]">{displayUserName}</div>
                            <div className="truncate text-[10px] text-white/40">Online</div>
                        </div>
                        <ChevronLeft className={`w-4 h-4 text-white/30 transition-transform duration-300 ${isMenuOpen ? '-rotate-90' : 'rotate-180'}`} />
                    </button>
                </div>
            )}
        </aside>
    );
}

// --- WELCOME SCREEN ---
const welcomeContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};
const welcomeItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

function WelcomeScreen({ onSendSuggestion, currentUser, userProfile }) { 
    const displayUserName = userProfile?.username || (currentUser ? "Friend" : "Guest");
    const activePrompts = useRef([...SUGGESTED_PROMPTS].sort(() => 0.5 - Math.random()).slice(0, 4)).current;

     return (
        <motion.div 
            className='w-full max-w-2xl mx-auto px-6'
            variants={welcomeContainerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex flex-col items-center justify-center text-center space-y-6 mb-10">
                <motion.div variants={welcomeItemVariants} className="relative">
                    <div className="absolute -inset-4 bg-[#B8860B]/20 blur-3xl rounded-full opacity-50"></div>
                    <img src="logo.svg" alt="Logo" className="w-16 h-16 sm:w-20 sm:h-20 relative z-10 drop-shadow-2xl" />
                </motion.div>
                
                <motion.div variants={welcomeItemVariants}>
                    <h2 className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E0E0D6] via-white to-[#E0E0D6] mb-2 leading-tight">
                        Assalamu'alaikum, {displayUserName}.
                    </h2>
                    <p className="text-[#C9C9B8] text-base sm:text-lg font-light">
                        What would you like to learn or discuss today?
                    </p>
                </motion.div>
            </div>
            
            <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                variants={welcomeContainerVariants}
            >
                {activePrompts.map((prompt, index) => (
                    <motion.button 
                        key={index}
                        onClick={() => onSendSuggestion(prompt)}
                        className="group text-left p-4 rounded-xl bg-[#1A1A1A] border border-white/5 hover:border-[#B8860B]/50 hover:bg-[#252525] transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-[#B8860B]/5 relative overflow-hidden"
                        variants={welcomeItemVariants}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Sparkles className="w-4 h-4 text-[#FFD700]" />
                        </div>
                        <p className="text-sm text-[#E0E0D6] leading-relaxed group-hover:text-white">{prompt}</p>
                    </motion.button>
                ))}
            </motion.div>
        </motion.div>
     );
}

// --- CHAT AREA ---
function ChatArea({ 
    currentId, 
    conversations, 
    messages, 
    isLoadingHistory,
    isSending,
    isAuthLoading,
    onSend,
    onSendSuggestion,
    toggleSidebar,
    currentUser,
    userProfile,
    onOpenArchive,
}) {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const isWelcomeScreen = messages.length === 0 && !isLoadingHistory;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; 
            textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px'; 
        }
    }, [inputValue]);

    const handleSubmit = (e) => {
        e?.preventDefault();
        const trimmed = inputValue.trim();
        if (!trimmed || isSending) return;
        onSend(trimmed);
        setInputValue('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };
    
    const formattedTime = (d) => {
        try {
            return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(d);
        } catch { return ''; }
    };

    return (
        <main className="relative flex-1 flex flex-col h-full bg-[#0F0F0F] overflow-hidden">
            {/* Header Glass */}
            <header className="absolute top-0 left-0 right-0 h-16 z-20 flex items-center justify-between px-3 sm:px-4 bg-[#0F0F0F]/80 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <button 
                        onClick={toggleSidebar} 
                        className="p-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition flex-shrink-0"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="font-semibold text-[#E0E0D6] truncate text-sm sm:text-base">
                        {currentId ? (conversations.find(c => c.conversation_id === currentId)?.title || 'Conversation') : 'Islamic AI'}
                    </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                     <button
                        onClick={onOpenArchive}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#B8860B]/10 border border-[#B8860B]/30 text-[#FFD700] text-xs font-medium hover:bg-[#B8860B]/20 transition"
                    >
                        <Heart className="w-4 h-4 fill-current" />
                        <span className="hidden sm:inline">Contribution</span>
                    </button>
                    <img src="logo.svg" alt="Logo" className='h-8 w-8 opacity-80 hover:opacity-100 transition-opacity'></img>
                </div>
            </header>

            {/* Loading Bar */}
            {isAuthLoading && <div className="absolute top-16 left-0 right-0 h-0.5 z-30 shimmer-bar-bg" />}

            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto pt-20 pb-4 px-2 sm:px-0 custom-scrollbar">
                {isWelcomeScreen ? (
                    <div className="h-full grid place-items-center">
                        {isLoadingHistory ? (
                             <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-8 h-8 animate-spin text-[#B8860B]" />
                                <span className="text-xs text-white/30 tracking-widest uppercase">Loading History...</span>
                             </div>
                        ) : (
                            <WelcomeScreen 
                                onSendSuggestion={(prompt) => { setInputValue(''); onSendSuggestion(prompt); }} 
                                currentUser={currentUser}
                                userProfile={userProfile}
                            />
                        )}
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto space-y-8 px-2 sm:px-4 pb-24 sm:pb-32">
                        {messages.map((m, index) => (
                            <motion.div 
                                key={m.id} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex flex-col max-w-[95%] sm:max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    
                                    {/* Avatar / Icon */}
                                    <div className={`mb-1 flex items-center gap-2 text-xs font-medium text-white/40 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        {m.role === 'user' ? 'You' : 'Huffadz AI'}
                                        <span className="text-[10px] opacity-50">{formattedTime(m.time)}</span>
                                    </div>

                                    <div className={`relative px-4 sm:px-5 py-3 sm:py-4 shadow-sm ${
                                        m.role === 'user' 
                                            ? 'bg-gradient-to-br from-[#B8860B] to-[#9A7009] text-white rounded-2xl rounded-tr-sm border border-white/10' 
                                            : 'bg-[#1a1a1a] border border-white/5 text-[#E0E0D6] rounded-2xl rounded-tl-sm w-full shadow-[0_4px_10px_rgba(0,0,0,0.2)]' 
                                    }`}>
                                        {m.role === 'bot' ? (
                                            <SmartAnswerRenderer message={m} />
                                        ) : (
                                            <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{m.content}</p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>            

            {/* Input Floating Area - RESPONSIVE & NO BORDER */}
            <div className="absolute bottom-0 left-0 w-full z-20">
                {/* Gradient Fade */}
                <div className="absolute bottom-0 left-0 w-full h-24 sm:h-40 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/90 to-transparent pointer-events-none" />

                <div className="relative w-full max-w-3xl mx-auto px-3 sm:px-4 pb-4 sm:pb-6 pt-2">
                    <form onSubmit={handleSubmit} className="relative group">
                        
                        {/* Glow effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#B8860B] to-[#FFD700] rounded-[28px] opacity-20 group-hover:opacity-40 blur transition duration-500 group-focus-within:opacity-60 group-focus-within:blur-md hidden sm:block"></div>
                        
                        {/* Container Input Utama */}
                        <div className="relative flex items-end gap-2 bg-[#141414] border border-[#B8860B]/20 rounded-[26px] p-2 shadow-2xl transition-all duration-300 focus-within:bg-[#1a1a1a] focus-within:border-[#B8860B]/60">
                            
                            {/* Textarea */}
                            <textarea
                                ref={textareaRef} 
                                value={inputValue}
                                disabled={isSending}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask something..."
                                rows={1}
                                // ANTI ZOOM ON MOBILE: text-[16px] prevents iOS zoom
                                className="flex-1 max-h-[160px] min-h-[44px] bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-[#E0E0D6] placeholder:text-white/20 py-3 px-3 sm:px-4 resize-none leading-relaxed custom-scrollbar text-[16px] sm:text-[15px]" 
                            />
                            
                            {/* Tombol Send */}
                            <button 
                                type="submit" 
                                disabled={isSending || !inputValue.trim()}
                                className={`mb-1 mr-1 flex-shrink-0 inline-flex items-center justify-center rounded-xl h-10 w-10 transition-all duration-300 
                                    ${!inputValue.trim() || isSending 
                                        ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                                        : 'bg-[#B8860B] text-white shadow-[0_0_15px_rgba(184,134,11,0.4)] hover:bg-[#FFD700] hover:text-black hover:scale-105 active:scale-95'
                                    }`}
                            >
                                {isSending ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <ArrowRight className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Disclaimer Footer */}
                    <div className="text-center mt-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-500 delay-150">
                        <p className="text-[10px] text-white/30 tracking-wide font-light">
                            AI can make mistakes. Always refer back to trusted Scholars & Books.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

function Resizer({ onMouseDown }) {
    return (
        <div 
            className="w-1 h-full cursor-col-resize hover:bg-[#B8860B] transition-colors duration-300 bg-white/5 z-10 hidden lg:block"
            onMouseDown={onMouseDown}
        />
    );
}

// --- MODALS & ALERTS ---

function DeleteConfirmationModal({ isOpen, onCancel, onConfirm, isDeleting }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onCancel}
            />
            <motion.div
                className="relative z-50 w-full max-w-sm rounded-2xl bg-[#1A1A1A] p-6 shadow-2xl border border-white/10"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
            >
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                        <Trash2 className="w-6 h-6 text-rose-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[#E0E0D6]">Delete Conversation?</h3>
                        <p className="mt-2 text-xs text-white/50 leading-relaxed">
                            This action cannot be undone. This chat history will be lost forever.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 bg-white/5 hover:bg-white/10 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 transition shadow-lg shadow-rose-900/20"
                    >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yes, Delete'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function GuestAlert({ isOpen, onClose }) {
    const navigate = useNavigate();
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(onClose, 7000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <motion.div
            className="absolute top-20 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-lg"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="relative rounded-xl bg-[#1A1A1A]/90 backdrop-blur-xl border border-[#B8860B]/40 shadow-2xl p-4 overflow-hidden">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-[#B8860B]/20 rounded-lg text-[#FFD700]">
                        <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pt-1">
                        <p className="text-sm font-medium text-[#E0E0D6]">Guest Mode</p>
                        <p className="text-xs text-white/50 mt-1">Your chat will not be saved after the session ends.</p>
                        
                        <div className="flex gap-3 mt-3">
                            <button
                                onClick={() => navigate('/auth')}
                                className="text-xs font-bold text-[#1A1A1A] bg-[#FFD700] px-3 py-1.5 rounded-md hover:bg-[#ffdf40] transition"
                            >
                                Register Now
                            </button>
                             <button
                                onClick={onClose}
                                className="text-xs font-medium text-white/60 hover:text-white transition"
                            >
                                Continue as Guest
                            </button>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/30 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="absolute bottom-0 left-0 h-0.5 bg-[#B8860B] animate-deplete" />
            </div>
        </motion.div>
    );
}

function WelcomeInfaqAlert({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                     <motion.div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                    
                    <motion.div
                        className="relative z-50 w-full max-w-md rounded-3xl bg-[#181818] p-1 shadow-[0_0_50px_rgba(184,134,11,0.15)] border border-white/10"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <div className="bg-[#121212] rounded-[22px] p-6 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#B8860B]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center shadow-lg shadow-[#B8860B]/20 mb-4">
                                    <Heart className="w-7 h-7 text-[#121212] fill-current" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Support Islamic-AI</h3>
                                <p className="text-sm text-white/60 leading-relaxed">
                                    Help us keep the server running and data accurate for the Ummah.
                                </p>
                            </div>

                            <div className="space-y-3 mb-6">
                                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#B8860B]/50 transition group">
                                    <Database className="w-5 h-5 text-[#B8860B] group-hover:scale-110 transition-transform" />
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-white">Data Contribution</p>
                                        <p className="text-[10px] text-white/40">Hadith & Books Verification</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-white/20 ml-auto" />
                                </button>
                                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#FFD700]/50 transition group">
                                    <Coins className="w-5 h-5 text-[#FFD700] group-hover:scale-110 transition-transform" />
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-white">Server Infaq</p>
                                        <p className="text-[10px] text-white/40">Jariyah for operations</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-white/20 ml-auto" />
                                </button>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full py-3 rounded-xl bg-[#E0E0D6] text-[#121212] font-bold text-sm hover:bg-white transition"
                            >
                                Not Now
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// Pastikan Anda sudah mengimpor ikon yang dibutuhkan dari 'lucide-react' di bagian paling atas file:
// import { ..., Heart, Database, FileText, X, ExternalLink, Cpu, Gift, ArrowUpRight, ... } from 'lucide-react'

function ContributionModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    // KONFIGURASI KONTAK
    const WA_NUMBER = "6285743470005"; 
    const GFORM_URL = "https://forms.gle/mk1jZm3NBYTJzuXdA";

    // LINK WHATSAPP OTOMATIS
    const vectorWaLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Assalamualaikum, I am a developer/data scientist. I would like to contribute Vector Database (Embeddings) data for Project Dalil.")}`;
    const infaqWaLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Assalamualaikum, I would like to give infaq for the server & operational costs of Project Dalil.")}`;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop Blur */}
                    <motion.div
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose} 
                    />

                    {/* Modal Container */}
                    <motion.div
                        className="relative z-50 w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0F0F0F] border border-white/10 shadow-2xl overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                    >
                        {/* Header: Sticky */}
                        <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-white/5 bg-[#0F0F0F]/95 backdrop-blur z-20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B8860B] to-[#FFD700] flex items-center justify-center shadow-lg shadow-[#B8860B]/20">
                                    <Gift className="w-5 h-5 text-[#121212]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E0E0D6] to-white">
                                        Jariyah Contribution Gateway
                                    </h2>
                                    <p className="text-xs text-white/40">Let's build an artificial intelligence ecosystem for the Ummah.</p>
                                </div>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content: Scrollable */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
                            
                            {/* Intro Text */}
                            <div className="mb-10 text-center max-w-2xl mx-auto">
                                <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                                    <span className="text-[#FFD700] font-semibold">Project Dalil</span> is a non-profit initiative. 
                                    We need your help—both in terms of knowledge data and financial support—to keep the server running, fast, and free for all seekers of knowledge.
                                </p>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-8">
                                
                                {/* KOLOM KIRI: WAKAF DATA (ILMU) */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Database className="w-5 h-5 text-emerald-400" />
                                        <h3 className="text-lg font-bold text-[#E0E0D6]">1. Data Endowment (Knowledge)</h3>
                                    </div>

                                    {/* Card A: Vector DB (Technical) */}
                                    <div className="group relative p-1 rounded-2xl bg-gradient-to-b from-emerald-500/20 to-transparent">
                                        <div className="relative h-full bg-[#161616] border border-white/5 rounded-xl p-5 hover:border-emerald-500/40 transition-colors">
                                            <div className="absolute top-4 right-4 text-emerald-500/20 group-hover:text-emerald-500 transition-colors">
                                                <Cpu className="w-6 h-6" />
                                            </div>
                                            <h4 className="font-bold text-emerald-400 mb-2">Vector Database</h4>
                                            <p className="text-xs text-white/60 mb-4 leading-relaxed pr-8">
                                                <strong className="text-white/80">Specifically for Developers/Data Scientists.</strong><br/>
                                                Send us clean Hadith/Book datasets (JSON/CSV) or already embedded ones.
                                            </p>
                                            <button 
                                                onClick={() => window.open(vectorWaLink, '_blank')}
                                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-900/30 text-emerald-400 font-medium text-sm border border-emerald-500/20 hover:bg-emerald-500 hover:text-[#121212] transition-all"
                                            >
                                                Contribute via WhatsApp <ExternalLink className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Card B: Raw Documents (General) */}
                                    <div className="group relative p-1 rounded-2xl bg-gradient-to-b from-amber-500/20 to-transparent">
                                        <div className="relative h-full bg-[#161616] border border-white/5 rounded-xl p-5 hover:border-amber-500/40 transition-colors">
                                            <div className="absolute top-4 right-4 text-amber-500/20 group-hover:text-amber-500 transition-colors">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <h4 className="font-bold text-amber-400 mb-2">Raw Documents</h4>
                                            <p className="text-xs text-white/60 mb-4 leading-relaxed pr-8">
                                                <strong className="text-white/80">For Public.</strong><br/>
                                                Do you have reliable PDF Books, Journals, or Papers? Upload the raw files here. Our team will process them.
                                            </p>
                                            <button 
                                                onClick={() => window.open(GFORM_URL, '_blank')}
                                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-900/30 text-amber-400 font-medium text-sm border border-amber-500/20 hover:bg-amber-500 hover:text-[#121212] transition-all"
                                            >
                                                Fill Upload Form <ExternalLink className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* KOLOM KANAN: INFAQ (HARTA) */}
                                <div className="space-y-6 flex flex-col">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Heart className="w-5 h-5 text-[#FFD700]" />
                                        <h3 className="text-lg font-bold text-[#E0E0D6]">2. Operational Infaq (Wealth)</h3>
                                    </div>

                                    <div className="flex-1 relative p-[1px] rounded-2xl bg-gradient-to-br from-[#B8860B] via-[#FFD700] to-[#B8860B] shadow-[0_0_40px_rgba(184,134,11,0.15)]">
                                        <div className="relative h-full bg-[#121212] rounded-[15px] p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
                                            
                                            {/* Pattern Background */}
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#B8860B]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                                            <div>
                                                <h4 className="text-2xl font-bold text-white mb-1">Support AI Server</h4>
                                                <div className="flex items-center gap-2 mb-6">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFD700] text-black">AD-FREE</span>
                                                    <span className="text-xs text-white/40">100% Non-Profit</span>
                                                </div>

                                                <div className="space-y-4 mb-8">
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-1 p-1 rounded-full bg-white/10">
                                                            <Cpu className="w-3 h-3 text-[#FFD700]" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-white font-medium">GPU & Cloud Costs</p>
                                                            <p className="text-xs text-white/50">Renting expensive GPU servers for fast AI processing.</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-1 p-1 rounded-full bg-white/10">
                                                            <Database className="w-3 h-3 text-[#FFD700]" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-white font-medium">Vector Storage</p>
                                                            <p className="text-xs text-white/50">Storing millions of verse and hadith embeddings.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-auto">
                                                <div className="p-4 rounded-xl bg-[#1A1A1A] border border-white/5 mb-4 text-center">
                                                    <p className="text-xs text-white/40 mb-1 uppercase tracking-widest">Contribute via WhatsApp Admin</p>
                                                    <p className="text-lg font-mono text-[#FFD700] font-bold tracking-wide">0857-4347-0005</p>
                                                </div>
                                                
                                                <button 
                                                    onClick={() => window.open(infaqWaLink, '_blank')}
                                                    className="w-full group py-3 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#FFD700] text-[#121212] font-bold text-sm shadow-lg shadow-[#B8860B]/20 hover:shadow-[#B8860B]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                                >
                                                    Confirm Infaq Now
                                                    <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                                                </button>
                                                <p className="text-[10px] text-white/30 text-center mt-3">
                                                    "When a human being dies, his deeds come to an end except for three: a continuous charity, knowledge from which benefit is derived..." (HR. Muslim)
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// --- MAIN PAGE ---

function ConversationPage() {
    // Inject Styles
    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = animationStyles;
        document.head.appendChild(styleSheet);
        return () => styleSheet.remove();
    }, []);

    // Logic
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [sidebarWidth, setSidebarWidth] = useState(isMobile ? 0 : DEFAULT_SIDEBAR_WIDTH);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(isMobile);
    const isResizing = useRef(false);

    const [currentUser, setCurrentUser] = useState(null); 
    const [userProfile, setUserProfile] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true); 

    const [conversations, setConversations] = useState([]);
    const [currentId, setCurrentId] = useState(null); 
    const [messages, setMessages] = useState([]); 
    
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const [conversationToDelete, setConversationToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isGuestAlertOpen, setIsGuestAlertOpen] = useState(false);
    const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
    const [isWelcomeAlertOpen, setIsWelcomeAlertOpen] = useState(false);

    // Handlers
    const handleMouseDown = (e) => { e.preventDefault(); isResizing.current = true; };
    const handleMouseUp = () => { isResizing.current = false; };
    const handleMouseMove = useCallback((e) => {
        if (!isResizing.current || window.innerWidth < 1024) return;
        const maxSidebarWidth = window.innerWidth * MAX_SIDEBAR_WIDTH_PERCENT;
        let newWidth = e.clientX;
        if (newWidth < MIN_SIDEBAR_WIDTH) { setIsSidebarCollapsed(true); setSidebarWidth(0); } 
        else if (newWidth > maxSidebarWidth) { setSidebarWidth(maxSidebarWidth); } 
        else { setIsSidebarCollapsed(false); setSidebarWidth(newWidth); }
    }, []);

    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcomeAlert');
        if (!hasSeenWelcome) {
            setIsWelcomeAlertOpen(true);
            setTimeout(() => localStorage.setItem('hasSeenWelcomeAlert', 'true'), 100); 
        }
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        const handleScreenResize = () => {
            const newIsMobile = window.innerWidth < 1024;
            setIsMobile(newIsMobile);
            if (newIsMobile) { setIsSidebarCollapsed(true); setSidebarWidth(0); } 
            else if (isSidebarCollapsed) { setIsSidebarCollapsed(false); setSidebarWidth(DEFAULT_SIDEBAR_WIDTH); }
        };

        window.addEventListener('resize', handleScreenResize);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('resize', handleScreenResize);
        };
    }, [handleMouseMove, isSidebarCollapsed]);

    const toggleSidebar = () => {
        const collapsed = !isSidebarCollapsed;
        setIsSidebarCollapsed(collapsed);
        if (collapsed) setSidebarWidth(0);
        else setSidebarWidth(isMobile ? Math.min(window.innerWidth * 0.85, MOBILE_SIDEBAR_WIDTH) : DEFAULT_SIDEBAR_WIDTH);
    };

    // Auth & Data
    useEffect(() => {
        (async () => {
            try {
                const user = await waitForCurrentUser();
                setCurrentUser(user);
                if (user) {
                    const [profile, convList] = await Promise.all([
                        api.getMyProfile().catch(() => null),
                        api.listConversations().catch(() => [])
                    ]);
                    setUserProfile(profile);
                    setConversations(convList);
                } else {
                    setTimeout(() => setIsGuestAlertOpen(true), 2000);
                }
            } catch (e) { console.error("Auth Error", e); } 
            finally { setIsAuthLoading(false); }
        })();
    }, []);

    const parseTimestamp = (ts) => {
        if (!ts) return new Date();
        if (typeof ts === 'number') return new Date(ts * 1000);
        if (ts._seconds) return new Date(ts._seconds * 1000);
        return new Date(ts);
    };

    const formatPromptToMessage = (promptData) => ({
        id: promptData.prompt_id || crypto.randomUUID(),
        role: 'user',
        content: promptData.prompt_text,
        time: parseTimestamp(promptData.timestamp),
    });

    const formatAnswerToMessage = (answerData) => ({
        id: answerData.answer_id || crypto.randomUUID(),
        role: 'bot',
        content: answerData.summary_text || '...',
        answerContent: answerData,
        time: parseTimestamp(answerData.timestamp),
        isLoading: false,
    });

    const handleNewConversation = () => {
        setCurrentId(null);
        setMessages([]);
        setIsLoadingHistory(false);
        if (isMobile) { setIsSidebarCollapsed(true); setSidebarWidth(0); }
    };

    const handleSelectConversation = async (id) => {
        if (id === currentId) return;
        setCurrentId(id);
        setMessages([]);
        setIsLoadingHistory(true);
        if (isMobile) { setIsSidebarCollapsed(true); setSidebarWidth(0); }
        try {
            const history = await api.getHistory(id);
            const formattedMessages = history.flatMap(h => {
                if (h.type === 'prompt') return [formatPromptToMessage({ ...h, prompt_text: h.text, prompt_id: h.id })];
                if (h.type === 'answer') return [formatAnswerToMessage({ ...h.content, answer_id: h.id, timestamp: h.timestamp })];
                return [];
            });
            setMessages(formattedMessages);
        } catch (e) { alert("Failed to load history."); } 
        finally { setIsLoadingHistory(false); }
    };

    const formatHistoryForAPI = (messages) => {
        return messages.filter(msg => !msg.isLoading).map(msg => {
                let role;
                let content;
                if (msg.role === 'user') {
                    role = 'user';
                    content = msg.content;
                } else {
                    role = 'assistant';
                    if (msg.answerContent && (msg.answerContent.introductory_text || msg.answerContent.long_form_content)) {
                        content = (msg.answerContent.introductory_text || '') + '\n\n' + (msg.answerContent.long_form_content || '');
                    } else {
                        content = msg.content;
                    }
                }
                return { role, content: content.trim() };
            }).slice(-10); 
    };

    const handleSend = async (promptText) => {
        if (isSending) return;
        if (!currentUser && messages.length === 0) setIsGuestAlertOpen(false);
        setIsSending(true);

        const historyPayload = formatHistoryForAPI(messages); 
        const optimisticPrompt = formatPromptToMessage({
            prompt_id: crypto.randomUUID(),
            prompt_text: promptText,
            timestamp: Date.now() / 1000
        });
        const optimisticAnswer = {
            id: crypto.randomUUID(),
            role: 'bot',
            content: '...',
            answerContent: {},
            time: new Date(),
            isLoading: true,
        };

        setMessages(prev => [...prev, optimisticPrompt, optimisticAnswer]);

        try {
            let response;
            let targetId = currentId;

            if (currentUser) {
                if (!targetId) {
                    const newTitle = promptText.substring(0, 30) + (promptText.length > 30 ? '...' : '');
                    const newConv = await api.createConversation({ user_id: currentUser.uid, title: newTitle });
                    targetId = newConv.conversation_id;
                    setConversations(prev => [newConv, ...prev]);
                    setCurrentId(targetId);
                }
                response = await api.postPrompt({ 
                    conversation_id: targetId, 
                    sender_uid: currentUser.uid, 
                    prompt_text: promptText,
                    history: historyPayload 
                });
            } else {
                response = await api.postPromptGuest({ 
                    prompt_text: promptText,
                    history: historyPayload 
                });
            }
            
            const finalAnswer = formatAnswerToMessage(response.answer);
            setMessages(prev => [...prev.slice(0, -1), finalAnswer]);
        } catch (err) {
            const errorAnswer = {
                id: crypto.randomUUID(),
                role: 'bot',
                content: `Sorry, an error occurred: ${err.message}`,
                answerContent: { summary_text: `Sorry, an error occurred: ${err.message}` },
                time: new Date(),
                isLoading: false,
            };
            setMessages(prev => [...prev.slice(0, -1), errorAnswer]);
        } finally {
            setIsSending(false);
        }
    };

    const promptDeleteConversation = (id) => setConversationToDelete(id);
    const cancelDelete = () => setConversationToDelete(null);
    const handleConfirmDelete = async () => {
        const id = conversationToDelete;
        if (!id) return;
        setIsDeleting(true);
        try {
            await api.deleteConversation(id);
            setConversations(prev => prev.filter(c => c.conversation_id !== id));
            if (currentId === id) handleNewConversation();
        } catch (err) { alert(`Failed to delete: ${err.message}`); } 
        finally { setIsDeleting(false); setConversationToDelete(null); }
    };

    return (
        <div className="dark antialiased">
            <div className="relative h-screen w-screen overflow-hidden bg-[#0a0a0a] text-[#E0E0D6] font-sans">
                
                {/* Backdrop untuk Mobile Sidebar */}
                {!isSidebarCollapsed && isMobile && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30" onClick={toggleSidebar}/>
                )}

                <WelcomeInfaqAlert isOpen={isWelcomeAlertOpen} onClose={() => setIsWelcomeAlertOpen(false)} />
                <GuestAlert isOpen={isGuestAlertOpen && !currentUser && !isWelcomeAlertOpen} onClose={() => setIsGuestAlertOpen(false)} />

                <div className="relative h-full w-full flex">
                    <Sidebar 
                        width={sidebarWidth}
                        isCollapsed={isSidebarCollapsed}
                        conversations={conversations}
                        currentId={currentId}
                        onSelectConversation={handleSelectConversation}
                        onNewConversation={handleNewConversation}
                        onDeleteConversation={promptDeleteConversation}
                        currentUser={currentUser}
                        userProfile={userProfile}
                        isMobile={isMobile}
                    />
                    
                    {!isMobile && <Resizer onMouseDown={handleMouseDown} />}

                    <ChatArea 
                        currentId={currentId}
                        conversations={conversations}
                        messages={messages}
                        isLoadingHistory={isLoadingHistory}
                        isSending={isSending}
                        isAuthLoading={isAuthLoading}
                        onSend={handleSend}
                        onSendSuggestion={handleSend}
                        toggleSidebar={toggleSidebar}
                        currentUser={currentUser}
                        userProfile={userProfile}
                        onOpenArchive={() => setIsContributionModalOpen(true)}
                    />
                </div>

                <ContributionModal isOpen={isContributionModalOpen} onClose={() => setIsContributionModalOpen(false)} />
                <DeleteConfirmationModal 
                    isOpen={conversationToDelete !== null}
                    onCancel={cancelDelete}
                    onConfirm={handleConfirmDelete}
                    isDeleting={isDeleting}
                />
            </div>
        </div>
    );
}

export default ConversationPage;