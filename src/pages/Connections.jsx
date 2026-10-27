import { Link } from "react-router-dom";
import { RefreshCw, UsersRound, MessageCircle } from "lucide-react";
import { useGetConnectionsQuery } from "../api/feedApi";
import "./RelationshipPages.css";

const getItems = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.connections)) return data.connections;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

function Connections() {
  const { data, isLoading, isError, refetch } = useGetConnectionsQuery();
  const connections = getItems(data);

  return (
    <main className="relationship-page">
      <header className="relationship-heading">
        <div className="relationship-heading-icon"><UsersRound size={23} /></div>
        <div>
          <p className="relationship-eyebrow">YOUR COMMUNITY</p>
          <h1>Connections</h1>
          <p className="relationship-subtitle">Developers you’ve connected with.</p>
        </div>
      </header>

      {isLoading ? (
        <section className="relationship-state" aria-live="polite">
          <div className="relationship-spinner" />
          <p>Loading your connections…</p>
        </section>
      ) : isError ? (
        <section className="relationship-state" role="alert">
          <h2>We couldn’t load your connections</h2>
          <p>Please check your connection and try again.</p>
          <button className="relationship-retry" onClick={() => refetch()}><RefreshCw size={16} /> Try again</button>
        </section>
      ) : connections.length === 0 ? (
        <section className="relationship-state relationship-empty">
          <div className="relationship-empty-icon"><UsersRound size={28} /></div>
          <h2>Your network starts here</h2>
          <p>You haven’t made any connections yet. Keep discovering developers and send a like to start a conversation.</p>
          <Link className="relationship-primary" to="/feed">Discover developers</Link>
        </section>
      ) : (
        <section className="relationship-grid" aria-label="Your connections">
          {connections.map((connection, index) => {
            const personValue = connection?.connectedUser ?? connection?.user ?? connection?.connectedUserId ?? connection?.userId ?? connection;
            const person = typeof personValue === "object" ? personValue : connection;
            const personId = person?._id ?? person?.userId ?? connection?.connectedUserId ?? connection?.userId ?? connection?._id ?? personValue;
            const chatUserId = personId ?? connection?.id ?? `connection-${index}`;
            const name = [person?.firstName, person?.lastName].filter(Boolean).join(" ") || "Developer";
            return (
              <article className="relationship-person" key={connection?._id ?? person?._id ?? index}>
                {person?.photoUrl ? (
                  <img className="relationship-avatar" src={person.photoUrl} alt={`${name}'s profile`} />
                ) : (
                  <div className="relationship-avatar relationship-avatar-fallback" aria-label={`${name}'s profile`}>
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="relationship-person-info">
                  <h2>{name}{person?.age ? <span>, {person.age}</span> : null}</h2>
                  <p>{person?.about || person?.gender || "Twingle.Live connection"}</p>
                </div>
                <div className="connection-card-actions">
                  <span className="relationship-connected">Connected</span>
                  <Link
                    className="connection-chat-button"
                    to={`/chat/${encodeURIComponent(String(chatUserId))}`}
                    state={{ person: { ...person, _id: chatUserId } }}
                    aria-label={`Open chat with ${name}`}
                  >
                    <MessageCircle size={16} /> Chat
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default Connections;
