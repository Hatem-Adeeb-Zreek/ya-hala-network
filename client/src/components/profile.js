// import modules
// import BioEditor from "./BioEditor";
import ProfilePic from "./ProfilePic";
import BioEditor from "./BioEditor";

// Profile Class Component
export default function Profile(props) {
    return (
        <div className="profile">
            <ProfilePic
                first={props.first}
                last={props.last}
                key={props.profilePicUrl}
                profilePicUrl={props.profilePicUrl}
            />
            <p>
                {props.first} {props.last}
            </p>

            <BioEditor bio={props.bio} methodInAppBio={props.methodInAppBio} />
        </div>
    );
}
