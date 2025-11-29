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
      
      {students.length > 0 ? (
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
      ) : (
        <p className="text-gray-500">No students found. Apply filters to search.</p>
      )}
    </div>
  );
}
