import type { RootState } from "../../store/store";

export interface MenuItem {
  label: string;
  route: string;
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}

export interface User {
  email?: string;
  cardnumber?: string; // Add cardnumber property
  avatar?: string;
  subscription?: {
    plan?: string;
  };
}

export interface NavbarProps {
  isLoggedIn: boolean;
  user: User;
  t: (key: string) => string;
  navigate: (route: string) => void;
  mobileMenuOpen: boolean;
  userDropdownOpen: boolean;
  onMobileToggle: () => void;
  onUserDropdownToggle: () => void;
  onLogout: () => void;
  onCloseMobileMenu: () => void;
  onCloseUserDropdown: () => void;
}

export interface DropdownProps {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export interface AuthButtonProps {
  onClick: () => void;
  label: string;
  className?: string;
}

export interface LogoProps {
  onNavigateHome: () => void;
}
