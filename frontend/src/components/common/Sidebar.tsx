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
      {/* Mobile overlay for drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar drawer – desktop: static, mobile: slide from right */}
      <aside
        className={`fixed right-0 top-16 bottom-0 md:static w-64 bg-white dark:bg-gray-900 shadow-xl border-l border-gray-200 dark:border-gray-700 transform transition-transform duration-300 z-40 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        <nav className="pt-4 px-4 space-y-2 pb-20 md:pb-4">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-medium'
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

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex items-center justify-around h-14">
          {menu.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                  isActive
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-[10px] font-medium leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
