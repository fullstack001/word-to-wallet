export interface User {
  id?: string;
  email?: string;
  name?: string;
  subscription?: {
    plan: string;
  };
}

export interface NavbarProps {
  isLoggedIn: boolean;
  user: User;
  t: (key: string) => string;
  navigate: (path: string) => void;
  mobileMenuOpen: boolean;
  userDropdownOpen: boolean;
  onMobileToggle: () => void;
  onUserDropdownToggle: () => void;
  onLogout: () => void;
  onCloseMobileMenu: () => void;
  onCloseUserDropdown: () => void;
}
