# Frontend Development Prompt: College Placement Portal

## Project Overview
You are tasked with building a comprehensive frontend for a college placement portal. This is a React-based application using Vite, JavaScript, Zustand for state management, and Shadcn UI components.

## Tech Stack Requirements
- **Framework**: React with Vite
- **Language**: JavaScript (not TypeScript)
- **State Management**: Zustand
- **UI Components**: Shadcn UI (primary) with minimal Tailwind CSS for minor adjustments only
- **Styling**: NO separate CSS files - use Tailwind utility classes and Shadcn components only
- **Backend**: Spring Boot (Java) - currently not implemented, use dummy API URLs

## Critical Development Rules

### 1. Code Structure & Organization
- Follow proper React project structure
- Organize components in logical directories
- Create reusable components where applicable
- Keep component files focused and single-responsibility
- Structure: `src/components/`, `src/pages/`, `src/store/`, `src/services/`, `src/utils/`, `src/hooks/`

### 2. Component Development
- **MUST USE Shadcn components** for all UI elements (buttons, forms, dialogs, cards, tables, etc.)
- Only use Tailwind for minor spacing/alignment adjustments
- Never create custom CSS files
- Install Shadcn components as needed: `npx shadcn-ui@latest add <component-name>`

### 3. State Management with Zustand
All application state must be managed using Zustand stores. Create separate stores for:
- **authStore**: User authentication, role (student/admin), tokens
- **cafStore**: CAF form data, submission status, edit requests
- **notificationStore**: Admin notifications (new CAF, edit requests)
- **studentStore**: Student profile, eligible companies, mock interview results
- **internshipStore**: Internship data management
- **placementStore**: Placement drive listings

Example Zustand store structure:
```javascript
// src/store/cafStore.js
import { create } from 'zustand';

export const useCafStore = create((set) => ({
  cafData: null,
  cafStatus: 'not_submitted', // not_submitted, pending, approved, rejected
  isEditMode: false,
  editableFields: ['current_cgpa', 'domain_interest_primary', 'domain_interest_secondary', 'resume_file_url'],
  
  setCafData: (data) => set({ cafData: data }),
  setCafStatus: (status) => set({ cafStatus: status }),
  setEditMode: (mode) => set({ isEditMode: mode }),
  
  // Actions
  submitCaf: async (formData) => {
    // API call logic here
  },
  updateCaf: async (updates) => {
    // API call logic here
  },
}));
```

### 4. API Integration Structure

#### API Service Layer
Create a centralized API service file:

```javascript
// src/services/api.js
const BASE_URL = 'http://localhost:8080/api'; // Dummy URL for now

// API Response Validation Helper
const validateResponse = (response, expectedSchema) => {
  // Add validation logic using a schema validator like Zod or Yup
  return response;
};

// CAF APIs
export const cafAPI = {
  submit: async (cafData) => {
    const response = await fetch(`${BASE_URL}/caf/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cafData),
    });
    return validateResponse(await response.json(), cafSubmissionSchema);
  },
  
  update: async (cafId, updates) => {
    const response = await fetch(`${BASE_URL}/caf/${cafId}/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return validateResponse(await response.json(), cafUpdateSchema);
  },
  
  getStatus: async (studentId) => {
    const response = await fetch(`${BASE_URL}/caf/status/${studentId}`);
    return validateResponse(await response.json(), cafStatusSchema);
  },
};

// Admin APIs
export const adminAPI = {
  getNotifications: async () => {
    const response = await fetch(`${BASE_URL}/admin/notifications`);
    return validateResponse(await response.json(), notificationListSchema);
  },
  
  approveCaf: async (cafId) => {
    const response = await fetch(`${BASE_URL}/admin/caf/${cafId}/approve`, {
      method: 'POST',
    });
    return validateResponse(await response.json(), approvalSchema);
  },
  
  rejectCaf: async (cafId, reason) => {
    const response = await fetch(`${BASE_URL}/admin/caf/${cafId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    return validateResponse(await response.json(), rejectionSchema);
  },
  
  filterStudents: async (filters) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${BASE_URL}/admin/students?${queryParams}`);
    return validateResponse(await response.json(), studentListSchema);
  },
  
  downloadExcel: async (filters) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${BASE_URL}/admin/students/export?${queryParams}`);
    const blob = await response.blob();
    return blob;
  },
};

