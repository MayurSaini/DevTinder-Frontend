import { Link, NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../api/authApi";
import { setUser } from "../features/auth/authSlice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const user = useSelector((state) => state.auth.user);
  const handleLogout = async () => {
    const result = await logout();
    console.log("result-==--==-=-=--==-=->", result);
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

        {/* Navigation */}
        <nav className="navbar-links">
          <NavLink to="/feed" className={({ isActive }) => `navbar-link${isActive ? " active" : ""}`}>
            Discover
          </NavLink>

          <NavLink to="/connections" className={({ isActive }) => `navbar-link${isActive ? " active" : ""}`}>
            Connections
          </NavLink>

          <NavLink to="/requests" className={({ isActive }) => `navbar-link${isActive ? " active" : ""}`}>
            Requests
          </NavLink>
          <NavLink to="/membership" className={({ isActive }) => `navbar-link${isActive ? " active" : ""}`}>
            Premium
          </NavLink>
        </nav>

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
    </header>
  );
}

export default Navbar;
