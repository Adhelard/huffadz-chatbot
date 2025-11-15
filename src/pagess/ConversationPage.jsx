import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, waitForCurrentUser, signOut } from '../lib/firebase'
import { api } from '../lib/api'

// --- 1. KOMPONEN RENDERER UNTUK AYAT AL-QUR'AN ---

function SingleQuranicContent({ data }) {
    if (!data) return null;
    return (
        <div className="mt-3 p-4 rounded-xl border border-white/50 dark:border-slate-800/60 bg-white/30 dark:bg-slate-800/60 text-left">
            <h4 className="font-semibold text-base mb-2 border-b border-black/10 dark:border-white/10 pb-1 text-emerald-600 dark:text-emerald-400">
                {data.surah_name} ({data.surah_number}): {data.ayah_number}
            </h4>
            {data.arabic_text && (
                <p className="text-2xl my-3 font-serif text-right leading-relaxed">
                    {data.arabic_text}
                </p>
            )}
            <p className="text-sm italic my-2 border-t pt-2 border-black/10 dark:border-white/10">
                **Terjemahan:** "{data.translation}"
            </p>
            {data.tafsir_summary && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    **Tafsir Singkat:** {data.tafsir_summary}
                </p>
            )}
        </div>
    );
}

// --- 1. KOMPONEN RENDERER UNTUK AYAT AL-QUR'AN (WRAPPER) ---
// Ubah nama `QuranicContentRenderer` menjadi `QuranicContentListRenderer`
function QuranicContentListRenderer({ dataList }) {
    if (!dataList || dataList.length === 0) return null;
    return (
        <div className="space-y-3">
            <h5 className="font-bold text-sm mt-4 pt-4 border-t border-black/10 dark:border-white/10">Dalil Al-Qur'an:</h5>
            {dataList.map((data, index) => (
                <SingleQuranicContent key={index} data={data} />
            ))}
        </div>
    );
}


// --- 2. KOMPONEN RENDERER UNTUK HADITS (SINGLE) ---
function SingleHadithContent({ data }) {
    if (!data) return null;
    
    return (
        <div className="mt-3 p-4 rounded-xl border border-white/50 dark:border-slate-800/60 bg-white/30 dark:bg-slate-800/60 text-left">
            <h4 className="font-semibold text-base mb-2 border-b border-black/10 dark:border-white/10 pb-1">
                Hadits dari {data.book} No. {data.number}
            </h4>
            {data.arabic_text && (
                <p className="text-xl my-3 font-serif text-right">{data.arabic_text}</p>
            )}
            <p className="text-sm italic my-2">"{data.translation}"</p>
            {data.narrator && <p className="text-xs text-slate-500 dark:text-slate-400">Diriwayatkan oleh: {data.narrator}</p>}
            {data.details && <p className="text-xs mt-2 font-medium">Detail: {data.details}</p>}
        </div>
    );
}

// --- 2. KOMPONEN RENDERER UNTUK HADITS (WRAPPER) ---
// Ubah nama `HadithContentRenderer` menjadi `HadithContentListRenderer`
function HadithContentListRenderer({ dataList }) {
    if (!dataList || dataList.length === 0) return null;
    return (
        <div className="space-y-3">
            <h5 className="font-bold text-sm mt-4 pt-4 border-t border-black/10 dark:border-white/10">Dalil Hadits:</h5>
            {dataList.map((data, index) => (
                <SingleHadithContent key={index} data={data} />
            ))}
        </div>
    );
}

// --- 3. KOMPONEN RENDERER UNTUK SURAT ---

