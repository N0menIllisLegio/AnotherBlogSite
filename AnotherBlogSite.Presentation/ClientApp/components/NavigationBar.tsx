import {Link} from "react-router-dom";
import "../assets/NavigationBar.css"
import {useContext} from "react";
import {ISiteContext, SiteContext} from "./SiteContext.tsx";
import {signOut} from "../services/AuthService.ts";

export default function NavigationBar() {
    const { isUserAuthorized, setIsUserAuthorized } = useContext(SiteContext) as ISiteContext;

    const handleSignOut = () => {
        signOut();
        setIsUserAuthorized(false);
    }

    return <nav className="navBar">
        <Link className="navBarButton" to="blogPosts">Blog Posts</Link>
        { !isUserAuthorized && <Link className="navBarButton" to="signIn">Sign In</Link> }
        { isUserAuthorized && <div className="navBarButton navBarSignOutButton" onClick={() => handleSignOut()}>Sign Out</div>  }
    </nav>;
}