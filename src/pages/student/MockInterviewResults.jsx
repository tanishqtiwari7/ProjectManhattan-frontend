import { useEffect } from 'react';
import { useMockInterviewStore } from '@/store/mockInterviewStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function MockInterviewResults() {
  const { results, fetchResults } = useMockInterviewStore();
  
  useEffect(() => {
    fetchResults();
  }, []);
  
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Mock Interview Results</h1>
      
      {results.map(result => (
        <Card key={result.attemptId}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg">Attempt {result.attemptNumber}</span>
              <Badge variant={result.selected ? 'default' : 'destructive'}>
                {result.selected ? 'Selected' : 'Not Selected'}
              </Badge>
            </div>
            
            {!result.selected && (
              <p className="text-sm text-red-500 mb-4 font-medium">
                Rejected at: {result.rejectedAt} round
              </p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex justify-between p-3 bg-gray-50 rounded-md items-center">
                <span className="font-medium">GD Round</span>
                <Badge variant={result.rounds.gd ? 'outline' : 'destructive'} className={result.rounds.gd ? 'bg-green-50 text-green-700 border-green-200' : ''}>
                  {result.rounds.gd ? 'Cleared' : 'Not Cleared'}
                </Badge>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-md items-center">
                <span className="font-medium">HR Round</span>
                <Badge variant={result.rounds.hr ? 'outline' : 'destructive'} className={result.rounds.hr ? 'bg-green-50 text-green-700 border-green-200' : ''}>
                  {result.rounds.hr ? 'Cleared' : 'Not Cleared'}
                </Badge>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-md items-center">
                <span className="font-medium">Technical Round</span>
                <Badge variant={result.rounds.technical ? 'outline' : 'destructive'} className={result.rounds.technical ? 'bg-green-50 text-green-700 border-green-200' : ''}>
                  {result.rounds.technical ? 'Cleared' : 'Not Cleared'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
