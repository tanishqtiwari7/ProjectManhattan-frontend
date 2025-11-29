import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, FileText, Briefcase, Building2, UserCheck, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar({ className, onClose }) {
  const { role, logout } = useAuthStore();
  const location = useLocation();

  const studentLinks = [
    { href: '/student', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/student/caf', label: 'CAF Form', icon: FileText },
    { href: '/student/internships', label: 'Internships', icon: Briefcase },
    { href: '/student/placements', label: 'Placements', icon: Building2 },
    { href: '/student/mock-interviews', label: 'Mock Interviews', icon: UserCheck },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/notifications', label: 'Notifications', icon: FileText },
    { href: '/admin/students', label: 'Students', icon: UserCheck },
    { href: '/admin/mock-upload', label: 'Upload Results', icon: Building2 },
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <div className={cn("flex h-full w-64 flex-col border-r bg-white", className)}>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Portal</h1>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.href;
          return (
            <Link key={link.href} to={link.href} onClick={onClose}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <Icon className="mr-2 h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full justify-start" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
