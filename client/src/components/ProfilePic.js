// ProfilePic Functional Component
export default function ProfilePic({
    first,
    last,
    profilePicUrl,
    toggleUploader,
}) {
    return (
        <>
            <img
                className="profileIcon"
                src={profilePicUrl || "/profile-fallback.e7a6f788830c.jpg"}
                alt={first + " " + last}
                onClick={toggleUploader}
            />
        </>
    );
}
