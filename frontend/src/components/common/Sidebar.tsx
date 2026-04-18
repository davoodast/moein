import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Calendar,
  Users,
  FileText,
  CreditCard,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  const adminMenu = [
    { href: '/admin', label: 'داشبورد', icon: BarChart3 },
    { href: '/admin/ceremonies', label: 'مراسم‌ها', icon: Calendar },
    { href: '/admin/employees', label: 'کارمندان', icon: Users },
    { href: '/admin/payroll', label: 'حقوق', icon: CreditCard },
    { href: '/admin/expenses', label: 'هزینه‌ها', icon: FileText },
    { href: '/admin/settings', label: 'تنظیمات', icon: Settings },
  ];

  const employeeMenu = [
    { href: '/employee', label: 'داشبورد', icon: BarChart3 },
    { href: '/employee/calendar', label: 'تقویم کاری', icon: Calendar },
    { href: '/employee/payroll', label: 'فیش حقوق', icon: CreditCard },
  ];

  const menu = user?.role === 'admin' ? adminMenu : employeeMenu;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed right-0 inset-y-0 md:static w-64 h-full bg-white dark:bg-gray-900 shadow-xl border-l border-gray-200 dark:border-gray-700 transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        <nav className="pt-4 px-4 space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
