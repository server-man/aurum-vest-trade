import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Github, Upload, FileText, Settings2, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const GitHubIntegration = () => {
  const [loading, setLoading] = useState(false);
  const [workflowContent, setWorkflowContent] = useState("");
  const [readmeContent, setReadmeContent] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<"ci" | "security" | "readme">("ci");

  const githubToken = sessionStorage.getItem('github_token');
  const isConnected = !!githubToken;

  const REPO_OWNER = "server-man";
  const REPO_NAME = "aurum-vest-trade";

  const getFilePath = () => {
    switch (selectedFile) {
      case "ci":
        return ".github/workflows/ci.yml";
      case "security":
        return ".github/workflows/fix-vite-vulnerability.yml";
      case "readme":
        return "README.md";
      default:
        return "";
    }
  };

  const handleFetchFile = async () => {
    if (!githubToken) {
      toast.error("GitHub token not found. Please verify again.");
      return;
    }

    setLoading(true);
    try {
      const filePath = getFilePath();
      const response = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
        {
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      const data = await response.json();
      const content = atob(data.content);
      
      if (selectedFile === "readme") {
        setReadmeContent(content);
      } else {
        setWorkflowContent(content);
      }

      toast.success(`File loaded successfully`);
    } catch (error: any) {
      console.error("Error fetching file:", error);
      toast.error(error.message || "Failed to fetch file from GitHub");
    } finally {
      setLoading(false);
    }
  };

  const handlePushToGitHub = async () => {
    if (!githubToken) {
      toast.error("GitHub token not found. Please verify again.");
      return;
    }

    if (!commitMessage) {
      toast.error("Please enter a commit message");
      return;
    }

    const content = selectedFile === "readme" ? readmeContent : workflowContent;
    if (!content) {
      toast.error("No content to push");
      return;
    }

    setLoading(true);
    try {
      const filePath = getFilePath();
      
      // First, get the current file SHA
      const getResponse = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
        {
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );

      let sha = null;
      if (getResponse.ok) {
        const data = await getResponse.json();
        sha = data.sha;
      }

      // Push the update
      const pushResponse = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: commitMessage,
            content: btoa(content),
            sha: sha,
            branch: 'main'
          }),
        }
      );

      if (!pushResponse.ok) {
        const errorData = await pushResponse.json();
        throw new Error(errorData.message || `Failed to push: ${pushResponse.statusText}`);
      }

      toast.success("Successfully pushed to GitHub");
      setCommitMessage("");
    } catch (error: any) {
      console.error("Error pushing to GitHub:", error);
      toast.error(error.message || "Failed to push to GitHub");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Github className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">GitHub Integration</CardTitle>
              <CardDescription>
                Manage repository files directly from admin panel
              </CardDescription>
            </div>
          </div>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? (
              <><Check className="h-3 w-3 mr-1" /> Connected</>
            ) : (
              <><AlertCircle className="h-3 w-3 mr-1" /> Not Connected</>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              GitHub token not found. Please verify with GitHub OAuth to enable this feature.
            </p>
          </div>
        ) : (
          <>
            <Tabs value={selectedFile} onValueChange={(v) => setSelectedFile(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ci">CI Workflow</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="readme">README</TabsTrigger>
              </TabsList>

              <TabsContent value="ci" className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 inline mr-1" />
                    .github/workflows/ci.yml
                  </p>
                  <Button onClick={handleFetchFile} disabled={loading} variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Load from GitHub
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 inline mr-1" />
                    .github/workflows/fix-vite-vulnerability.yml
                  </p>
                  <Button onClick={handleFetchFile} disabled={loading} variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Load from GitHub
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="readme" className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 inline mr-1" />
                    README.md
                  </p>
                  <Button onClick={handleFetchFile} disabled={loading} variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Load from GitHub
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <Label htmlFor="file-content">File Content</Label>
              <Textarea
                id="file-content"
                value={selectedFile === "readme" ? readmeContent : workflowContent}
                onChange={(e) => 
                  selectedFile === "readme" 
                    ? setReadmeContent(e.target.value)
                    : setWorkflowContent(e.target.value)
                }
                placeholder="Load a file or paste content here..."
                className="font-mono text-xs min-h-[300px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commit-message">Commit Message</Label>
              <Input
                id="commit-message"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Update workflow configuration"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handlePushToGitHub}
                disabled={loading || !commitMessage}
                className="flex-1"
              >
                {loading ? "Pushing..." : "Push to GitHub"}
              </Button>
              <Button
                onClick={handleFetchFile}
                disabled={loading}
                variant="outline"
              >
                Refresh
              </Button>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Settings2 className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Repository Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Connected to <span className="font-mono text-primary">{REPO_OWNER}/{REPO_NAME}</span>.
                    Changes will be pushed directly to the main branch.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
