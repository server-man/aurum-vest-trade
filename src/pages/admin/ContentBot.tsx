import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Image as ImageIcon, AlertCircle, Download, Copy, Search, ZoomIn, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ContentItem {
  id: string;
  prompt: string;
  media_url: string;
  storage_path: string;
  created_at: string;
  metadata: any;
}

const ContentBot = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [fetchingContents, setFetchingContents] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<ContentItem | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    checkAdminAccess();
    fetchContents();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (error || !data) {
      toast.error("Admin access required");
      navigate("/dashboard");
    }
  };

  const fetchContents = async () => {
    try {
      setFetchingContents(true);
      const { data, error } = await supabase
        .from('contents_bot')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error("Error fetching contents:", error);
      toast.error("Failed to load content");
    } finally {
      setFetchingContents(false);
    }
  };

  const handleGenerate = async (isRetry = false) => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setLoading(true);
    const currentRetry = isRetry ? retryCount : 0;
    
    try {
      const { data, error } = await supabase.functions.invoke('content-bot-generate', {
        body: { prompt, mediaType: 'image' }
      });

      if (error) {
        // Check for rate limiting
        if (error.message?.includes('rate limit') || error.message?.includes('429')) {
          toast.error("Rate limit reached. Please wait a moment and try again.", {
            action: {
              label: "Retry",
              onClick: () => {
                setRetryCount(currentRetry + 1);
                setTimeout(() => handleGenerate(true), 3000);
              }
            }
          });
          return;
        }
        throw error;
      }

      if (data.success) {
        toast.success("Image generated successfully! 🎨");
        setPrompt("");
        setRetryCount(0);
        fetchContents();
      } else {
        throw new Error(data.error || "Failed to generate image");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate image";
      
      // Offer retry for network errors
      if (currentRetry < 2 && (errorMessage.includes('network') || errorMessage.includes('timeout'))) {
        toast.error(`${errorMessage}. Retrying...`);
        setRetryCount(currentRetry + 1);
        setTimeout(() => handleGenerate(true), 2000);
      } else {
        toast.error(errorMessage, {
          description: currentRetry > 0 ? `Failed after ${currentRetry + 1} attempts` : undefined
        });
        setRetryCount(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (content: ContentItem) => {
    try {
      const response = await fetch(content.media_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aurum-vest-${content.id.slice(0, 8)}.webp`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download image");
    }
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast.success("Prompt copied to clipboard");
  };

  const filteredContents = contents.filter(content =>
    content.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to delete all generated content? This action cannot be undone.")) {
      return;
    }

    setDeleting(true);
    try {
      // Delete from storage
      const storagePaths = contents.map(c => c.storage_path);
      if (storagePaths.length > 0) {
        const { error: storageError } = await supabase
          .storage
          .from('content-bot-media')
          .remove(storagePaths);

        if (storageError) {
          console.error("Storage deletion error:", storageError);
        }
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('contents_bot')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (dbError) throw dbError;

      toast.success("All content deleted successfully");
      setContents([]);
    } catch (error) {
      console.error("Error deleting content:", error);
      toast.error("Failed to delete all content");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteSingle = async (content: ContentItem) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase
        .storage
        .from('content-bot-media')
        .remove([content.storage_path]);

      if (storageError) {
        console.error("Storage deletion error:", storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('contents_bot')
        .delete()
        .eq('id', content.id);

      if (dbError) throw dbError;

      toast.success("Content deleted");
      setContents(contents.filter(c => c.id !== content.id));
    } catch (error) {
      console.error("Error deleting content:", error);
      toast.error("Failed to delete content");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Content Bot</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
              AI-powered media generation for Aurum Vest
            </p>
          </div>
          {contents.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleClearAll}
              disabled={deleting}
              className="w-full sm:w-auto"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </>
              )}
            </Button>
          )}
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-sm">
              This AI assistant generates media content tailored specifically for Aurum Vest, 
              focusing on cryptocurrency trading, automation, and profitability themes.
            </span>
            <Badge variant="secondary" className="whitespace-nowrap">
              ~$0.013 per image
            </Badge>
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Generate Image
            </CardTitle>
            <CardDescription>
              Describe what you want to create. The AI will generate professional imagery 
              for Aurum Vest with cryptocurrency trading themes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., 'A modern dashboard showing profitable crypto trades with rising charts and green indicators' or 'A hero image showcasing automated trading success'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => handleGenerate(false)}
                disabled={loading || !prompt.trim()}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating{retryCount > 0 ? ` (Retry ${retryCount})` : ''}...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
              {loading && (
                <Button
                  variant="outline"
                  disabled
                  className="w-24"
                >
                  <RefreshCw className="w-4 h-4 animate-spin" />
                </Button>
              )}
            </div>
            {loading && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Generated Content</h2>
            {contents.length > 0 && (
              <Badge variant="outline">{contents.length} image{contents.length !== 1 ? 's' : ''}</Badge>
            )}
          </div>

          {contents.length > 0 && (
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by prompt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}
          
          {fetchingContents ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="pt-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredContents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                {contents.length === 0 
                  ? "No content generated yet. Create your first image above!" 
                  : "No images match your search."}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredContents.map((content) => (
                <Card key={content.id} className="overflow-hidden group">
                  <div className="aspect-video relative">
                    <img
                      src={content.media_url}
                      alt={content.prompt}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setSelectedImage(content)}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedImage(content)}
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDownload(content)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteSingle(content)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                        {content.prompt}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleCopyPrompt(content.prompt)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(content.created_at).toLocaleDateString()} • {content.metadata?.dimensions?.width}x{content.metadata?.dimensions?.height}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span className="line-clamp-2 text-sm sm:text-base">{selectedImage?.prompt}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => selectedImage && handleCopyPrompt(selectedImage.prompt)}
                  >
                    <Copy className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Copy Prompt</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => selectedImage && handleDownload(selectedImage)}
                  >
                    <Download className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            {selectedImage && (
              <div className="space-y-4">
                <img
                  src={selectedImage.media_url}
                  alt={selectedImage.prompt}
                  className="w-full rounded-lg"
                />
                <div className="flex flex-col sm:flex-row sm:gap-4 gap-1 text-xs sm:text-sm text-muted-foreground">
                  <span>Created: {new Date(selectedImage.created_at).toLocaleString()}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Size: {selectedImage.metadata?.dimensions?.width}x{selectedImage.metadata?.dimensions?.height}</span>
                  {selectedImage.metadata?.seed && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span>Seed: {selectedImage.metadata.seed}</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ContentBot;