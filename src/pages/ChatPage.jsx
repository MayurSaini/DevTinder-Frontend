import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, MessageCircle, Send, ShieldCheck } from "lucide-react";
import "./ChatPage.css";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { API_URL } from "../api/constant";

const getId = (value) => {
  if (value == null) return "";
  if (typeof value === "object") return String(value._id ?? value.id ?? value.userId ?? "");
  return String(value);
};

export default function ChatPage() {
  const { targetUserId } = useParams();
  const { state } = useLocation();
  const person = state?.person;
  const currentUser = useSelector((store) => store.auth.user);
  const senderName = [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(" ") || "You";
  const name = [person?.firstName, person?.lastName].filter(Boolean).join(" ") || "Your connection";
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([]);
  const user = useSelector((state) => state.auth.user);

  const userId = getId(user?._id ?? user?.id ?? user?.userId ?? user?.user?._id ?? user?.data?._id);
  const normalizedCurrentName = senderName.trim().toLocaleLowerCase();
  const normalizedCurrentFirstName = currentUser?.firstName?.trim().toLocaleLowerCase();

  useEffect(() => {
    let active = true;

    const fetchChatMessages = async () => {
      try {
        const chat = await axios.get(`${API_URL}/chat/${targetUserId}`, {
          withCredentials: true,
        });
        if (!active) return;

        setMessages((chat.data?.messages || []).map((message) => ({
          id: message._id,
          senderId: getId(message.senderId ?? message.userId),
          sender: [message.senderId?.firstName, message.senderId?.lastName].filter(Boolean).join(" "),
          text: message.text,
          sentAt: new Date(message.createdAt),
        })));
      } catch (error) {
        console.error("Unable to load chat messages", error);
      }
    };

    fetchChatMessages();
    return () => { active = false; };
  }, [targetUserId]);
  
  useEffect(() => {
    console.log("userId=======>", userId);
    
    if (!userId) {
      return
    }
    const socket  = createSocketConnection();
    console.log("SOCKET ID :" + socket.id);
    
    socket.emit("joinChat", {firstName: user?.firstName, userId, targetUserId} );
    socket.on("messageReceived", (data) => {
          setMessages((current) => [...current, { id: data?._id || `${Date.now()}-${current.length}`, senderId: getId(data?.senderId ?? data?.userId), sender: data?.firstName, text: data?.text, sentAt: new Date(data?.createdAt || Date.now()) }]);

      console.log("message received is"+JSON.stringify(data));
      
    })
    return () => {
      socket.disconnect();
    }
  }, [userId, targetUserId])

  const handleSend = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
        const socket  = createSocketConnection();

    socket.emit("sendMessage", {firstName: user?.firstName, userId, targetUserId, text: text} );
    setDraft("");
  };

  return (
    <main className="chat-page">
      <section className="chat-panel" aria-label={`Chat with ${name}`}>
        <header className="chat-header">
          <Link className="chat-back" to="/connections" aria-label="Back to connections"><ArrowLeft size={19} /></Link>
          {person?.photoUrl ? (
            <img className="chat-avatar" src={person.photoUrl} alt="" />
          ) : (
            <div className="chat-avatar chat-avatar-fallback" aria-hidden="true">{name.charAt(0).toUpperCase()}</div>
          )}
          <div className="chat-person-heading">
            <h1>{name}</h1>
            <p><span className="chat-status-dot" /> Connected on Twingle</p>
          </div>
          <div className="chat-private-note"><ShieldCheck size={16} /> Private conversation</div>
        </header>

        <div className="chat-history" aria-live="polite" aria-relevant="additions">
          {messages.length === 0 ? (
            <div className="chat-empty">
              <div className="chat-empty-icon"><MessageCircle size={25} /></div>
              <h2>Say hello to {name.split(" ")[0]}</h2>
              <p>You’re connected. Start a conversation and see where it goes.</p>
            </div>
          ) : (
            <>
              <div className="chat-day-divider"><span>Today</span></div>
              {messages.map((message) => {
                const senderId = getId(message.senderId);
                const senderNameForMessage = message.sender?.trim().toLocaleLowerCase();
                const isOwnMessage = (Boolean(userId) && senderId === userId) ||
                  (Boolean(normalizedCurrentName) && normalizedCurrentName !== "you" && senderNameForMessage === normalizedCurrentName) ||
                  (Boolean(normalizedCurrentFirstName) && senderNameForMessage === normalizedCurrentFirstName);

                return (
                  <div
                    className={`chat-message-row ${isOwnMessage ? "sent chat-end" : "received chat-start"}`}
                    key={message.id}
                    style={{ justifyContent: isOwnMessage ? "flex-end" : "flex-start" }}
                  >
                  <div className="chat-message-content">
                    <span className="chat-message-sender">{message.sender || (isOwnMessage ? senderName : name)}</span>
                    <div className="chat-message-bubble">
                      <p>{message.text}</p>
                      <time dateTime={message.sentAt.toISOString()}>{message.sentAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</time>
                    </div>
                  </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <form className="chat-composer" onSubmit={handleSend}>
          <label className="sr-only" htmlFor="chat-message">Write a message</label>
          <input
            id="chat-message"
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={`Message ${name.split(" ")[0]}…`}
            maxLength={2000}
            autoComplete="off"
          />
          <button type="submit" aria-label="Send message" disabled={!draft.trim()}><Send size={18} /></button>
        </form>
        <p className="chat-footer-note">Be kind, keep it respectful, and never share sensitive information.</p>
      </section>
      <span className="sr-only">Conversation ID: {userId}</span>
    </main>
  );
}