function LetterContentRenderer({ data }) {
    if (!data) return null;

    return (
        <div className="mt-3 p-4 rounded-xl border border-white/50 dark:border-slate-800/60 bg-white/30 dark:bg-slate-800/60 text-left">
            <h4 className="font-semibold text-base mb-2 border-b border-black/10 dark:border-white/10 pb-1 text-sky-600 dark:text-sky-400">{data.letter_type}</h4>
            <p className="text-sm italic mb-3">{data.date}</p>
            <p className="text-sm">Kepada Yth. {data.recipient}</p>
            <p className="text-sm mb-4">Dari: {data.sender}</p>

            <p className="text-sm font-medium">{data.salutation}</p>
            {data.body_paragraphs.map((p, i) => (
                <p key={i} className="text-sm mt-2 indent-8">{p}</p>
            ))}
            <p className="text-sm mt-4 font-medium">{data.closing}</p>
        </div>
    );
}

// --- 4. KOMPONEN UTAMA (DECIDER) UNTUK JAWABAN BOT ---

function SmartAnswerRenderer({ message }) {
    const contentText = message.content;
    const answerContent = message.answerContent; // Objek SmartAnswer lengkap

    if (!answerContent) return <div className="text-left">{contentText}</div>;

    // Ambil daftar dalil dari answerContent (jika ada)
    const quranList = answerContent.quran_examples || (answerContent.quran_example ? [answerContent.quran_example] : []);
    const hadithList = answerContent.hadith_examples || (answerContent.hadith_example ? [answerContent.hadith_example] : []);

    // Tentukan render yang sesuai berdasarkan properti yang ada
    let structuredContent = null;
    if (answerContent.letter_example) {
        // Render Surat/Dokumen jika ada
        structuredContent = <LetterContentRenderer data={answerContent.letter_example} />;
    }

    return (
        <div className="text-left">
            {/* Tampilkan Summary Text / Teks Utama */}
            <p className='whitespace-pre-wrap'>{contentText}</p>
            
            {/* Tampilkan Konten Terstruktur (Surat/Dokumen) */}
            {structuredContent}

            {/* Tampilkan Daftar Dalil Quran */}
            <QuranicContentListRenderer dataList={quranList} />

            {/* Tampilkan Daftar Dalil Hadits */}
            <HadithContentListRenderer dataList={hadithList} />
            
            {/* Tampilkan Sumber */}
            {answerContent.sources?.length > 0 && (
                <p className="text-[10px] text-slate-600 dark:text-slate-500 mt-2">
                    Sumber: {answerContent.sources.join(', ')}
                </p>
            )}
        </div>
    );
}
// -----------------------------------------------------------------


