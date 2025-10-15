import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Send, Users } from "lucide-react";
import { toast } from "sonner";
import { notificationSchema, sanitizeText } from "@/lib/validation";
import { handleError, handleSupabaseError } from "@/lib/errorHandler";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function NotificationManager() {
  const [loading, setLoading] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info" as const,
    link: "",
    send_push: false,
    send_to_all: false,
    user_email: "",
  });

  useEffect(() => {
    fetchUserCount();
  }, []);

  const fetchUserCount = async () => {
    try {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      setUserCount(count || 0);
    } catch (error) {
      handleSupabaseError(error, "fetchUserCount");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sanitize inputs
      const sanitizedData = {
        title: sanitizeText(formData.title),
        message: sanitizeText(formData.message),
        type: formData.type,
        link: formData.link ? sanitizeText(formData.link) : "",
        send_push: formData.send_push,
      };

      // Validate
      const validated = notificationSchema.parse(sanitizedData);

      if (formData.send_to_all) {
        // Send to all users
        const { data: users, error: usersError } = await supabase
          .from("profiles")
          .select("id");

        if (usersError) throw usersError;

        // Create notifications for all users
        const notifications = users.map((user) => ({
          user_id: user.id,
          ...validated,
        }));

        const { error } = await supabase
          .from("notifications")
          .insert(notifications);

        if (error) throw error;
        toast.success(`Notification sent to ${users.length} users`);
      } else if (formData.user_email) {
        // Send to specific user
        const { data: user, error: userError } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", formData.user_email)
          .single();

        if (userError) throw new Error("User not found");

        const { error } = await supabase
          .from("notifications")
          .insert([
            {
              user_id: user.id,
              ...validated,
            },
          ]);

        if (error) throw error;
        toast.success("Notification sent successfully");
      } else {
        throw new Error("Please select recipients");
      }

      // Reset form
      setFormData({
        title: "",
        message: "",
        type: "info",
        link: "",
        send_push: false,
        send_to_all: false,
        user_email: "",
      });
    } catch (error) {
      handleError(error, "handleSubmit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Send Notification</CardTitle>
          <CardDescription>
            Send notifications to users via in-app and optional push notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                maxLength={100}
                placeholder="Notification title"
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                maxLength={1000}
                rows={4}
                placeholder="Notification message"
              />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="signal">Signal</SelectItem>
                  <SelectItem value="trade">Trade</SelectItem>
                  <SelectItem value="kyc">KYC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="link">Link (optional)</Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://aurumvest.xyz/dashboard"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="send_push"
                checked={formData.send_push}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, send_push: checked })
                }
              />
              <Label htmlFor="send_push">Send push notification</Label>
            </div>

            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold">Recipients</h3>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="send_to_all"
                  checked={formData.send_to_all}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, send_to_all: checked, user_email: "" })
                  }
                />
                <Label htmlFor="send_to_all" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Send to all users ({userCount})
                </Label>
              </div>

              {!formData.send_to_all && (
                <div>
                  <Label htmlFor="user_email">Or send to specific user email</Label>
                  <Input
                    id="user_email"
                    type="email"
                    value={formData.user_email}
                    onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                    placeholder="user@example.com"
                  />
                </div>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              {loading ? "Sending..." : "Send Notification"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
