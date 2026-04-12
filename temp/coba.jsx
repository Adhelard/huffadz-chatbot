import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom' 
import { auth, waitForCurrentUser, signOut } from '../src/lib/firebase'
import { api } from '../src/lib/api'
import { Plus, Archive, Trash2, LogOut, Settings, Menu, CornerDownLeft, Send, Home, User, LogIn, MessageCircle } from 'lucide-react' // MessageCircle ditambahkan

// DUMMY FUNCTIONS (Perlu diimplementasikan di aplikasi nyata)
function loadConversations(user) {
    // console.log(`Loading conversations for user: ${user.uid}`)
    // Di sini seharusnya ada setConversations([fetch_data])
}

function loadArchived(user) {
    // console.log(`Loading archived chats for user: ${user.uid}`)
    // Di sini seharusnya ada setArchived([fetch_data])
}

function scrollToBottom(ref) {
    ref.current?.scrollIntoView({ behavior: "smooth" });
}
// END DUMMY FUNCTIONS

// --- KOMPONEN RENDERER UNTUK AYAT AL-QUR'AN (Disesuaikan warna) ---
function SingleQuranicContent({ data }) {
    if (!data) return null;
    return (
        <div className="mt-3 p-4 rounded-xl border border-[#B8860B]/50 bg-[#1A2327]/80 text-left">
            <h4 className="font-semibold text-base mb-2 border-b border-[#B8860B]/30 pb-1 text-[#FFD700]">
                {data.surah_name} ({data.surah_number}): {data.ayah_number}
            </h4>
            {data.arabic_text && (
                <p className="text-2xl my-3 font-serif text-right leading-relaxed text-[#E0E0D6]">
                    {data.arabic_text}
                </p>
            )}
            <p className="text-sm italic my-2 border-t pt-2 border-[#B8860B]/30 text-[#C9C9B8]">
                **Terjemahan:** "{data.translation}"
            </p>
            {data.tafsir_summary && (
                <p className="text-sm mt-2 text-[#C9C9B8]">
                    **Tafsir Singkat:** {data.tafsir_summary}
                </p>
            )}
        </div>
    );
}


