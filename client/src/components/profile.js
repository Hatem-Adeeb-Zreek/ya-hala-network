// import components
import ProfilePic from "./ProfilePic";
import BioEditor from "./BioEditor";

// Profile function component
export default function Profile(props) {
    // Profile render
    return (
        <div className="profile">
            <div>
                <h2>
                    {props.first} {props.last}
                </h2>
                <BioEditor
                    bio={props.bio}
                    methodInAppBio={props.methodInAppBio}
                />
            </div>

            <ProfilePic
                first={props.first}
                last={props.last}
                key={props.profilePicUrl}
                profilePicUrl={props.profilePicUrl}
            />
        </div>
    );
}