function ConversationPage() {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [conversations, setConversations] = useState([])
  const [currentId, setCurrentId] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null) 
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [archived, setArchived] = useState([])
  const [isDark, setIsDark] = useState(false)
  const [selectedArchivedIds, setSelectedArchivedIds] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null) 
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)


  const current = conversations.find((c) => c.conversation_id === currentId) || null
  const [messages, setMessages] = useState([])

  const formattedTime = (d) => {
    try {
      return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(d)
    } catch {
      return ''
    }
  }
  
  // Fungsi untuk mengatur tinggi Textarea secara dinamis (max 3 baris)
  const adjustTextareaHeight = () => {
      const textarea = textareaRef.current;
      if (textarea) {
          textarea.style.height = 'auto'; 
          textarea.style.height = textarea.scrollHeight + 'px'; 
      }
  };

  // Efek untuk mengurus scroll dan resize saat pesan/input berubah
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages])
  
  useEffect(() => {
      adjustTextareaHeight();
  }, [inputValue]);


  // Efek untuk memuat data awal (Auth Gate & Data)
  useEffect(() => {
    (async () => {
      const user = await waitForCurrentUser() 
      if (!user) {
        navigate('/login')
        return
      }
      
      try {
        const profile = await api.getMyProfile()
        setUserProfile(profile)
      } catch (e) {
        console.error("Gagal mengambil profil Firestore:", e)
      }
      setCurrentUser(user) 
      
      const list = await api.listConversations().catch(() => []) 
      setConversations(list)
      
      if (list.length > 0 && !currentId) {
          selectConversation(list[0].conversation_id)
      }
    })()
  }, [])
  
  // Efek untuk memuat riwayat saat currentId berubah
  useEffect(() => {
      if (!currentId) {
          setMessages([])
          return
      }
      
      (async () => {
          setIsLoadingHistory(true)
          const hist = await api.getHistory(currentId).catch(() => [])
          setMessages(historyToMessages(hist)) // Panggil fungsi baru
          setIsLoadingHistory(false)
      })()
  }, [currentId])


  // --- FUNGSI historyToMessages BARU UNTUK SMART ANSWER ---
  function historyToMessages(history) {
    return history.map((h) => {
      // Data Prompt (User)
      if (h.type === 'prompt') {
        return {
          id: h.id,
          role: 'user',
          content: h.text, // Teks input pengguna
          time: h.timestamp ? new Date(h.timestamp._seconds * 1000) : new Date(), 
        }
      }
      
      // Data Answer (Bot)
      const answerContent = h.content; // Objek SmartAnswer lengkap

      // Tambahkan safety check untuk menghindari TypeError
      if (answerContent && typeof answerContent === 'object') {
          // Menghapus metadata relasi sebelum dikirim ke komponen UI
          // Jika answerContent null/undefined, delete akan gagal dan menyebabkan error Anda.
          delete answerContent.conversation_id; 
          delete answerContent.prompt_id;
      }

      return {
        id: h.id,
        role: 'bot',
        // Ambil summary_text dari objek konten, atau gunakan h.text sebagai fallback
        content: answerContent?.summary_text || h.text || 'Jawaban tidak ditemukan.', 
        answerContent: answerContent, // SIMPAN OBJEK SMART ANSWER LENGKAP
        time: h.timestamp ? new Date(h.timestamp._seconds * 1000) : new Date(), 
      }
    })
  }
  // -----------------------------------------------------------

  async function addConversation(initialTitle = 'Percakapan Baru') {
    const user = auth.currentUser
    if (!user) {
        navigate('/login')
        return null
    }
    const data = await api.createConversation({ user_id: user.uid, title: initialTitle })
    const newItem = { conversation_id: data.conversation_id, title: data.title }
    
    setConversations((prev) => [newItem, ...prev])
    setCurrentId(newItem.conversation_id)
    setMessages([])
    setIsSidebarOpen(false)
    return newItem
  }

  async function selectConversation(id) {
    setCurrentId(id)
    setIsSidebarOpen(false)
    setIsMenuOpen(false)
  }

  // --- LOGIC ARSIP (Tidak diubah) ---
  function archiveCurrent() {
      if (!current) return
      setArchived((prev) => [{ ...current, messages }, ...prev]) 
      setConversations((prev) => prev.filter((c) => c.conversation_id !== current.conversation_id))
      setCurrentId(null) 
  }

  function restoreConversation(id) {
      const conv = archived.find((a) => a.conversation_id === id)
      if (!conv) return
      setConversations((prev) => [conv, ...prev])
      setArchived((prev) => prev.filter((a) => a.conversation_id !== id))
      setCurrentId(conv.conversation_id) 
  }

  function toggleSelectArchived(id) {
    setSelectedArchivedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  function selectAllArchived() {
    setSelectedArchivedIds(archived.map((a) => a.conversation_id)) 
  }

  function clearSelectedArchived() {
    setSelectedArchivedIds([])
  }

  function deleteSelectedArchived() {
    if (selectedArchivedIds.length === 0) return
    setArchived((prev) => prev.filter((a) => !selectedArchivedIds.includes(a.conversation_id))) 
    setSelectedArchivedIds([])
  }
  // ------------------------------------

  async function handleSend(e) {
    e.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed) return
    let targetId = currentId
    const user = auth.currentUser
    if (!user) return navigate('/login')
    
    const isNewConversation = !targetId;

    if (isNewConversation) {
        const newConv = await addConversation(trimmed.substring(0, 30) + (trimmed.length > 30 ? '...' : '')) 
        if (!newConv) return
        targetId = newConv.conversation_id
    }

    // 1. Optimistic append & Clear input
    // Catatan: answerContent: {} ditambahkan sebagai placeholder untuk pesan Bot di history
    setMessages((prev) => [
        ...prev, 
        { id: crypto.randomUUID(), role: 'user', content: trimmed, time: new Date() },
        { id: crypto.randomUUID(), role: 'bot', content: '...', time: new Date(), answerContent: {} } // Dummy loading bot
    ])
    setInputValue('')
    
    // 2. Update judul jika judul default
    if (isNewConversation || (current && current.title === 'Percakapan Baru')) {
        const newTitle = trimmed.substring(0, 30) + (trimmed.length > 30 ? '...' : '')
        setConversations(prev => prev.map(c => c.conversation_id === targetId ? { ...c, title: newTitle } : c))
    }

    // 3. Panggil API dan muat ulang history
    try {
      await api.postPrompt({ conversation_id: targetId, sender_uid: user.uid, prompt_text: trimmed })
      
      const hist = await api.getHistory(targetId)
      setMessages(historyToMessages(hist))
    } catch (err) {
      console.error("Gagal mengirim prompt atau mengambil history:", err)
      alert("Gagal mengirim. Silakan coba lagi.")
      // Rollback: Hapus pesan bot loading (sederhana)
      setMessages(prev => prev.filter(m => m.role !== 'bot' || m.content !== '...')) 
    }
  }

  const displayUserName = userProfile?.username || currentUser?.email || 'User'
  const displayInitial = (userProfile?.username || currentUser?.email || 'U').substring(0,1).toUpperCase()
  
  const isInputCentered = messages.length === 0 && !isLoadingHistory && !currentId; 

  const HEADER_HEIGHT_CLASS = 'h-14'; 

  return (
    <div className={`${isDark ? 'dark' : ''}`}>
      {/* CONTAINER UTAMA: h-screen, overflow-hidden */}
      <div className="relative h-screen w-screen overflow-hidden bg-linear-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-black dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
      </div>
      <div className="h-full flex">
        {/* SIDEBAR (Fixed Kiri) */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-white/40 dark:border-slate-700/50 shadow-xl transition-transform duration-200 ease-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} rounded-r-2xl`}
          style={{ width: 288 }}
        >
          <div className="h-full flex flex-col">
            <div className="px-5 py-4 border-b border-white/50 dark:border-slate-700/60 flex items-center justify-between">
              <div className="font-semibold tracking-tight">Percakapan</div>
              <button onClick={() => setIsSidebarOpen(false)} className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm text-slate-600 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/60 active:scale-[.98] transition">
                Tutup
              </button>
            </div>
            <div className="p-4">
              <button onClick={() => addConversation()} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white px-3 py-2 text-sm hover:bg-emerald-700 active:scale-[.99] transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                Percakapan Baru
              </button>
            </div>
            <nav className="px-2 pb-4 space-y-1 text-sm overflow-y-auto">
              {conversations.map((c) => (
                <button
                  key={c.conversation_id}
                  onClick={() => selectConversation(c.conversation_id)}
                  className={`w-full text-left px-3 py-2 rounded-lg hover:bg-white/70 dark:hover:bg-slate-800/60 ${c.conversation_id === currentId ? 'bg-white/70 dark:bg-slate-800/60 ring-1 ring-black/5 dark:ring-slate-700/60' : ''}`}
                >
                  <div className="truncate font-medium">{c.title}</div>
                  <div className="truncate text-xs text-slate-500 dark:text-slate-400">{c.last || 'Kosong'}</div> 
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* MAIN CONTENT START */}
        <main className="relative flex-1 flex flex-col">
          {/* A. HEADER (FIXED TOP, TANPA BG) */}
          <header className={`fixed top-0 z-30 w-full ${HEADER_HEIGHT_CLASS} flex items-center gap-3 px-4 backdrop-blur-sm`}>
            <div className="flex-1 flex items-center h-full gap-3">
              <button onClick={() => setIsSidebarOpen((v) => !v)} className="inline-flex items-center rounded-lg p-2 text-slate-700 dark:text-slate-200 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg hover:bg-white/80 dark:hover:bg-slate-800/80 active:scale-[.98] transition shadow-sm border border-white/40 dark:border-slate-700/60">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <div className="font-semibold tracking-tight">{current?.title || 'Huffadz Chatbot'}</div>
            </div>

            <div className="relative">
              <button onClick={() => setIsMenuOpen((v)=>!v)} className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-linear-to-br from-emerald-600 to-teal-600 text-white shadow-md">
                <span className="sr-only">User menu</span>
                {displayInitial}
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg ring-1 ring-black/5 dark:ring-slate-700/60 overflow-hidden">
                  <button onClick={() => { setIsSettingsOpen(true); setIsMenuOpen(false) }} className="w-full text-left px-4 py-2 text-sm hover:bg-white/60 dark:hover:bg-slate-800/60">Setting</button>
                  <button onClick={() => { setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-white/60 dark:hover:bg-slate-800/60">Report bug</button>
                  <button onClick={async () => { setIsMenuOpen(false); await signOut(auth); navigate('/login') }} className="w-full text-left px-4 py-2 text-sm hover:bg-white/60 dark:hover:bg-slate-800/60">Change account</button>
                </div>
              )}
            </div>
          </header>

          {isInputCentered ? (
            // State 1: Centered Input (Welcome/Chat Kosong)
            <div className={`flex-1 grid place-items-center px-4 pt-14`}>
              <form onSubmit={handleSend} className="w-full max-w-2xl">
                <div className="rounded-2xl border border-white/50 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-lg focus-within:ring-2 focus-within:ring-emerald-500/60">
                  {/* Textarea Input Center */}
                  <textarea
                    ref={textareaRef} 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Tanyakan apa saja untuk memulai percakapan baru..."
                    rows={1}
                    className="w-full px-5 py-4 rounded-2xl outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent resize-none overflow-y-hidden"
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-white shadow-md hover:bg-emerald-700 active:scale-[.98] transition">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    Kirim
                  </button>
                </div>
              </form>
            </div>
          ) : (
            // State 2: Active Conversation (Scrollable Chat + Fixed Bottom Input)
            <div className="flex-1 overflow-auto flex flex-col">
              {isLoadingHistory && currentId ? (
                  <div className="flex-1 grid place-items-center text-slate-500 dark:text-slate-400">Memuat riwayat...</div>
              ) : (
                /* B. AREA CHAT SCROLLABLE: pt-[4.5rem] untuk header, pb-[8rem] untuk input max 3 baris */
                <div className={`flex-1 overflow-y-auto px-2 sm:px-4 py-6 pt-18 pb-32`}> 
                  <div className="mx-auto max-w-3xl space-y-4">
                    {messages.map((m) => (
                      <div key={m.id} className={`w-full flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                          {/* Bubble Text: Tambahkan whitespace-pre-wrap dan break-words agar meninggi sesuai konten */}
                          <div className={`${m.role === 'user' ? 'bg-linear-to-br from-emerald-600 to-teal-600 text-white' : 'bg-white/80 dark:bg-slate-900/70 backdrop-blur ring-1 ring-black/5 dark:ring-slate-700/60 text-slate-900 dark:text-slate-100'} rounded-3xl px-5 py-3 shadow-lg whitespace-pre-wrap break-words`}>
                            {/* PENGGUNAAN KOMPONEN SMART ANSWER RENDERER UNTUK PESAN BOT */}
                            {m.role === 'bot' ? (
                                <SmartAnswerRenderer message={m} />
                            ) : (
                                m.content
                            )}
                            {/* AKHIR PENGGUNAAN KOMPONEN BARU */}
                          </div>
                          <div className={`mt-1 text-[11px] ${m.role === 'user' ? 'text-emerald-700/80' : 'text-slate-500 dark:text-slate-400'}`}>
                            {formattedTime(m.time)}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              )}

              {/* C. INPUT FIXED BOTTOM */}
              <div className="fixed bottom-0 z-20 w-full border-t border-white/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-3">
                <form onSubmit={handleSend} className="mx-auto max-w-3xl">
                  <div className="flex items-end gap-2"> {/* items-end agar konten rata bawah */}
                    <button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 text-slate-600 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/60 active:scale-[.98] transition" title="Lampirkan">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 11.5l-7.8 7.8a5.5 5.5 0 01-7.8-7.8L13 3.9a3.5 3.5 0 115 5L9.5 17.4a1.5 1.5 0 11-2.1-2.1L15 7.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    {/* Textarea Input Aktif */}
                    <textarea
                      ref={textareaRef} 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Tulis pesan..."
                      rows={1}
                      className="flex-1 rounded-3xl border border-white/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/70 px-5 py-3 shadow-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/60 resize-none overflow-y-auto max-h-28 " // max-h-[7rem] adalah batas 3 baris
                    />
                    <button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 text-slate-600 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/60 active:scale-[.98] transition" title="Suara">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="3" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M5 11a7 7 0 0014 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M12 19v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </button>
                    <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-white shadow-md hover:bg-emerald-700 active:scale-[.98] transition">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      Kirim
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
        {/* MAIN CONTENT END */}
        </div>
        {/* MODAL SETTINGS (Disesuaikan ID) */}
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 grid place-items-center px-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setIsSettingsOpen(false)} />
            <div className="relative w-full max-w-lg rounded-2xl border border-white/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">Pengaturan</h2>
                <button onClick={() => setIsSettingsOpen(false)} className="rounded-lg px-2 py-1 text-sm text-slate-600 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/60">Tutup</button>
              </div>
              <div className="mt-4 space-y-6">
                <div>
                  <div className="text-sm font-medium mb-2">Akun</div>
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-linear-to-br from-emerald-600 to-teal-600 text-white shadow-md">
                      {displayInitial}
                    </div>
                    <div>
                      <div className="font-medium">{displayUserName}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">{currentUser?.email || '—'}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Tema</div>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={isDark} onChange={(e)=>setIsDark(e.target.checked)} />
                      <span>Mode gelap</span>
                    </label>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Arsip Chat</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={archiveCurrent} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-3 py-2 text-sm hover:bg-emerald-700">
                      Arsipkan percakapan aktif
                    </button>
                    <button onClick={selectAllArchived} className="inline-flex items-center gap-2 rounded-lg border border-white/60 dark:border-slate-700/60 px-3 py-2 text-sm hover:bg-white/60 dark:hover:bg-slate-800/60">
                      Pilih semua
                    </button>
                    <button onClick={clearSelectedArchived} className="inline-flex items-center gap-2 rounded-lg border border-white/60 dark:border-slate-700/60 px-3 py-2 text-sm hover:bg-white/60 dark:hover:bg-slate-800/60">
                      Hapus pilihan
                    </button>
                    <button onClick={deleteSelectedArchived} className="inline-flex items-center gap-2 rounded-lg bg-rose-600 text-white px-3 py-2 text-sm hover:bg-rose-700">
                      Hapus terpilih
                    </button>
                  </div>
                  <div className="mt-3 max-h-56 overflow-y-auto space-y-2">
                    {archived.length === 0 && <div className="text-sm text-slate-500 dark:text-slate-400">Belum ada arsip.</div>}
                    {archived.map((a) => (
                      <label key={a.conversation_id} className="flex items-center gap-3 rounded-lg bg-white/70 dark:bg-slate-800/60 px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selectedArchivedIds.includes(a.conversation_id)} 
                          onChange={() => toggleSelectArchived(a.conversation_id)} 
                        />
                        <div className="mr-auto min-w-0">
                          <div className="truncate text-sm font-medium">{a.title}</div>
                          <div className="truncate text-xs text-slate-500 dark:text-slate-400">{a.messages?.[a.messages.length-1]?.content || 'Kosong'}</div> 
                        </div>
                        <button onClick={() => restoreConversation(a.conversation_id)} className="text-sm text-emerald-600 hover:underline">Pulihkan</button> 
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConversationPage;