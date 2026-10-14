import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Inbox, RefreshCw, UserRound, X } from "lucide-react";
import { useGetReceivedRequestsQuery, useReviewRequestMutation } from "../api/feedApi";
import { useLazyGetProfileQuery } from "../api/authApi";
import "./RelationshipPages.css";

const getItems = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.requests)) return data.requests;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const getProfileRecord = (data) => data?.profile ?? data?.user ?? data?.data ?? data;

function Requests() {
  const [reviewRequest, { isLoading: isReviewing }] = useReviewRequestMutation();
  const [reviewingRequest, setReviewingRequest] = useState(null);
  const [reviewErrorId, setReviewErrorId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [fetchSenderProfile, {
    currentData: fetchedSenderProfile,
    isFetching: isSenderProfileLoading,
    isError: isSenderProfileError,
  }] = useLazyGetProfileQuery();
  const { data, isLoading, isError, refetch } = useGetReceivedRequestsQuery();
  const requests = getItems(data);
  const senderProfile = getProfileRecord(fetchedSenderProfile) ?? selectedRequest?.person;
  const senderName = senderProfile
    ? [senderProfile.firstName, senderProfile.lastName].filter(Boolean).join(" ") || selectedRequest?.name
    : selectedRequest?.name;

  const handleViewProfile = ({ request, person, name, requestId, profileId }) => {
    setSelectedRequest({ request, person, name, requestId, profileId });
    if (profileId) fetchSenderProfile({ requestId: profileId });
  };

  useEffect(() => {
    if (!selectedRequest) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedRequest(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedRequest]);

  const handleReview = async (requestId, status) => {
    if (!requestId || isReviewing) return;

    setReviewingRequest({ requestId, status });
    setReviewErrorId(null);
    try {
      await reviewRequest({ requestId, status }).unwrap();
      setSelectedRequest(null);
    } catch {
      setReviewErrorId(requestId);
    } finally {
      setReviewingRequest(null);
    }
  };

  return (
    <main className="relationship-page">
      <header className="relationship-heading">
        <div className="relationship-heading-icon"><Inbox size={23} /></div>
        <div>
          <p className="relationship-eyebrow">CONNECTIONS</p>
          <h1>Requests</h1>
          <p className="relationship-subtitle">People who would like to connect with you.</p>
        </div>
      </header>

      {isLoading ? (
        <section className="relationship-state" aria-live="polite">
          <div className="relationship-spinner" />
          <p>Checking for new requests…</p>
        </section>
      ) : isError ? (
        <section className="relationship-state" role="alert">
          <h2>We couldn’t load your requests</h2>
          <p>Please check your connection and try again.</p>
          <button className="relationship-retry" onClick={() => refetch()}><RefreshCw size={16} /> Try again</button>
        </section>
      ) : requests.length === 0 ? (
        <section className="relationship-state relationship-empty">
          <div className="relationship-empty-icon"><Inbox size={28} /></div>
          <h2>You’re all caught up</h2>
          <p>There are no connection requests right now. New requests will show up here.</p>
          <Link className="relationship-primary" to="/feed">Explore the feed</Link>
        </section>
      ) : (
        <section className="relationship-grid" aria-label="Received connection requests">
          {requests.map((request, index) => {
            const sender = request?.fromUserId ?? request?.fromUser ?? request?.sender ?? request?.user ?? request;
            const person = sender && typeof sender === "object" ? sender : request;
            const name = [person?.firstName, person?.lastName].filter(Boolean).join(" ") || "Developer";
            const requestId = request?._id ?? request?.requestId;
            const profileId = typeof sender === "string" ? sender : person?._id;
            return (
              <article className="relationship-person request-person" key={requestId ?? person?._id ?? index}>
                {person?.photoUrl ? (
                  <img className="relationship-avatar" src={person.photoUrl} alt={`${name}'s profile`} />
                ) : (
                  <div className="relationship-avatar relationship-avatar-fallback" aria-label={`${name}'s profile`}>
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="relationship-person-info">
                  <h2>{name}{person?.age ? <span>, {person.age}</span> : null}</h2>
                  <p>{person?.about || person?.gender || "Would like to connect with you"}</p>
                </div>
                <div className="request-card-actions">
                  <button
                    className="view-request-profile"
                    onClick={() => handleViewProfile({ request, person, name, requestId, profileId })}
                    disabled={!profileId}
                  >
                    <UserRound size={15} /> View profile <ArrowRight size={15} />
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {selectedRequest && (
        <div
          className="request-modal-backdrop"
          onClick={() => setSelectedRequest(null)}
        >
          <section
            className="request-profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-profile-name"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="request-modal-close"
              onClick={() => setSelectedRequest(null)}
              aria-label="Close profile preview"
            >
              <X size={19} />
            </button>

            <div className="request-modal-banner" />
            <div className="request-modal-content">
              {senderProfile?.photoUrl ? (
                <img className="request-modal-avatar" src={senderProfile.photoUrl} alt={`${senderName}'s profile`} />
              ) : (
                <div className="request-modal-avatar relationship-avatar-fallback" aria-hidden="true">
                  {senderName?.charAt(0).toUpperCase()}
                </div>
              )}

              <p className="relationship-eyebrow">CONNECTION REQUEST</p>
              <h2 id="request-profile-name">
                {senderName}
                {senderProfile?.age ? <span>, {senderProfile.age}</span> : null}
              </h2>
              {senderProfile?.gender && (
                <p className="request-modal-gender">{senderProfile.gender}</p>
              )}

              {isSenderProfileLoading && (
                <p className="request-profile-loading" aria-live="polite">Loading full profile…</p>
              )}
              {isSenderProfileError && (
                <p className="request-profile-fetch-error" role="alert">
                  Could not load the full profile. Showing the details included with this request.
                </p>
              )}
              {!selectedRequest.profileId && (
                <p className="request-profile-fetch-error" role="status">
                  This request doesn’t include a sender profile ID, so only its included details are shown.
                </p>
              )}

              <div className="request-modal-section">
                <h3>About</h3>
                <p>{senderProfile?.about || "This developer hasn’t added an introduction yet."}</p>
              </div>

              <div className="request-modal-section">
                <h3>Skills</h3>
                {senderProfile?.skills?.length ? (
                  <div className="request-modal-skills">
                    {senderProfile.skills.map((skill) => <span key={skill}>{skill}</span>)}
                  </div>
                ) : (
                  <p>No skills added yet.</p>
                )}
              </div>

              {reviewErrorId === selectedRequest.requestId && (
                <p className="request-modal-error" role="alert">Could not update this request. Please try again.</p>
              )}

              <div className="request-modal-actions">
                <button
                  className="request-action-button reject-request"
                  onClick={() => handleReview(selectedRequest.requestId, "rejected")}
                  disabled={!selectedRequest.requestId || isReviewing}
                >
                  <X size={16} />
                  {reviewingRequest?.requestId === selectedRequest.requestId && reviewingRequest.status === "rejected" ? "Rejecting…" : "Reject request"}
                </button>
                <button
                  className="request-action-button accept-request"
                  onClick={() => handleReview(selectedRequest.requestId, "accepted")}
                  disabled={!selectedRequest.requestId || isReviewing}
                >
                  <Check size={16} />
                  {reviewingRequest?.requestId === selectedRequest.requestId && reviewingRequest.status === "accepted" ? "Accepting…" : "Accept request"}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default Requests;
