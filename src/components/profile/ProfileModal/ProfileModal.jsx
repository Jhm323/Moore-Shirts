import React, { useState, useEffect } from "react";
import Avatar from "../../ui/Avatar";
import Btn from "../../ui/Btn";
import "./ProfileModal.css";

export default function ProfileModal({ user, profile, updateProfile, onClose, onSignOut }) {
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDisplayName(profile?.display_name || "");
  }, [profile]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    const result = await updateProfile({ display_name: displayName.trim() || null });
    setSaving(false);
    if (result.error) setError(result.error);
    else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <div className="profile-modal__overlay" onClick={onClose}>
      <div className="profile-modal__card" onClick={(e) => e.stopPropagation()}>
        <button className="profile-modal__close" onClick={onClose} aria-label="Close">×</button>
        <div className="profile-modal__header">
          <Avatar label={displayName || user.email} size={64} />
          <div className="profile-modal__email">{user.email}</div>
        </div>
        <form onSubmit={handleSave}>
          <label className="profile-modal__field">
            <div className="profile-modal__field-label">Display name</div>
            <input
              className="profile-modal__field-input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How should we address you?"
              maxLength={60}
            />
          </label>
          {error && <p className="profile-modal__error">{error}</p>}
          {saved && <p className="profile-modal__saved">Saved.</p>}
          <div className="profile-modal__actions">
            <Btn type="submit" variant="primary" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Btn>
            <Btn type="button" variant="ghost" onClick={onSignOut}>
              Sign out
            </Btn>
          </div>
        </form>
      </div>
    </div>
  );
}
