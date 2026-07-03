import { FiMenu } from "react-icons/fi";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import SearchBar from "../SearchBar/SearchBar";
import NotificationDropdown from "../NotificationDropdown/NotificationDropdown";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import "./TopNavbar.css";

export default function TopNavbar({
  basePath,
  baseLabel,
  role,
  userName,
  onOpenMobileSidebar,
}) {
  return (
    <header className="top-navbar">
      <div className="top-navbar-left">
        <button className="hamburger-btn" onClick={onOpenMobileSidebar}>
          <FiMenu />
        </button>
        <Breadcrumb basePath={basePath} baseLabel={baseLabel} />
      </div>

      <div className="top-navbar-right">
        <SearchBar />
        <NotificationDropdown />
        <ProfileDropdown name={userName} role={role} basePath={basePath} />
      </div>
    </header>
  );
}
