import { useState, useEffect } from 'react';
import { useInternshipStore } from '@/store/internshipStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

export default function Internships() {
  const { internships, fetchInternships, addInternship } = useInternshipStore();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    internshipType: '',
    duration: '',
    stipend: '',
    hasPPO: false,
  });
  
  useEffect(() => {
    fetchInternships();
  }, []);
  
  const handleSubmit = async () => {
    await addInternship(formData);
    setOpen(false);
    setFormData({
      companyName: '',
      internshipType: '',
      duration: '',
      stipend: '',
      hasPPO: false,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Internships</h1>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Internship</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Internship</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <Input
                placeholder="Company Name"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              />
              
              <Select
                value={formData.internshipType}
                onValueChange={(value) => setFormData({...formData, internshipType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Internship Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summer">Summer</SelectItem>
                  <SelectItem value="winter">Winter</SelectItem>
                  <SelectItem value="vocational">Vocational</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData({...formData, duration: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="<1month">Less than 1 month</SelectItem>
                  <SelectItem value="1-2months">1-2 months</SelectItem>
                  <SelectItem value="3-6months">3-6 months</SelectItem>
                  <SelectItem value=">6months">More than 6 months</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={formData.stipend}
                onValueChange={(value) => setFormData({...formData, stipend: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Stipend" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Stipend</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ppo"
                  checked={formData.hasPPO}
                  onCheckedChange={(checked) => setFormData({...formData, hasPPO: checked})}
                />
                <label htmlFor="ppo" className="text-sm font-medium">
                  Has PPO (Pre-Placement Offer)
                </label>
              </div>
              
              <Button onClick={handleSubmit} className="w-full">Submit</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {internships.map(internship => (
          <Card key={internship.id}>
            <CardHeader>
              <CardTitle>{internship.companyName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Type:</strong> {internship.internshipType}</p>
                <p><strong>Duration:</strong> {internship.duration}</p>
                <p><strong>Stipend:</strong> {internship.stipend}</p>
                {internship.hasPPO && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">PPO Received</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
