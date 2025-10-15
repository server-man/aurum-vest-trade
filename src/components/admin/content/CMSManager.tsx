import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cmsContentSchema, sanitizeText } from "@/lib/validation";
import { handleError, handleSupabaseError } from "@/lib/errorHandler";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface CmsContent {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_description: string;
  meta_keywords: string[];
  is_published: boolean;
  publish_date: string;
  category: string;
  created_at: string;
}

export function CMSManager() {
  const [contents, setContents] = useState<CmsContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<CmsContent | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    meta_description: "",
    meta_keywords: "",
    is_published: false,
    category: "",
  });

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from("cms_content")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      handleSupabaseError(error, "fetchContents");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Sanitize inputs
      const sanitizedData = {
        title: sanitizeText(formData.title),
        slug: sanitizeText(formData.slug.toLowerCase().replace(/\s+/g, "-")),
        content: formData.content.trim(),
        meta_description: sanitizeText(formData.meta_description),
        meta_keywords: formData.meta_keywords
          ? formData.meta_keywords.split(",").map((k) => sanitizeText(k.trim()))
          : [],
        is_published: formData.is_published,
        publish_date: formData.is_published ? new Date().toISOString() : null,
        category: sanitizeText(formData.category),
      };

      // Validate
      const validated = cmsContentSchema.parse(sanitizedData);

      if (editingContent) {
        const { error } = await supabase
          .from("cms_content")
          .update({
            title: validated.title,
            slug: validated.slug,
            content: validated.content,
            meta_description: validated.meta_description || null,
            meta_keywords: validated.meta_keywords || [],
            is_published: validated.is_published,
            publish_date: validated.publish_date || null,
            category: validated.category || null,
          })
          .eq("id", editingContent.id);

        if (error) throw error;
        toast.success("Content updated successfully");
      } else {
        const { error } = await supabase
          .from("cms_content")
          .insert([{
            title: validated.title,
            slug: validated.slug,
            content: validated.content,
            meta_description: validated.meta_description || null,
            meta_keywords: validated.meta_keywords || [],
            is_published: validated.is_published,
            publish_date: validated.publish_date || null,
            category: validated.category || null,
          }]);

        if (error) throw error;
        toast.success("Content created successfully");
      }

      setDialogOpen(false);
      resetForm();
      fetchContents();
    } catch (error) {
      handleError(error, "handleSubmit");
    }
  };

  const handleEdit = (content: CmsContent) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      slug: content.slug,
      content: content.content,
      meta_description: content.meta_description || "",
      meta_keywords: content.meta_keywords?.join(", ") || "",
      is_published: content.is_published,
      category: content.category || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    try {
      const { error } = await supabase
        .from("cms_content")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Content deleted successfully");
      fetchContents();
    } catch (error) {
      handleSupabaseError(error, "handleDelete");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      meta_description: "",
      meta_keywords: "",
      is_published: false,
      category: "",
    });
    setEditingContent(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">CMS Content</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingContent ? "Edit Content" : "Create Content"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  maxLength={200}
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug (URL-friendly)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  maxLength={100}
                  pattern="[a-z0-9-]+"
                  placeholder="my-content-slug"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="blog, guides, news, etc."
                />
              </div>
              <div>
                <Label htmlFor="content">Content (Markdown supported)</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
              <div>
                <Label htmlFor="meta_description">Meta Description (SEO)</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  maxLength={160}
                  rows={2}
                  placeholder="Brief description for search engines"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.meta_description.length}/160 characters
                </p>
              </div>
              <div>
                <Label htmlFor="meta_keywords">Meta Keywords (comma-separated)</Label>
                <Input
                  id="meta_keywords"
                  value={formData.meta_keywords}
                  onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                  placeholder="trading, crypto, bitcoin"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_published: checked })
                  }
                />
                <Label htmlFor="is_published">Publish immediately</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingContent ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : contents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No content found</TableCell>
              </TableRow>
            ) : (
              contents.map((content) => (
                <TableRow key={content.id}>
                  <TableCell className="font-medium">{content.title}</TableCell>
                  <TableCell className="font-mono text-sm">{content.slug}</TableCell>
                  <TableCell>{content.category || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={content.is_published ? "default" : "secondary"}>
                      {content.is_published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(`https://aurumvest.xyz/content/${content.slug}`, "_blank")}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(content)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(content.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
