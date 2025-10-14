import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Eye, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface KYCVerification {
  id: string;
  user_id: string;
  document_type: string;
  verification_status: string;
  submitted_at: string;
  document_front_url?: string;
  document_back_url?: string;
  selfie_url?: string;
  rejection_reason?: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    username?: string;
  };
}

export function AdminKYCManagement() {
  const [verifications, setVerifications] = useState<KYCVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchKYCVerifications();
  }, []);

  const fetchKYCVerifications = async () => {
    try {
      const { data: kycData, error } = await supabase
        .from('kyc_verifications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      // Fetch profile data separately for each verification
      const verificationsWithProfiles = await Promise.all(
        (kycData || []).map(async (kyc) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name, username')
            .eq('id', kyc.user_id)
            .single();

          return {
            ...kyc,
            profiles: profile || undefined
          };
        })
      );

      setVerifications(verificationsWithProfiles);
    } catch (error) {
      console.error("Error fetching KYC verifications:", error);
      toast({
        title: "Error",
        description: "Failed to fetch KYC verifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateKYCStatus = async (id: string, status: 'verified' | 'rejected', reason?: string) => {
    setProcessingId(id);
    try {
      const updateData: any = {
        verification_status: status,
        updated_at: new Date().toISOString()
      };

      if (status === 'verified') {
        updateData.verified_at = new Date().toISOString();
      } else if (status === 'rejected' && reason) {
        updateData.rejected_at = new Date().toISOString();
        updateData.rejection_reason = reason;
      }

      const { error } = await supabase
        .from('kyc_verifications')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `KYC verification ${status}`,
      });

      await fetchKYCVerifications();
    } catch (error) {
      console.error("Error updating KYC status:", error);
      toast({
        title: "Error",
        description: "Failed to update KYC status",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      verified: { label: "Verified", variant: "default" as const },
      pending: { label: "Pending", variant: "secondary" as const },
      rejected: { label: "Rejected", variant: "destructive" as const }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const openDocument = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground text-lg sm:text-xl">KYC Verification Management</CardTitle>
        <CardDescription className="text-sm">Review and manage user identity verifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>User</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {verifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No KYC verifications found
                  </TableCell>
                </TableRow>
              ) : (
                verifications.map((verification) => (
                  <TableRow key={verification.id}>
                    <TableCell className="font-medium">
                      {verification.profiles?.first_name} {verification.profiles?.last_name}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        @{verification.profiles?.username || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>{verification.document_type}</TableCell>
                    <TableCell>{getStatusBadge(verification.verification_status)}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(verification.submitted_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {verification.document_front_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDocument(verification.document_front_url)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {verification.document_back_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDocument(verification.document_back_url)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {verification.selfie_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDocument(verification.selfie_url)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {verification.verification_status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => updateKYCStatus(verification.id, 'verified')}
                            disabled={processingId === verification.id}
                          >
                            {processingId === verification.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateKYCStatus(verification.id, 'rejected', 'Document verification failed')}
                            disabled={processingId === verification.id}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
