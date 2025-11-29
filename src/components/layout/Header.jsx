import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function Header({ onMenuClick }) {
  const { user } = useAuthStore();

  return (
    <header className="flex h-16 items-center border-b bg-white px-6">
      <Button variant="ghost" size="icon" className="md:hidden mr-4" onClick={onMenuClick}>
        <Menu className="h-6 w-6" />
      </Button>
      <div className="ml-auto flex items-center gap-4">
        <span className="text-sm font-medium">
          {user?.email || 'User'}
        </span>
        <div className="h-8 w-8 rounded-full bg-gray-200" />
      </div>
    </header>
  );
}
