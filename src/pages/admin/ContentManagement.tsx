import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Bell, FileText } from "lucide-react";
import { EmailTemplateManager } from "@/components/admin/content/EmailTemplateManager";
import { NotificationManager } from "@/components/admin/content/NotificationManager";
import { CMSManager } from "@/components/admin/content/CMSManager";

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState("email");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Content Management</h1>
            <p className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2">
              Manage email templates, notifications, and CMS content
            </p>
          </div>
        </div>

        <Card className="bg-card border-border">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
            <TabsList className="grid w-full grid-cols-3 bg-muted">
              <TabsTrigger value="email" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Mail className="h-4 w-4 mr-2" />
                Email Templates
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="cms" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FileText className="h-4 w-4 mr-2" />
                CMS
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="mt-6">
              <EmailTemplateManager />
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <NotificationManager />
            </TabsContent>

            <TabsContent value="cms" className="mt-6">
              <CMSManager />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ContentManagement;
