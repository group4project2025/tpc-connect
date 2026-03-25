import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import {
    collection, onSnapshot, addDoc, doc, updateDoc,
    query, where, orderBy, serverTimestamp
} from 'firebase/firestore';

const ADMIN_EMAIL = 'admin@example.com';

function formatTime(ts) {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(ts) {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function Grievance() {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [reply, setReply] = useState('');
    const [sending, setSending] = useState(false);
    const [loadingTickets, setLoadingTickets] = useState(true);
    const [activeTab, setActiveTab] = useState('open');
    const messagesEndRef = useRef(null);

    // Real-time tickets listener
    useEffect(() => {
        const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoadingTickets(false);
        });
        return () => unsub();
    }, []);

    // Real-time messages listener for selected ticket (subcollection)
    useEffect(() => {
        if (!selectedTicket) { setMessages([]); return; }
        const q = query(
            collection(db, 'tickets', selectedTicket.id, 'messages')
            // NOTE: no orderBy here — avoids needing a composite Firestore index
        );
        const unsub = onSnapshot(q, (snap) => {
            const msgs = snap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .sort((a, b) => {
                    const ta = a.time?.toMillis?.() ?? Date.now();
                    const tb = b.time?.toMillis?.() ?? Date.now();
                    return ta - tb;
                });
            setMessages(msgs);
        });
        return () => unsub();
    }, [selectedTicket?.id]);

    // Keep selectedTicket in sync with live ticket status updates
    useEffect(() => {
        if (!selectedTicket) return;
        const updated = tickets.find(t => t.id === selectedTicket.id);
        if (updated) setSelectedTicket(updated);
    }, [tickets]);

    // Auto-scroll to newest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendReply = async () => {
        if (!reply.trim() || !selectedTicket || sending) return;
        setSending(true);
        try {
            // Write to the ticket's messages subcollection
            await addDoc(collection(db, 'tickets', selectedTicket.id, 'messages'), {
                sender: ADMIN_EMAIL,
                text: reply.trim(),
                time: serverTimestamp(),
            });
            // We no longer auto-close the ticket here
            setReply('');
        } catch (err) {
            console.error('Failed to send reply:', err);
        } finally {
            setSending(false);
        }
    };

    const closeTicket = async () => {
        if (!selectedTicket || selectedTicket.status === 'closed') return;
        try {
            await updateDoc(doc(db, 'tickets', selectedTicket.id), {
                status: 'closed',
            });
        } catch (err) {
            console.error('Failed to close ticket:', err);
        }
    };

    const openTickets = tickets.filter(t => t.status === 'open');
    const closedTickets = tickets.filter(t => t.status !== 'open');
    const displayedTickets = activeTab === 'open' ? openTickets : closedTickets;
    const isClosed = selectedTicket?.status !== 'open';

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-50 animate-fade-in">

            {/* ── LEFT: Ticket List ── */}
            <aside className="w-80 shrink-0 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-5 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-black">Grievance Portal</h1>
                    <p className="text-xs text-gray-400 mt-1">Student support tickets</p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 text-sm font-medium">
                    <button
                        onClick={() => setActiveTab('open')}
                        className={`flex-1 py-3 transition-colors ${activeTab === 'open'
                            ? 'border-b-2 text-black'
                            : 'text-gray-400 hover:text-gray-600'}`}
                        style={activeTab === 'open' ? { borderColor: '#f3723b', color: '#f3723b' } : {}}
                    >
                        Open
                        {openTickets.length > 0 && (
                            <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full text-white"
                                style={{ backgroundColor: '#f3723b' }}>
                                {openTickets.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('closed')}
                        className={`flex-1 py-3 transition-colors ${activeTab === 'closed'
                            ? 'border-b-2 text-black'
                            : 'text-gray-400 hover:text-gray-600'}`}
                        style={activeTab === 'closed' ? { borderColor: '#f3723b', color: '#f3723b' } : {}}
                    >
                        Closed
                    </button>
                </div>

                {/* Ticket list */}
                <div className="flex-1 overflow-y-auto">
                    {loadingTickets ? (
                        <div className="p-6 text-center text-gray-400 text-sm">Loading tickets…</div>
                    ) : displayedTickets.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 text-sm">No {activeTab} tickets</div>
                    ) : (
                        displayedTickets.map(ticket => {
                            const isSelected = selectedTicket?.id === ticket.id;
                            return (
                                <button
                                    key={ticket.id}
                                    onClick={() => setSelectedTicket(ticket)}
                                    className={`w-full text-left px-5 py-4 border-b border-gray-100 transition-colors ${isSelected
                                        ? 'bg-orange-50'
                                        : 'hover:bg-gray-50'}`}
                                    style={isSelected ? { borderLeft: '3px solid #f3723b' } : { borderLeft: '3px solid transparent' }}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-mono text-gray-400 truncate max-w-[120px]">
                                            {ticket.ticketId || ticket.id}
                                        </span>
                                        <span
                                            className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                            style={ticket.status === 'open'
                                                ? { backgroundColor: '#FFE4E0', color: '#C0392B' }
                                                : { backgroundColor: '#dcfce7', color: '#166534' }}
                                        >
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-800 truncate">
                                        {ticket.createdBy}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {ticket.createdAt ? formatDate(ticket.createdAt) : ''}
                                    </p>
                                </button>
                            );
                        })
                    )}
                </div>
            </aside>

            {/* ── RIGHT: Chat Panel ── */}
            <main className="flex-1 flex flex-col min-w-0">
                {!selectedTicket ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <p className="text-sm font-medium">Select a ticket to view conversation</p>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="font-bold text-black">{selectedTicket.createdBy}</h2>
                                    <span
                                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                        style={selectedTicket.status === 'open'
                                            ? { backgroundColor: '#FFE4E0', color: '#C0392B' }
                                            : { backgroundColor: '#dcfce7', color: '#166534' }}
                                    >
                                        {selectedTicket.status}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5 font-mono">
                                    ID: {selectedTicket.ticketId || selectedTicket.id}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="text-xs text-gray-400">
                                    Opened: {selectedTicket.createdAt ? formatDate(selectedTicket.createdAt) : '—'}
                                </p>
                                {selectedTicket.status === 'open' && (
                                    <button
                                        onClick={closeTicket}
                                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors border border-red-200"
                                    >
                                        Close Ticket
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                            {messages.length === 0 ? (
                                <p className="text-center text-sm text-gray-400 mt-8">No messages yet</p>
                            ) : (
                                messages.map(msg => {
                                    const isAdmin = msg.sender === ADMIN_EMAIL;
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[70%] ${isAdmin ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                                                <span className="text-xs text-gray-400 px-1">
                                                    {isAdmin ? 'Admin' : msg.sender} · {formatTime(msg.time)}
                                                </span>
                                                <div
                                                    className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm"
                                                    style={isAdmin
                                                        ? { backgroundColor: '#f3723b', color: '#fff', borderBottomRightRadius: '4px' }
                                                        : { backgroundColor: '#fff', color: '#1a1a1a', border: '1px solid #e5e7eb', borderBottomLeftRadius: '4px' }}
                                                >
                                                    {msg.text}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Reply Box or Closed Banner */}
                        {isClosed ? (
                            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-center gap-2 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <span className="text-sm text-gray-500 font-medium">This ticket has been closed · Read-only</span>
                            </div>
                        ) : (
                            <div className="bg-white border-t border-gray-200 px-6 py-4 flex gap-3 items-end shrink-0">
                                <textarea
                                    value={reply}
                                    onChange={e => setReply(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                                    placeholder="Type your reply… (Enter to send)"
                                    rows={2}
                                    className="flex-1 resize-none border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 transition-all"
                                    style={{ '--tw-ring-color': '#f3723b' }}
                                />
                                <button
                                    onClick={sendReply}
                                    disabled={sending || !reply.trim()}
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 shrink-0"
                                    style={{ backgroundColor: '#f3723b' }}
                                >
                                    {sending ? (
                                        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M21 12a9 9 0 1 1-6.22-8.56" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                                        </svg>
                                    )}
                                    Send Reply
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
