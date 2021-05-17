// import modules
// import BioEditor from "./BioEditor";
import ProfilePic from "./ProfilePic";
import BioEditor from "./BioEditor";

// Profile Class Component
export default function Profile(props) {
    return (
        <div className="profile">
            <div className="bio-wrapper">
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
