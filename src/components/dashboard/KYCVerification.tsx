import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldCheck, Upload, FileCheck, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface KYCVerificationProps {
  userId: string;
}

interface KYCData {
  id: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  document_type: string;
  document_front_url?: string;
  document_back_url?: string;
  selfie_url?: string;
  submitted_at: string;
  rejection_reason?: string;
}

const KYCVerification = ({ userId }: KYCVerificationProps) => {
  const [kycData, setKycData] = useState<KYCData | null>(null);
  const [documentType, setDocumentType] = useState('passport');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchKYCData();
    }
  }, [userId]);

  const fetchKYCData = async () => {
    try {
      const { data, error } = await supabase
        .from('kyc_verifications')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setKycData(data as KYCData | null);
    } catch (error: any) {
      console.error('Error fetching KYC data:', error);
      toast.error('Failed to load KYC data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (type: 'document_front' | 'document_back' | 'selfie', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${type}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(fileName);

      // Update or create KYC record
      const updateData = {
        user_id: userId,
        document_type: documentType,
        [`${type}_url`]: publicUrl,
      };

      if (kycData) {
        const { error } = await supabase
          .from('kyc_verifications')
          .update(updateData)
          .eq('id', kycData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('kyc_verifications')
          .insert(updateData);
        if (error) throw error;
      }

      await fetchKYCData();
      toast.success(`${type.replace('_', ' ')} uploaded successfully`);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitVerification = async () => {
    if (!documentType) {
      toast.error('Please select a document type');
      return;
    }

    if (!kycData?.document_front_url || !kycData?.selfie_url) {
      toast.error('Please upload required documents');
      return;
    }

    try {
      const { error } = await supabase
        .from('kyc_verifications')
        .update({
          verification_status: 'pending',
          submitted_at: new Date().toISOString()
        })
        .eq('id', kycData.id);

      if (error) throw error;
      
      await fetchKYCData();
      toast.success('Verification documents submitted for review');
    } catch (error: any) {
      console.error('Error submitting verification:', error);
      toast.error('Failed to submit verification');
    }
  };

  const getStatusBadge = () => {
    const status = kycData?.verification_status || 'not_started';
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500"><FileCheck className="h-3 w-3 mr-1" />Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  if (loading) {
    return <Card><CardContent className="p-6">Loading...</CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>KYC Verification</CardTitle>
            <CardDescription>
              Complete identity verification to unlock all features
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="document-type">Document Type</Label>
            <Select 
              value={documentType} 
              onValueChange={setDocumentType}
              disabled={kycData?.verification_status === 'pending' || kycData?.verification_status === 'verified'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="drivers_license">Driver's License</SelectItem>
                <SelectItem value="national_id">National ID</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {kycData?.rejection_reason && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="font-medium text-destructive mb-1">Rejection Reason:</p>
              <p className="text-sm text-muted-foreground">{kycData.rejection_reason}</p>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium">Document Front</p>
                <p className="text-sm text-muted-foreground">Upload front side of document</p>
                {kycData?.document_front_url && (
                  <p className="text-xs text-green-500 mt-1">✓ Uploaded</p>
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="doc-front"
                  className="hidden"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  onChange={(e) => handleFileUpload('document_front', e)}
                  disabled={uploading || kycData?.verification_status === 'verified'}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => document.getElementById('doc-front')?.click()}
                  disabled={uploading || kycData?.verification_status === 'verified'}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium">Document Back</p>
                <p className="text-sm text-muted-foreground">Upload back side of document (if applicable)</p>
                {kycData?.document_back_url && (
                  <p className="text-xs text-green-500 mt-1">✓ Uploaded</p>
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="doc-back"
                  className="hidden"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  onChange={(e) => handleFileUpload('document_back', e)}
                  disabled={uploading || kycData?.verification_status === 'verified'}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => document.getElementById('doc-back')?.click()}
                  disabled={uploading || kycData?.verification_status === 'verified'}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium">Selfie with Document</p>
                <p className="text-sm text-muted-foreground">Upload a selfie holding your document</p>
                {kycData?.selfie_url && (
                  <p className="text-xs text-green-500 mt-1">✓ Uploaded</p>
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="selfie"
                  className="hidden"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={(e) => handleFileUpload('selfie', e)}
                  disabled={uploading || kycData?.verification_status === 'verified'}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => document.getElementById('selfie')?.click()}
                  disabled={uploading || kycData?.verification_status === 'verified'}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </div>

          {kycData?.verification_status !== 'verified' && kycData?.verification_status !== 'pending' && (
            <Button 
              onClick={handleSubmitVerification} 
              className="w-full"
              disabled={!documentType || uploading || !kycData?.document_front_url || !kycData?.selfie_url}
            >
              Submit for Verification
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KYCVerification;
