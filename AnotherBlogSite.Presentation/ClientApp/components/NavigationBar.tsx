import {Link} from "react-router-dom";
import "../assets/NavigationBar.css"
import {useContext} from "react";
import {IAuthContext, AuthContext} from "./AuthContext.tsx";

export default function NavigationBar() {
    const { accessToken, updateAccessToken } = useContext(AuthContext) as IAuthContext;

    const handleSignOut = () => {
        updateAccessToken(null);
    }

    return <nav className="navBar">
        <Link className="navBarButton" to="blogPosts">Blog Posts</Link>
        { !accessToken && <Link className="navBarButton" to="signIn">Sign In</Link> }
        { accessToken && <div className="navBarButton navBarSignOutButton" onClick={() => handleSignOut()}>Sign Out</div>  }
    </nav>;
}