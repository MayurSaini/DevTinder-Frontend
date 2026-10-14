import { useState } from "react";
import "./Feed.css";
import { useGetFeedQuery, useSendRequestMutation } from "../api/feedApi";
import { Compass, RefreshCw, UsersRound, Heart, X, Star, Sparkles, MapPin } from "lucide-react";

function Feed() {
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [action, setAction] = useState("");
  const [sendRequest] = useSendRequestMutation();
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetFeedQuery();
  const profiles = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];
  const currentProfile = profiles[currentIndex];
  const profileName = currentProfile
    ? [currentProfile.firstName, currentProfile.lastName].filter(Boolean).join(" ") || currentProfile.name || "Developer"
    : "";
  const profileAbout = currentProfile?.about || currentProfile?.bio || "This developer hasn’t added an introduction yet.";
  const profileInitials = profileName.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
console.log("currentProfile-=-==--==->", currentProfile);

  const sendConnectRequest = async () => {
    const body = {
      userId: currentProfile?._id,
      status: "interested",
    }
    const result = await sendRequest(body);
    console.log("print. the result of it", result);
    

  }
 
  const handleAction = (type) => {
    setAction(type);
    if (type === 'like') {
      sendConnectRequest()
    }
    setTimeout(() => {
      setAction("");

      setCurrentIndex((prev) => (prev < profiles.length - 1 ? prev + 1 : 0));
    }, 400);
  };

  return (
    <div className="feed-page">
      {/* Main Content */}
      <main className="feed-container">
        <div className="feed-title">
          <div>
            <h1>Discover Developers</h1>
            <p>Find someone who matches your vibe.</p>
          </div>

          <div className="feed-title-note"><Sparkles size={16} /> A new connection could be one swipe away</div>
        </div>

        {isLoading ? (
          <section className="feed-state-card feed-loading" aria-live="polite">
            <div className="feed-state-icon"><UsersRound size={28} /></div>
            <div className="feed-skeleton feed-skeleton-title" />
            <div className="feed-skeleton feed-skeleton-copy" />
            <div className="feed-skeleton feed-skeleton-copy short" />
            <p>Finding developers for you…</p>
          </section>
        ) : isError ? (
          <section className="feed-state-card" role="alert">
            <div className="feed-state-icon error-icon"><RefreshCw size={27} /></div>
            <h2>We couldn’t load your feed</h2>
            <p>Something interrupted the connection. Give it another try.</p>
            <button className="feed-retry-button" onClick={() => refetch()}>
              <RefreshCw size={16} /> Try again
            </button>
          </section>
        ) : profiles.length === 0 ? (
          <section className="feed-state-card" aria-live="polite">
            <div className="feed-state-icon"><Compass size={29} /></div>
            <h2>No profiles to discover yet</h2>
            <p>There aren’t any developers in your feed right now. Check back soon for new people to meet.</p>
            <button className="feed-retry-button" onClick={() => refetch()}>
              <RefreshCw size={16} /> Refresh feed
            </button>
          </section>
        ) : (
          <>
        <div className="feed-progress-row">
          <span>DEVELOPER SPOTLIGHT</span>
          <span>{currentIndex + 1} <i>/</i> {profiles.length}</span>
          <div className="feed-progress-track" aria-hidden="true">
            <span style={{ width: `${((currentIndex + 1) / profiles.length) * 100}%` }} />
          </div>
        </div>
        {/* Profile Card */}
        <article
          key={currentProfile?._id ?? currentIndex}
          className={`feed-profile-card ${
            action === "like"
              ? "card-like"
              : action === "pass"
              ? "card-pass"
              : ""
          }`}
        >
          <div className={`feed-profile-hero${currentProfile?.photoUrl ? " has-photo" : ""}`}>
            {currentProfile?.photoUrl ? (
              <img src={currentProfile.photoUrl} alt={`${profileName}'s profile`} className="feed-profile-image" />
            ) : (
              <div className="feed-avatar-placeholder" aria-label={`${profileName}'s profile picture unavailable`}>
                <span>{profileInitials}</span>
                <small>Developer profile</small>
              </div>
            )}

            <div className="feed-profile-badge"><Sparkles size={14} /> Developer profile</div>
          </div>

          <div className="feed-profile-content">
            <div className="feed-profile-name-row">
              <div>
                <h2>{profileName}{currentProfile?.age ? <span>, {currentProfile.age}</span> : null}</h2>
                <p className="feed-role">{currentProfile?.role || "Developer"}</p>
              </div>
            </div>

            <div className="feed-profile-meta">
              {currentProfile?.gender && <span>{currentProfile.gender}</span>}
              {currentProfile?.location && <span><MapPin size={14} />{currentProfile.location}</span>}
            </div>

            <div className="feed-about-section">
              <h3>About</h3>
              <p className="feed-about">
                {profileAbout}
              </p>
            </div>

            <div className="feed-skills-section">
              <h3>Skills</h3>
              {currentProfile?.skills?.length ? (
                <div className="feed-skills">
                  {currentProfile.skills.map((skill) => <span key={skill}>{skill}</span>)}
                </div>
              ) : (
                <p className="feed-no-skills">No skills added yet.</p>
              )}
            </div>

            <div className="feed-actions-wrap">
              <p>Interested in connecting?</p>
              <div className="feed-card-actions">
                <button className="feed-action-button pass" aria-label={`Pass on ${profileName}`} onClick={() => handleAction("pass")}>
                  <X size={21} />
                </button>
                <button className="feed-action-button super" aria-label={`Super like ${profileName}`} onClick={() => handleAction("like")}>
                  <Star size={19} />
                </button>
                <button className="feed-action-button like" aria-label={`Like ${profileName}`} onClick={() => handleAction("like")}>
                  <Heart size={21} />
                </button>
              </div>
              <p className="feed-action-hint">Pass <span>•</span> Super like <span>•</span> Connect</p>
            </div>
          </div>
        </article>

        <p className="swipe-hint">
          Profiles are shown one at a time. Take a moment to explore each developer.
        </p>
          </>
        )}
      </main>
    </div>
  );
}

export default Feed;
