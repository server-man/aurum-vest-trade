import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Wallet, 
  Bot, 
  Users, 
  Settings, 
  LogOut,
  Home,
  TrendingUp,
  Bell,
  Coins,
  MessageSquare,
  Shield,
  Gift
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const dashboardItems = [
  { title: 'Overview', url: '/dashboard', icon: BarChart3 },
  { title: 'Signals', url: '/dashboard/signals', icon: TrendingUp },
  { title: 'Wallet', url: '/dashboard/wallet', icon: Wallet },
  { title: 'Trading Bots', url: '/dashboard/bots', icon: Bot },
  { title: 'Referrals', url: '/dashboard/referrals', icon: Gift },
  { title: 'Profile', url: '/dashboard/profile', icon: Users },
  { title: 'Support', url: '/dashboard/support', icon: MessageSquare },
  { title: 'Admin Panel', url: '/admin', icon: Shield },
];

const quickActions = [
  { title: 'MEME Coins 🪙', url: '/dashboard/meme-coins', icon: Coins },
  { title: 'Airdrop', url: '/dashboard/airdrop', icon: Bell },
  { title: 'Investo', url: '/dashboard/investo', icon: TrendingUp },
];

export function DashboardSidebar() {
  const { state, setOpen } = useSidebar();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  // Solution 2: Close sidebar automatically on route change (for mobile)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setOpen(false);
    }
  }, [location.pathname, setOpen]);

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return currentPath === '/dashboard';
    }
    return currentPath.startsWith(path);
  };

  // Solution 1: Close sidebar on navigation link click (for mobile)
  const handleNavigation = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setOpen(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <Sidebar
      className="border-r border-border bg-card/50 backdrop-blur-sm"
      collapsible="icon"
    >
      <SidebarContent>
        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      onClick={handleNavigation}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      onClick={handleNavigation}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Section & Sign Out */}
        <div className="mt-auto p-4 border-t border-border">
          {!collapsed && (
            <div className="mb-3 text-sm text-muted-foreground">
              {user?.email}
            </div>
          )}
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="w-full justify-start text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
