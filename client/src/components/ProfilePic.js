// ProfilePic function component
export default function ProfilePic({
    first,
    last,
    profilePicUrl,
    toggleUploader,
}) {
    // ProfilePic render
    return (
        <div>
            <img
                key={profilePicUrl}
                className="avatar"
                src={profilePicUrl || "/profile-fallback.e7a6f788830c.jpg"}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/profile-fallback.e7a6f788830c.jpg";
                }}
                alt={`${first} ${last}`}
                onClick={toggleUploader}
            />
        </div>
    );
}
