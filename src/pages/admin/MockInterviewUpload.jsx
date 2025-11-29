import { useState } from 'react';
import { mockInterviewAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MockInterviewUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const handleUpload = async () => {
    setUploading(true);
    await mockInterviewAPI.uploadResults(file);
    setUploading(false);
    // Show success message
    alert('File uploaded successfully!');
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Upload Mock Interview Results</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Upload Excel File</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <p className="text-sm text-muted-foreground">
              Upload the Excel sheet containing mock interview results.
            </p>
          </div>
          
          <Button onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? 'Uploading...' : 'Upload Results'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