export default function ConversationPage() {
    const navigate = useNavigate()
    const chatEndRef = useRef(null)
    
    const [currentUser, setCurrentUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const [conversationId, setConversationId] = useState(null)
    const [title, setTitle] = useState('Sesi Anonim') // Default title: Sesi Anonim
    const [conversations, setConversations] = useState([])
    const [archived, setArchived] = useState([])
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isArchivedOpen, setIsArchivedOpen] = useState(false)
    
    const isUserAuthenticated = !!currentUser 

    // REKOMENDASI PROMPT
    const recommendedPrompts = [
      "Ulangi hafalan Surah Al-Fatihah, ayat 4.",
      "Jelaskan secara kontekstual tentang ayat 'Sesungguhnya bersama kesulitan ada kemudahan' (QS. Al-Insyirah: 6).",
      "Berikan padanan kata Bahasa Arab untuk kata 'kejujuran' dan contoh ayatnya.",
      "Bagaimana cara membaca tajwid nun sukun pada Surah Al-Baqarah, ayat 15?"
    ];
    
    function handleUnauthorizedAction() {
      alert("Anda harus login untuk menggunakan fitur ini (menyimpan, mengarsipkan, atau menghapus riwayat chat). Silakan masuk atau daftar.");
      navigate('/auth?mode=login');
    }

    // Effect untuk memuat pengguna (memungkinkan akses anonim)
    useEffect(() => {
      waitForCurrentUser().then(user => {
        setCurrentUser(user) 
        if (user) { 
          // Memanggil fungsi dummy dengan useRef untuk menghindari error linter
          loadConversations(user)
          if (!conversationId) setTitle("Chat Baru")
        }
      }).catch(console.error)
    }, [])

    useEffect(() => {
        scrollToBottom(chatEndRef);
    }, [messages])


    // Modifikasi startNewConversation
    function startNewConversation() {
      if (!isUserAuthenticated && messages.length > 0) {
        const confirmNew = window.confirm("Perhatian! Anda akan kehilangan riwayat chat saat ini karena Anda belum login. Lanjut memulai chat baru?");
        if (!confirmNew) return;
      }
      setMessages([]);
      setConversationId(null);
      setTitle(isUserAuthenticated ? 'Chat Baru' : 'Sesi Anonim');
    }
    
    // Modifikasi fungsi yang membutuhkan autentikasi
    function archiveConversation(id) {
      if (!isUserAuthenticated) return handleUnauthorizedAction();
      // ... Logika arsip
    }
    
    function deleteConversation(id) {
      if (!isUserAuthenticated) return handleUnauthorizedAction();
      // ... Logika hapus
    }

    // Modifikasi handleSubmit (untuk menyimpan hanya jika authenticated)
    async function handleSubmit(e) {
      e.preventDefault();
      if (isLoading || !input.trim()) return;

      const userMessage = { role: 'user', content: input.trim() }
      const newMessages = [...messages, userMessage]
      setMessages(newMessages)
      setInput('')
      setIsLoading(true)
      
      try {
          // Ganti ini dengan panggilan API Anda yang sesungguhnya
          // Asumsi: api.getAIResponse mengembalikan { ai_message: { role: 'ai', content: '...' } }
          const response = await api.getAIResponse({ messages: newMessages, conversation_id: conversationId })
          const aiMessage = response.ai_message || { role: 'ai', content: 'Maaf, terjadi kesalahan saat memproses permintaan Anda.' }
          const updatedMessages = [...newMessages, aiMessage]
          setMessages(updatedMessages)
          
          // Simpan hanya jika user terautentikasi (Permintaan User)
          if (isUserAuthenticated) {
            if (!conversationId) {
              const newConversation = await api.createConversation({ 
                  title: userMessage.content.substring(0, 50) + '...', 
                  messages: updatedMessages 
              })
              setConversationId(newConversation.conversation_id)
              setTitle(newConversation.title)
              setConversations(prev => [newConversation, ...prev])
            } else {
              await api.updateConversation(conversationId, { messages: updatedMessages })
            }
          }
      } catch (error) {
          console.error("Gagal memproses chat:", error);
          setMessages(prev => [...prev, { role: 'ai', content: 'Terjadi kesalahan pada sistem. Silakan coba lagi.' }])
      } finally {
          setIsLoading(false)
      }
    }

    // --- JSX RENDER DENGAN PALET WARNA ---
    return (
      // Background Utama: Mendekati Hitam
      <div className="min-h-screen flex text-[#E0E0D6] bg-[#141C1F]"> 
        
        {/* Sidebar */}
        <div 
          className={`fixed top-0 left-0 h-full w-64 bg-[#1A2327] border-r border-[#B8860B]/30 z-30 transform transition-transform duration-300 lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 flex flex-col h-full">
            {/* Header Sidebar */}
            <div className="flex justify-between items-center pb-4 border-b border-[#B8860B]/20">
              <h1 className="text-xl font-bold text-[#FFD700]">IslamAI</h1>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-[#E0E0D6] hover:text-[#FFD700]">
                  <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Tombol New Chat */}
            <button 
              onClick={startNewConversation}
              className="w-full mt-4 p-3 rounded-xl bg-[#B8860B] text-[#1A2327] font-semibold flex items-center justify-center gap-2 hover:bg-[#d4a017] transition"
            >
              <Plus className="w-5 h-5" /> Chat Baru
            </button>
            
            {/* Daftar Percakapan */}
            <div className="flex-grow mt-4 overflow-y-auto space-y-2">
              <h3 className="text-sm font-semibold text-[#FFD700] mb-2">Riwayat Chat</h3>
              {isUserAuthenticated ? (
                conversations.map((c) => (
                  <button 
                    key={c.conversation_id}
                    // onClick={() => loadConversation(c.conversation_id)} // Implementasikan ini
                    className="w-full p-2 rounded-lg text-left flex items-center gap-3 hover:bg-[#B8860B]/10 transition text-[#C9C9B8]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="truncate text-sm">{c.title}</span>
                  </button>
                ))
              ) : (
                // Tampilan untuk sesi anonim
                <div className="text-sm text-[#C9C9B8]/70 p-3 rounded-lg bg-[#1A2327] border border-[#B8860B]/10">
                  <p className='font-semibold'>Mode Anonim</p>
                  <p className='mt-1 text-xs'>Anda tidak dapat menyimpan riwayat chat. Silakan <Link to="/auth" className="text-[#FFD700] hover:underline">Login/Daftar</Link> untuk mengaktifkan penyimpanan.</p>
                </div>
              )}
            </div>

            {/* Footer Sidebar */}
            <div className="pt-4 border-t border-[#B8860B]/20 space-y-2">
              {/* Tombol Arsip (Hanya tampil jika authenticated) */}
              {isUserAuthenticated && (
                  <button 
                    onClick={() => setIsArchivedOpen(true)}
                    className="w-full p-2 rounded-lg text-left flex items-center gap-3 hover:bg-[#B8860B]/10 transition text-[#C9C9B8]"
                  >
                    <Archive className="w-5 h-5 text-[#B8860B]" /> Arsip ({archived.length})
                  </button>
              )}
              
              {/* Tombol User / Login */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#1A2327] border border-[#B8860B]/20">
                  <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-[#FFD700]" />
                      <span className="text-sm font-medium">
                          {isUserAuthenticated ? currentUser.displayName || currentUser.email : 'Pengguna Anonim'}
                      </span>
                  </div>
                  {isUserAuthenticated ? (
                      <button 
                          onClick={() => { signOut(); navigate('/'); }}
                          title="Keluar"
                          className="p-1 rounded-full hover:bg-[#B8860B]/20 transition"
                      >
                          <LogOut className="w-5 h-5 text-[#E0E0D6]" />
                      </button>
                  ) : (
                      <Link to="/auth" title="Masuk/Daftar" className="p-1 rounded-full hover:bg-[#B8860B]/20 transition">
                          <LogIn className="w-5 h-5 text-[#E0E0D6]" />
                      </Link>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content (Chat Area) */}
        <div className="flex-grow lg:ml-64 flex flex-col transition-all duration-300">
          {/* Header Chat */}
          <header className="flex items-center justify-between p-4 bg-[#1A2327]/80 backdrop-blur-sm border-b border-[#B8860B]/30 sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-[#E0E0D6] hover:text-[#FFD700]">
                  <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-semibold truncate text-[#E0E0D6]">{title}</h2>
            </div>
            {/* Tombol Opsi Lain (Arsip/Hapus - hanya untuk authenticated user) */}
            {isUserAuthenticated && conversationId && (
              <div className="flex gap-2">
                <button onClick={() => archiveConversation(conversationId)} className="p-2 rounded-full hover:bg-[#B8860B]/20 text-[#C9C9B8]" title="Arsipkan">
                  <Archive className="w-5 h-5" />
                </button>
                <button onClick={() => deleteConversation(conversationId)} className="p-2 rounded-full hover:bg-[#B8860B]/20 text-[#C9C9B8]" title="Hapus Permanen">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </header>

          {/* Message List */}
          <main className="flex-grow p-4 md:p-8 overflow-y-auto space-y-6 relative">
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Modifikasi bubble chat untuk palet warna */}
                <div
                  className={`max-w-xl p-4 rounded-xl shadow-lg ${
                    m.role === 'user' 
                      ? 'bg-[#B8860B] text-[#1A2327] rounded-br-none' // Pesan User: Background Gold, Teks Near-Black
                      : 'bg-[#1A2327] border border-[#B8860B]/30 text-[#E0E0D6] rounded-tl-none' // Pesan AI: Background Near-Black, Teks White/Krem, Border Gold
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {/* Asumsi: m.data berisi quranic_content jika ada */}
                  {m.data?.quranic_content && <SingleQuranicContent data={m.data.quranic_content} />}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </main>

          {/* Input Area */}
          <div className="p-4 md:p-8 sticky bottom-0 bg-[#141C1F] border-t border-[#B8860B]/30">
              
              {/* Rekomendasi Prompt (Tampil hanya jika chat kosong) */}
              {messages.length === 0 && (
                  <div className="w-full max-w-3xl mx-auto p-4 mb-4 rounded-xl bg-[#1A2327] border border-[#B8860B]/30">
                    <h3 className="text-sm font-semibold text-[#FFD700] mb-3">Rekomendasi Prompt:</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {recommendedPrompts.map((prompt, index) => (
                        <button 
                          key={index}
                          onClick={() => setInput(prompt)}
                          className="text-xs px-3 py-1 border border-[#B8860B]/50 text-[#C9C9B8] rounded-full hover:bg-[#B8860B]/20 transition active:scale-95"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
              )}
              
            <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto flex">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                rows={1}
                placeholder="Ketik pertanyaan atau hafalan Anda di sini..."
                className="flex-grow resize-none rounded-l-xl border border-[#B8860B]/50 bg-[#1A2327] px-4 py-3 outline-none text-[#E0E0D6] focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-3 rounded-r-xl bg-[#B8860B] text-[#1A2327] font-semibold hover:bg-[#d4a017] transition disabled:opacity-50 flex items-center justify-center active:scale-[.98]"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-t-2 border-t-[#1A2327] border-[#B8860B] rounded-full animate-spin"></span>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
            
            {/* Status Simpan untuk Sesi Anonim */}
            {!isUserAuthenticated && (
              <p className="mt-2 text-center text-xs text-[#FFD700]/70">
                Anda dalam **Sesi Anonim**. Chat tidak akan disimpan. <Link to="/auth" className="underline hover:text-[#FFD700]">Masuk/Daftar</Link> untuk menyimpan riwayat.
              </p>
            )}
            
          </div>
        </div>
      </div>
    )
}
<button onClick={() => { setIsMenuOpen(false); /* Tambahkan logic settings */ }} className="w-full text-left px-4 py-2 text-sm text-[#E0E0D6] hover:bg-[#1A2327]/50 flex items-center gap-2">
                                <Settings className="w-4 h-4" /> Pengaturan
                            </button>