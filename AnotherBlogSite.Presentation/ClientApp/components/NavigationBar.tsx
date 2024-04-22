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
    
    return <div className="navBar">
        <Link to="blogPosts">Blog Posts</Link>
        { !isUserAuthorized && <Link to="signIn">Sign In</Link> }
        { isUserAuthorized && <div onClick={() => handleSignOut()}>Sign Out</div>  }
    </div>;
}