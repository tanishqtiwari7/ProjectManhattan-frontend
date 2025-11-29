import { useEffect } from 'react';
import { usePlacementStore } from '@/store/placementStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PlacementDrives() {
  const { eligibleCompanies, fetchEligibleCompanies } = usePlacementStore();
  
  useEffect(() => {
    fetchEligibleCompanies();
  }, []);
  
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Eligible Placement Drives</h1>
      
      {eligibleCompanies.map(company => (
        <Card key={company.companyId}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>{company.companyName}</CardTitle>
              <Badge variant="outline">{company.location}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-1">Job Description:</h4>
                <p className="text-sm text-muted-foreground">{company.jobDescription}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="font-semibold mb-2 text-sm">Eligibility Criteria:</h4>
                <ul className="text-sm list-disc list-inside space-y-1 text-gray-600">
                  <li>Min CGPA: {company.eligibilityCriteria.minCGPA}</li>
                  <li>Branches: {company.eligibilityCriteria.allowedBranches.join(', ')}</li>
                  <li>Max Backlogs: {company.eligibilityCriteria.maxBacklogs}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
