import { Link, NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../api/authApi";
import { setUser } from "../features/auth/authSlice";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Compass, UsersRound, Inbox, Crown } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const user = useSelector((state) => state.auth.user);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!isDrawerOpen) return undefined;

    const focusableItems = drawerRef.current?.querySelectorAll("a, button");
    focusableItems?.[0]?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === "Tab" && focusableItems?.length) {
        const first = focusableItems[0];
        const last = focusableItems[focusableItems.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    menuButtonRef.current?.focus();
  };

  const handleLogout = async () => {
    const result = await logout();
    console.log("logout pressed-==--==-=-=--==-=->", result);
     dispatch(setUser({}));
    // Your backend logout API will be called here later
    navigate("/login");
  };
console.log("user-==-=-=-=--=-==--=>", user);

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/feed" className="navbar-logo">
          Twingle<span>.Live</span>
        </Link>

        <button
          ref={menuButtonRef}
          type="button"
          className="navbar-menu-button"
          aria-label={isDrawerOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isDrawerOpen}
          aria-controls="site-navigation-drawer"
          onClick={() => setIsDrawerOpen((open) => !open)}
        >
          {isDrawerOpen ? <X size={20} /> : <Menu size={20} />}
          <span>Menu</span>
        </button>

        {/* Right Side */}
        <div className="navbar-right">
          <Link to="/about" className="navbar-link">About</Link>
          <Link to="/contact" className="navbar-link">Contact</Link>
             {user?.emailId && <button className="icon-button">🔔</button>}
          <Link to="/profile" className="profile-button">
            <div className="navbar-avatar">
              {user?.firstName ? user?.firstName?.slice(0,1) : 'M' }
            </div>

            <span>Profile</span>
          </Link>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            {user?.emailId ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>

      {isDrawerOpen && (
        <div className="navigation-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            closeDrawer();
          }
        }}>
          <section
            ref={drawerRef}
            id="site-navigation-drawer"
            className="navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="navigation-drawer-title"
          >
            <div className="navigation-drawer-header">
              <div><span className="navigation-drawer-kicker">YOUR TWINGLE</span><h2 id="navigation-drawer-title">Explore</h2></div>
              <button type="button" className="navigation-drawer-close" onClick={closeDrawer} aria-label="Close navigation menu"><X size={20} /></button>
            </div>
            <nav className="navigation-drawer-links" aria-label="Main navigation">
              <NavLink to="/feed" onClick={closeDrawer} className={({ isActive }) => `navigation-drawer-link${isActive ? " active" : ""}`}><Compass size={19} /><span><strong>Discover</strong><small>Find people to connect with</small></span></NavLink>
              <NavLink to="/connections" onClick={closeDrawer} className={({ isActive }) => `navigation-drawer-link${isActive ? " active" : ""}`}><UsersRound size={19} /><span><strong>Connections</strong><small>Your growing network</small></span></NavLink>
              <NavLink to="/requests" onClick={closeDrawer} className={({ isActive }) => `navigation-drawer-link${isActive ? " active" : ""}`}><Inbox size={19} /><span><strong>Requests</strong><small>Invitations waiting for you</small></span></NavLink>
              <NavLink to="/membership" onClick={closeDrawer} className={({ isActive }) => `navigation-drawer-link${isActive ? " active" : ""}`}><Crown size={19} /><span><strong>Premium</strong><small>Get more from Twingle</small></span></NavLink>
            </nav>
            <div className="navigation-drawer-footer">Meet your next favorite collaborator.</div>
          </section>
        </div>
      )}
    </header>
  );
}

export default Navbar;
