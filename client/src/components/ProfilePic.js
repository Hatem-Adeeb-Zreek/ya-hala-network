// ProfilePic Functional Component
export default function ProfilePic({
    first,
    last,
    profilePicUrl,
    toggleUploader,
}) {
    return (
        <div>
            <img
                key={profilePicUrl}
                className="avatar"
                src={profilePicUrl || "/profile-fallback.e7a6f788830c.jpg"}
                alt={`${first} ${last}`}
                onClick={toggleUploader}
            />
        </div>
    );
}