// Placement Drive APIs
export const placementAPI = {
  getEligibleCompanies: async (studentId) => {
    const response = await fetch(`${BASE_URL}/placement/eligible/${studentId}`);
    return validateResponse(await response.json(), companyListSchema);
  },
};

// Mock Interview APIs
export const mockInterviewAPI = {
  uploadResults: async (excelFile) => {
    const formData = new FormData();
    formData.append('file', excelFile);
    const response = await fetch(`${BASE_URL}/mock-interview/upload`, {
      method: 'POST',
      body: formData,
    });
    return validateResponse(await response.json(), uploadResultSchema);
  },
  
  getStudentResult: async (studentId) => {
    const response = await fetch(`${BASE_URL}/mock-interview/result/${studentId}`);
    return validateResponse(await response.json(), mockResultSchema);
  },
};

// Internship APIs
export const internshipAPI = {
  add: async (internshipData) => {
    const response = await fetch(`${BASE_URL}/internship/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(internshipData),
    });
    return validateResponse(await response.json(), internshipSchema);
  },
  
  getAll: async (studentId) => {
    const response = await fetch(`${BASE_URL}/internship/student/${studentId}`);
    return validateResponse(await response.json(), internshipListSchema);
  },
};
```

#### API Response Validation
Use **Zod** for runtime validation of API responses:

```javascript
// src/utils/schemas.js
import { z } from 'zod';

export const cafSubmissionSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    cafId: z.number(),
    status: z.enum(['pending', 'approved', 'rejected']),
    submittedAt: z.string(),
  }),
});

export const notificationListSchema = z.object({
  success: z.boolean(),
  data: z.array(z.object({
    id: z.number(),
    type: z.enum(['new_caf', 'edit_request']),
    studentId: z.number(),
    studentName: z.string(),
    timestamp: z.string(),
    details: z.any(),
  })),
});

export const companyListSchema = z.object({
  success: z.boolean(),
  data: z.array(z.object({
    companyId: z.number(),
    companyName: z.string(),
    location: z.string(),
    jobDescription: z.string(),
    eligibilityCriteria: z.object({
      minCGPA: z.number(),
      allowedBranches: z.array(z.string()),
      maxBacklogs: z.number(),
    }),
  })),
});

// Add more schemas as needed
```

## Application Structure & Workflow

### User Roles
1. **Student**: Can submit CAF, edit limited fields, view placements, add internships
2. **Admin (Faculty)**: Approve/reject CAF, manage notifications, filter students, upload mock results

### Key Workflows

#### 1. CAF Form Submission & Management

**Student Flow:**
- Student fills comprehensive CAF form (all sections A-K)
- Cannot submit another CAF if one is pending
- After approval, can only edit: CGPA, Internship, Certificates, Resume (PDF), Domain
- Edit requests go to admin for approval
- Special case: Admin can allow editing of other fields for specific students

**Admin Flow:**
- Receives notification for new CAF submission
- Reviews and approves/rejects
- Notification disappears after action
- Can reject any CAF at any time, even after approval

**Implementation:**
```javascript
// src/pages/student/CAFForm.jsx
import { useForm } from 'react-hook-form';
import { useCafStore } from '@/store/cafStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
// ... other Shadcn imports

export default function CAFForm() {
  const { cafStatus, submitCaf, updateCaf, isEditMode, editableFields } = useCafStore();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = async (data) => {
    if (isEditMode) {
      await updateCaf(data);
    } else {
      await submitCaf(data);
    }
  };
  
  const isFieldEditable = (fieldName) => {
    return !isEditMode || editableFields.includes(fieldName);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Section A - Personal Details */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Section A - Personal Details</h2>
        
        <Input
          label="Full Name"
          {...register('full_name', { required: true })}
          disabled={isEditMode && !isFieldEditable('full_name')}
        />
        
        <Input
          label="RGPV Enrollment Number"
          {...register('rgpv_enrollment_no', { required: true })}
          disabled={isEditMode && !isFieldEditable('rgpv_enrollment_no')}
        />
        
        {/* Add all other fields from Section A */}
      </section>
      
      {/* Repeat for Sections B-K */}
      
      <Button type="submit" disabled={cafStatus === 'pending'}>
        {isEditMode ? 'Submit Update Request' : 'Submit CAF'}
      </Button>
    </form>
  );
}
```

#### 2. Admin Notification System

**Two Section Notification Panel:**
- **Section 1**: New CAF applicants
- **Section 2**: Edit requests for CAF forms

**Implementation:**
```javascript
// src/pages/admin/Notifications.jsx
import { useEffect } from 'react';
import { useNotificationStore } from '@/store/notificationStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminNotifications() {
  const { notifications, fetchNotifications, approveRequest, rejectRequest } = useNotificationStore();
  
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  const newCAFs = notifications.filter(n => n.type === 'new_caf');
  const editRequests = notifications.filter(n => n.type === 'edit_request');
  
  return (
    <Tabs defaultValue="new-caf" className="w-full">
      <TabsList>
        <TabsTrigger value="new-caf">New CAF Applications ({newCAFs.length})</TabsTrigger>
        <TabsTrigger value="edit-requests">Edit Requests ({editRequests.length})</TabsTrigger>
      </TabsList>
      
      <TabsContent value="new-caf">
        {newCAFs.map(notification => (
          <Card key={notification.id} className="mb-4">
            <CardHeader>
              <CardTitle>{notification.studentName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Enrollment: {notification.details.enrollmentNo}</p>
              <div className="flex gap-2 mt-4">
                <Button onClick={() => approveRequest(notification.id, 'caf')}>
                  Approve
                </Button>
                <Button variant="destructive" onClick={() => rejectRequest(notification.id, 'caf')}>
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>
      
      <TabsContent value="edit-requests">
        {/* Similar structure for edit requests */}
      </TabsContent>
    </Tabs>
  );
}
```

#### 3. Student Dashboard Access Control

**Access Logic:**
- Dashboard sections locked until CAF is approved
- Show locked state with appropriate messaging
- After approval, enable: Internship, Placement Drive, Mock Interview sections

**Implementation:**
```javascript
// src/pages/student/Dashboard.jsx
import { useCafStore } from '@/store/cafStore';
import { Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function StudentDashboard() {
  const { cafStatus } = useCafStore();
  const isApproved = cafStatus === 'approved';
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <DashboardCard
        title="Internships"
        locked={!isApproved}
        href="/student/internships"
      />
      <DashboardCard
        title="Placement Drives"
        locked={!isApproved}
        href="/student/placements"
      />
      <DashboardCard
        title="Mock Interviews"
        locked={!isApproved}
        href="/student/mock-interviews"
      />
    </div>
  );
}

function DashboardCard({ title, locked, href }) {
  return (
    <Card className={`p-6 ${locked ? 'opacity-50' : ''}`}>
      {locked && <Lock className="mb-2" />}
      <h3 className="text-xl font-bold">{title}</h3>
      {locked && <p className="text-sm text-muted-foreground mt-2">
        Complete CAF approval to access
      </p>}
    </Card>
  );
}
```

#### 4. Placement Drive - Eligibility-Based Listing

**Features:**
- Show only companies student is eligible for
- Display: Company Name, Location, Job Description, Eligibility Criteria
- Filter and search capabilities

**Implementation:**
```javascript
// src/pages/student/PlacementDrives.jsx
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
            <CardTitle>{company.companyName}</CardTitle>
            <Badge>{company.location}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <h4 className="font-semibold">Job Description:</h4>
                <p className="text-sm text-muted-foreground">{company.jobDescription}</p>
              </div>
              <div>
                <h4 className="font-semibold">Eligibility Criteria:</h4>
                <ul className="text-sm list-disc list-inside">
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
```

#### 5. Mock Interview Results

**Admin Flow:**
- Upload Excel with GD, HR, Technical round results
- Backend processes and returns status for each student

**Student Flow:**
- View if selected or rejected
- If rejected, show at which round (GD/HR/Technical)
- Can appear multiple times

**Implementation:**
```javascript
// src/pages/admin/MockInterviewUpload.jsx
import { useState } from 'react';
import { mockInterviewAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function MockInterviewUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const handleUpload = async () => {
    setUploading(true);
    await mockInterviewAPI.uploadResults(file);
    setUploading(false);
    // Show success message
  };
  
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Upload Mock Interview Results</h1>
      <Input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <Button onClick={handleUpload} disabled={!file || uploading}>
        Upload
      </Button>
    </div>
  );
}

// src/pages/student/MockInterviewResults.jsx
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
      <h1 className="text-2xl font-bold">Mock Interview Results</h1>
      
      {results.map(result => (
        <Card key={result.attemptId}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <span>Attempt {result.attemptNumber}</span>
              <Badge variant={result.selected ? 'success' : 'destructive'}>
                {result.selected ? 'Selected' : 'Not Selected'}
              </Badge>
            </div>
            
            {!result.selected && (
              <p className="text-sm text-muted-foreground mt-2">
                Rejected at: {result.rejectedAt} round
              </p>
            )}
            
            <div className="mt-4 space-y-1">
              <div className="flex justify-between">
                <span>GD Round:</span>
                <Badge variant={result.rounds.gd ? 'success' : 'destructive'}>
                  {result.rounds.gd ? 'Cleared' : 'Not Cleared'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>HR Round:</span>
                <Badge variant={result.rounds.hr ? 'success' : 'destructive'}>
                  {result.rounds.hr ? 'Cleared' : 'Not Cleared'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Technical Round:</span>
                <Badge variant={result.rounds.technical ? 'success' : 'destructive'}>
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
```

#### 6. Admin Student Filtering & Excel Export

**Filters:**
- Enrollment Number
- Department
- CGPA
- Name
- 10th Percentage
- 12th Percentage
- Multiple filters can be applied simultaneously

**Implementation:**
```javascript
// src/pages/admin/StudentFilter.jsx
import { useState } from 'react';
import { adminAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function StudentFilter() {
  const [filters, setFilters] = useState({
    enrollmentNo: '',
    department: '',
    minCGPA: '',
    name: '',
    min10thPercent: '',
    min12thPercent: '',
  });
  const [students, setStudents] = useState([]);
  
  const handleFilter = async () => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    );
    const result = await adminAPI.filterStudents(cleanFilters);
    setStudents(result.data);
  };
  
  const handleExport = async () => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    );
    const blob = await adminAPI.downloadExcel(cleanFilters);
    
    // Download the file
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_${Date.now()}.xlsx`;
    a.click();
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Filter Students</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Enrollment Number"
          value={filters.enrollmentNo}
          onChange={(e) => setFilters({...filters, enrollmentNo: e.target.value})}
        />
        
        <Select
          value={filters.department}
          onValueChange={(value) => setFilters({...filters, department: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CSE">CSE</SelectItem>
            <SelectItem value="IT">IT</SelectItem>
            <SelectItem value="ECE">ECE</SelectItem>
            {/* Add more departments */}
          </SelectContent>
        </Select>
        
        <Input
          type="number"
          placeholder="Min CGPA"
          value={filters.minCGPA}
          onChange={(e) => setFilters({...filters, minCGPA: e.target.value})}
        />
        
        <Input
          placeholder="Student Name"
          value={filters.name}
          onChange={(e) => setFilters({...filters, name: e.target.value})}
        />
        
        <Input
          type="number"
          placeholder="Min 10th %"
          value={filters.min10thPercent}
          onChange={(e) => setFilters({...filters, min10thPercent: e.target.value})}
        />
        
        <Input
          type="number"
          placeholder="Min 12th %"
          value={filters.min12thPercent}
          onChange={(e) => setFilters({...filters, min12thPercent: e.target.value})}
        />
      </div>
      
      <div className="flex gap-2">
        <Button onClick={handleFilter}>Apply Filters</Button>
        <Button onClick={handleExport} variant="outline">Export to Excel</Button>
      </div>
      
      {students.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Enrollment No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>CGPA</TableHead>
              <TableHead>10th %</TableHead>
              <TableHead>12th %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map(student => (
              <TableRow key={student.id}>
                <TableCell>{student.enrollmentNo}</TableCell>
                <TableCell>{student.fullName}</TableCell>
                <TableCell>{student.branch}</TableCell>
                <TableCell>{student.currentCGPA}</TableCell>
                <TableCell>{student.tenthPercent}</TableCell>
                <TableCell>{student.twelfthPercent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
```

#### 7. Internship Management

**Features:**
- Students can add multiple internships
- Can indicate PPO (Pre-Placement Offer) status
- Edit requests sent to admin
- Structured with: Company, Type, Duration, Stipend

**Implementation:**
```javascript
// src/pages/student/Internships.jsx
import { useState, useEffect } from 'react';
import { useInternshipStore } from '@/store/internshipStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

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
                  <Badge variant="success">PPO Received</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

## Complete CAF Form Field Mapping

### Section A – Personal Details
```javascript
const sectionA = {
  full_name: { type: 'text', required: true, db: 'students.full_name' },
  rgpv_enrollment_no: { type: 'text', required: true, db: 'students.rgpv_enrollment_no' },
  enrollment_no: { type: 'text', required: true, db: 'students.enrollment_no' },
  gender: { type: 'select', options: ['Male', 'Female', 'Other', 'Prefer not to say'], db: 'students.gender' },
  dob: { type: 'date', required: true, db: 'students.dob' },
  mobile: { type: 'tel', required: true, db: 'students.mobile' },
  alternate_mobile: { type: 'tel', db: 'students.alternate_mobile' },
  email_personal: { type: 'email', required: true, db: 'students.email_personal' },
  course: { type: 'select', options: ['B.E.', 'B.Tech', 'BCA', 'BBA', 'MBA', 'MCA'], db: 'students.course' },
  branch: { type: 'select', options: ['CSE', 'IT', 'CSIT', 'AIML', 'DS', 'ECE', 'ME', 'CIVIL'], db: 'students.branch' },
  batch_year: { type: 'select', options: ['2025', '2026', '2027', '2028'], db: 'students.batch_year' },
  current_semester: { type: 'select', options: [1, 2, 3, 4, 5, 6, 7, 8], db: 'students.current_semester' },
  section: { type: 'select', options: ['A', 'B', 'C', 'D'], db: 'students.section' },
};
```

### Section B – Address Details
```javascript
const sectionB = {
  current_address: { type: 'textarea', required: true, db: 'students.current_address' },
  permanent_address: { type: 'textarea', required: true, db: 'students.permanent_address' },
  city: { type: 'text', required: true, db: 'students.city' },
  state: { type: 'select', options: ['...Indian states...'], db: 'students.state' },
};
```

### Section C – Academic Record
```javascript
const sectionC = {
  // Class 10th
  '10th_board': { type: 'select', options: ['CBSE', 'ICSE', 'State Board', 'Other'], db: 'caf_applications.10th_board' },
  '10th_percentage': { type: 'number', min: 0, max: 100, step: 0.01, db: 'caf_applications.10th_percentage' },
  '10th_year_of_passing': { type: 'select', options: ['2018', '2019', '2020', '2021'], db: 'caf_applications.10th_year_of_passing' },
  
  // Class 12th
  '12th_board': { type: 'select', options: ['CBSE', 'ICSE', 'State Board', 'Diploma', 'Not Applicable'], db: 'caf_applications.12th_board' },
  '12th_percentage': { type: 'number', min: 0, max: 100, step: 0.01, db: 'caf_applications.12th_percentage' },
  '12th_year_of_passing': { type: 'select', db: 'caf_applications.12th_year_of_passing' },
  
  // Diploma
  diploma_branch: { type: 'select', options: ['...diploma branches...', 'Not Applicable'], db: 'caf_applications.diploma_branch' },
  diploma_percentage: { type: 'number', min: 0, max: 100, step: 0.01, db: 'caf_applications.diploma_percentage' },
  
  // Graduation
  current_cgpa: { type: 'number', min: 0, max: 10, step: 0.01, editable: true, db: 'caf_applications.current_cgpa' },
  backlogs_active: { type: 'number', min: 0, max: 20, db: 'caf_applications.backlogs_active' },
  backlogs_history: { type: 'number', min: 0, max: 20, db: 'caf_applications.backlogs_history' },
};
```

### Section D – Career Preference
```javascript
const sectionD = {
  placement_preference: { type: 'select', options: ['Placement', 'Higher Studies', 'Family Business', 'Entrepreneurship', 'Other'], db: 'caf_applications.placement_preference' },
  open_to_relocation: { type: 'select', options: ['Yes', 'No', 'Depends'], db: 'caf_applications.open_to_relocation' },
  preferred_locations: { type: 'multi-select', options: ['Metro cities', 'Tier-2 cities', 'Tier-3 cities'], db: 'caf_applications.preferred_locations' },
};
```

### Section E – Technical Domains
```javascript
const sectionE = {
  domain_interest_primary: { 
    type: 'select', 
    editable: true,
    options: [
      'Java Full Stack',
      'Python Full Stack',
      'MERN / MEAN',
      'Data Analytics',
      'Data Science / ML',
      'DevOps / Cloud',
      'Cyber Security',
      'Testing / QA',
      'Embedded / VLSI',
      'Non-IT'
    ],
    db: 'caf_applications.domain_interest_primary' 
  },
  domain_interest_secondary: { 
    type: 'select', 
    editable: true,
    options: ['None', '...same as primary...'], 
    db: 'caf_applications.domain_interest_secondary' 
  },
};
```

### Section F – Certifications
```javascript
const sectionF = {
  has_certifications: { type: 'select', options: ['Yes', 'No'] },
  certifications: { 
    type: 'repeatable',
    editable: true,
    fields: {
      title: { type: 'text' },
      issuer: { type: 'text' },
      issue_date: { type: 'month-year' },
      certificate_url: { type: 'url' },
    },
    db: 'certifications table'
  },
};
```

### Section G – Internship Summary
```javascript
const sectionG = {
  has_internships: { type: 'select', options: ['Yes', 'No'] },
  internships: { 
    type: 'repeatable',
    editable: true,
    fields: {
      company_name: { type: 'text' },
      internship_type: { type: 'select', options: ['Summer', 'Winter', 'Vocational', 'Project', 'Other'] },
      duration: { type: 'select', options: ['<1 month', '1-2 months', '3-6 months', '>6 months'] },
      stipend: { type: 'select', options: ['Stipend', 'Unpaid'] },
    },
    db: 'internships table'
  },
};
```

### Section H – Other Information
```javascript
const sectionH = {
  study_gap: { type: 'select', options: ['No Gap', 'Up to 1 year', '1-2 years', 'More than 2 years'], db: 'caf_applications.study_gap' },
  medical_note: { type: 'textarea', optional: true, db: 'caf_applications.medical_note' },
};
```

### Section I – Resume & Documents
```javascript
const sectionI = {
  resume_file_url: { type: 'file', accept: '.pdf', editable: true, db: 'caf_applications.resume_file_url' },
  academic_documents: { type: 'file-multiple', accept: '.pdf,.jpg,.png', optional: true, db: 'student_documents table' },
};
```

### Section J – Evaluator Mapping
```javascript
const sectionJ = {
  evaluator: { type: 'select', options: ['...list of faculty...'], db: 'caf_applications.evaluator' },
};
```

### Section K – Consent & Declaration
```javascript
const sectionK = {
  declaration: { 
    type: 'checkbox', 
    required: true,
    label: 'I hereby declare that the information provided above is true and correct to the best of my knowledge. I understand that any false information may lead to cancellation of my candidature in campus placements.',
  },
};
```

## File Structure Requirements

```
src/
├── components/
│   ├── ui/              # Shadcn components
│   │   ├── button.jsx
│   │   ├── input.jsx
│   │   ├── select.jsx
│   │   ├── card.jsx
│   │   ├── dialog.jsx
│   │   ├── table.jsx
│   │   ├── tabs.jsx
│   │   ├── badge.jsx
│   │   ├── checkbox.jsx
│   │   └── ...
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   ├── forms/
│   │   ├── CAFFormSectionA.jsx
│   │   ├── CAFFormSectionB.jsx
│   │   ├── ...
│   │   └── CAFFormSectionK.jsx
│   └── shared/
│       ├── LoadingSpinner.jsx
│       ├── ErrorBoundary.jsx
│       └── ProtectedRoute.jsx
│
├── pages/
│   ├── student/
│   │   ├── Dashboard.jsx
│   │   ├── CAFForm.jsx
│   │   ├── Internships.jsx
│   │   ├── PlacementDrives.jsx
│   │   └── MockInterviewResults.jsx
│   ├── admin/
│   │   ├── Dashboard.jsx
│   │   ├── Notifications.jsx
│   │   ├── StudentFilter.jsx
│   │   └── MockInterviewUpload.jsx
│   └── auth/
│       ├── Login.jsx
│       └── Register.jsx
│
├── store/
│   ├── authStore.js
│   ├── cafStore.js
│   ├── notificationStore.js
│   ├── studentStore.js
│   ├── internshipStore.js
│   ├── placementStore.js
│   └── mockInterviewStore.js
│
├── services/
│   └── api.js
│
├── utils/
│   ├── schemas.js       # Zod validation schemas
│   ├── constants.js
│   └── helpers.js
│
├── hooks/
│   ├── useAuth.js
│   └── useDebounce.js
│
├── App.jsx
├── main.jsx
└── globals.css
```

## Routing Structure
```javascript
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Student Routes */}
        <Route path="/student" element={<ProtectedRoute role="student" />}>
          <Route index element={<StudentDashboard />} />
          <Route path="caf" element={<CAFForm />} />
          <Route path="internships" element={<Internships />} />
          <Route path="placements" element={<PlacementDrives />} />
          <Route path="mock-interviews" element={<MockInterviewResults />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="students" element={<StudentFilter />} />
          <Route path="mock-upload" element={<MockInterviewUpload />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

## Additional Requirements

### 1. Digital Signature for Admin Actions
Every admin action should be auto-signed and logged:
```javascript
const logAdminAction = async (action, targetId, details) => {
  await fetch(`${BASE_URL}/admin/log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action,
      targetId,
      facultyId: getCurrentFacultyId(),
      timestamp: new Date().toISOString(),
      details,
    }),
  });
};
```

### 2. Editable Fields After Approval
Only these fields are editable after CAF approval:
- CGPA (`current_cgpa`)
- Internship (entire internship section)
- Certificates (entire certificates section)
- Resume (`resume_file_url`)
- Domain (`domain_interest_primary`, `domain_interest_secondary`)

### 3. Form Validation
Use react-hook-form with Zod for robust validation:
```javascript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const cafSchema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  rgpv_enrollment_no: z.string().regex(/^[0-9]{12}$/, 'Invalid enrollment number'),
  email_personal: z.string().email('Invalid email'),
  current_cgpa: z.number().min(0).max(10),
  // ... add all fields
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(cafSchema),
});
```

### 4. Responsive Design
All components must be mobile-responsive using Tailwind's responsive utilities:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

### 5. Loading & Error States
Always handle loading and error states:
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

try {
  setLoading(true);
  const result = await api.call();
} catch (err) {
  setError(err.message);
} finally {
  setLoading(false);
}
```

## Dependencies to Install
```bash
npm install zustand
npm install zod
npm install react-hook-form @hookform/resolvers
npm install react-router-dom
npm install lucide-react
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input select card dialog table tabs badge checkbox
```

## Summary Checklist
- ✅ Use Shadcn components for ALL UI elements
- ✅ Use Zustand for state management
- ✅ Implement proper API service layer with validation
- ✅ Follow the exact workflow for CAF submission and approval
- ✅ Implement two-section notification system for admin
- ✅ Lock student dashboard until CAF approval
- ✅ Only show eligible companies to students
- ✅ Implement mock interview result display with round details
- ✅ Create robust filtering system with Excel export
- ✅ Handle all editable fields correctly after approval
- ✅ Use proper file structure with organized directories
- ✅ NO separate CSS files - only Tailwind utilities and Shadcn
- ✅ Implement digital signature logging for admin actions
- ✅ Use dummy API URLs until backend is ready
- ✅ Validate all API responses using Zod schemas

---

## Final Instructions
Build this application systematically, section by section. Start with authentication and basic layout, then implement the CAF form, followed by admin notifications, student dashboard sections, and finally the filtering system. Ensure each component is properly structured, uses Shadcn components, and integrates with Zustand stores. Test responsiveness and error handling at each step.
