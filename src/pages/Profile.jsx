import { useEffect, useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import "./Profile.css";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../features/auth/authSlice";
import { useGetProfileQuery, useLazyGetProfileQuery, useUpdateProfileMutation } from "../api/authApi";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const authProfile = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

    const [fetchSenderProfile, {
      currentData: fetchedSenderProfile,
      isFetching: isSenderProfileLoading,
      isError: isSenderProfileError,
    }] = useLazyGetProfileQuery();

  const profile =  authProfile;
  const [updateProfile, {isLoading, error}] = useUpdateProfileMutation();
  const [formData, setFormData] = useState(profile ?? {});
  const [skillsData, setSkillsData] = useState(profile?.skills?.join(", ") ?? "");

  useEffect(() => {
    const requestId = authProfile?._id
    if (requestId) {
         fetchSenderProfile({ requestId: requestId })

    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setFormData(profile ?? {});
    setSkillsData(profile?.skills?.join(", ") ?? "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(profile ?? {});
    setSkillsData(profile?.skills?.join(", ") ?? "");
    setIsEditing(false);
  };

  const handleSave = async () => {
    // dispatch(setUser({
    //   ...profile,
    //   ...formData,
    //   skills: skillsData.split(",").map((skill) => skill.trim()).filter(Boolean),
    // }));
    const body = {
      about: formData?.about,
      photoUrl: formData?.photoUrl,
      skills: skillsData.split(",").map((skill) => skill.trim()).filter(Boolean),
      firstName: formData.firstName,
      lastName: formData.lastName,
      emailId: formData.emailId,
      age: formData?.age,
      gender: formData?.gender,
    }
    try {
      await updateProfile(body).unwrap();
      setIsEditing(false);
    } catch {
      // Keep the form open so the mutation error can be shown for correction/retry.
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* Header */}
        <div className="profile-header">
          <div>
            <h1>My Profile</h1>
            <p>Manage your DevTinder profile</p>
          </div>

          {!isEditing && (
            <button
              className="edit-profile-btn"
              onClick={handleEdit}
            >
              <Pencil size={16} aria-hidden="true" />
              Edit profile
            </button>
          )}
        </div>

        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-cover" aria-hidden="true" />

          {/* Profile Header */}
          <div className="profile-info">

            <img
              src={isEditing ? formData?.photoUrl : profile?.photoUrl}
              alt={`${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim() || "Profile photo"}
              className="profile-image"
            />

            <div className="profile-name-section">
              <h2>
                {isEditing ? formData?.firstName : profile?.firstName} {isEditing ? formData?.lastName : profile?.lastName}
              </h2>

              <p className="profile-email">
                {profile?.emailId}
              </p>
              {!isEditing && (
                <p className="profile-personal-details">
                  Age: {profile?.age ?? "Not added"} · Gender: {profile?.gender || "Not added"}
                </p>
              )}
            </div>

          </div>

          {/* View Mode */}
          {!isEditing && (
            <div className="profile-details">

              <div className="detail-section">
                <h3>About</h3>

                <p>
                  {profile?.about || "No information added yet."}
                </p>
              </div>

              <div className="detail-section">
                <h3>Skills</h3>

                {profile?.skills?.length > 0 ? (
                  <div className="skills-container">
                    {profile.skills.map((skill, index) => (
                      <span
                        className="skill-tag"
                        key={index}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="empty-text">
                    No skills added yet.
                  </p>
                )}
              </div>

            </div>
          )}

          {/* Edit Mode */}
          {isEditing && (
            <div className="edit-form">
              <div className="edit-form-heading">
                <div>
                  <h3>Edit your details</h3>
                  <p>Keep your profile up to date so other developers can get to know you.</p>
                </div>
              </div>

              {/* First Name */}
              <div className="form-group">
                <label>First Name</label>

                <input
                  type="text"
                  name="firstName"
                  value={formData?.firstName}
                  onChange={handleChange}
                />
              </div>

              {/* Last Name */}
              <div className="form-group">
                <label>Last Name</label>

                <input
                  type="text"
                  name="lastName"
                  value={formData?.lastName}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="emailId"
                  value={formData?.emailId}
                  onChange={handleChange}
                />
              </div>

              {/* Photo URL */}
              <div className="form-group">
                <label>Profile Photo URL</label>

                <input
                  type="url"
                  name="photoUrl"
                  value={formData?.photoUrl ?? ""}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              {/* About */}
              <div className="form-group">
                <label>About</label>

                <textarea
                  name="about"
                  value={formData?.about}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Tell something about yourself..."
                />
              </div>

              {/* Skills */}
              <div className="form-group">
                <label>Skills</label>

                <input
                  type="text"
                  name="skills"
                  value={skillsData}
                  onChange={(e) => {
                    setSkillsData(e.target.value);
                  }}
                  placeholder="React, Node.js, MongoDB"
                />

                <small>
                  Separate skills using commas
                </small>
              </div>

              {/* Buttons */}
              {error && (
                <p className="profile-error" role="alert">
                  {error?.data?.message || "Your profile could not be saved. Please try again."}
                </p>
              )}

              <div className="form-actions">

                <button
                  className="cancel-btn"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X size={16} aria-hidden="true" />
                  Cancel
                </button>

                <button
                  className="save-btn"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  <Check size={16} aria-hidden="true" />
                  {isLoading ? "Saving..." : "Save changes"}
                </button>

              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
