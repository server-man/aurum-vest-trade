import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationsDropdown } from './NotificationsDropdown';
import { ProfileDropdown } from './ProfileDropdown';
import { SearchDialog } from './SearchDialog';
import { Logo } from '@/components/Logo';

interface DashboardHeaderProps {
  userProfile?: any;
}

export function DashboardHeader({ userProfile }: DashboardHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left section with sidebar trigger */}
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div className="flex items-center space-x-3">
            <Logo size="sm" showText={false} className="hidden md:flex" />
            <Badge variant="secondary" className="hidden lg:flex">
              Welcome back, {userProfile?.first_name || user?.email?.split('@')[0] || 'User'}
            </Badge>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <SearchDialog />
        </div>

        {/* Right section - Notifications and actions */}
        <div className="flex items-center space-x-3">
          {/* Search button for mobile */}
          <div className="md:hidden">
            <SearchDialog isMobile />
          </div>

          {/* Notifications */}
          <NotificationsDropdown />

          {/* User Profile */}
          <ProfileDropdown userProfile={userProfile} />
        </div>
      </div>
    </header>
  );
}