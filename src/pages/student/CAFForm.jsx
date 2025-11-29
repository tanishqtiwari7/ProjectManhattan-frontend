import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useCafStore } from '@/store/cafStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';


// Helper for Textarea since it wasn't in the list, using standard HTML with classes
const Textarea = ({ className, ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

export default function CAFForm() {
  const { cafStatus, submitCaf, updateCaf, isEditMode, cafData } = useCafStore();
  const { register, control, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: cafData || {
        // Default values structure matching DB fields roughly
        certifications: [],
        internships: [],
        open_to_relocation: 'Yes',
        career_preference: 'Placement',
        gender: 'Male',
        current_semester: '1',
        section: 'A',
        batch_year: '2025',
        course: 'B.Tech',
        branch: 'CSE',
        tenth_board: 'CBSE',
        twelfth_board: 'CBSE',
        study_gap: 'No Gap'
    }
  });

  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({
    control,
    name: "certifications"
  });

  const { fields: internFields, append: appendIntern, remove: removeIntern } = useFieldArray({
    control,
    name: "internships"
  });

  const onSubmit = async (data) => {
    console.log('Form Data:', data);
    if (isEditMode) {
      await updateCaf(data);
    } else {
      await submitCaf(data);
    }
  };

  const hasCertifications = watch("has_certifications");
  const hasInternships = watch("has_internships");

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Campus Application Form (CAF)</h1>
        <div className="text-sm font-medium">
          Status: <span className="capitalize">{cafStatus.replace('_', ' ')}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* SECTION A: Personal Details */}
        <Card>
          <CardHeader>
            <CardTitle>Section A: Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input id="full_name" {...register("full_name", { required: true })} placeholder="John Doe" />
              {errors.full_name && <span className="text-red-500 text-xs">Required</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="rgpv_enrollment_no">RGPV Enrollment Number</Label>
              <Input id="rgpv_enrollment_no" {...register("rgpv_enrollment_no", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="enrollment_no">Institute Enrollment Number</Label>
              <Input id="enrollment_no" {...register("enrollment_no", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input type="date" id="dob" {...register("dob", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input type="tel" id="mobile" {...register("mobile", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alternate_mobile">WhatsApp Number</Label>
              <Input type="tel" id="alternate_mobile" {...register("alternate_mobile")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email_personal">Personal Email ID</Label>
              <Input type="email" id="email_personal" {...register("email_personal", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Current Course</Label>
              <Controller
                name="course"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select Course" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="B.E.">B.E.</SelectItem>
                      <SelectItem value="B.Tech">B.Tech</SelectItem>
                      <SelectItem value="BCA">BCA</SelectItem>
                      <SelectItem value="BBA">BBA</SelectItem>
                      <SelectItem value="MBA">MBA</SelectItem>
                      <SelectItem value="MCA">MCA</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch">Branch / Stream</Label>
              <Controller
                name="branch"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select Branch" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CSE">CSE</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="CSIT">CSIT</SelectItem>
                      <SelectItem value="AIML">AIML</SelectItem>
                      <SelectItem value="DS">DS</SelectItem>
                      <SelectItem value="ECE">ECE</SelectItem>
                      <SelectItem value="ME">ME</SelectItem>
                      <SelectItem value="CIVIL">CIVIL</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch_year">Batch Year (Passing Year)</Label>
              <Controller
                name="batch_year"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_semester">Current Semester</Label>
              <Controller
                name="current_semester"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select Semester" /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Controller
                name="section"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select Section" /></SelectTrigger>
                    <SelectContent>
                      {['A', 'B', 'C', 'D'].map(sec => (
                        <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* SECTION B: Address Details */}
        <Card>
          <CardHeader>
            <CardTitle>Section B: Address Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="current_address">Current Address</Label>
              <Textarea id="current_address" {...register("current_address", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanent_address">Permanent Address</Label>
              <Textarea id="permanent_address" {...register("permanent_address", { required: true })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register("city", { required: true })} />
                </div>
                <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="MP">Madhya Pradesh</SelectItem>
                        <SelectItem value="MH">Maharashtra</SelectItem>
                        <SelectItem value="UP">Uttar Pradesh</SelectItem>
                        <SelectItem value="DL">Delhi</SelectItem>
                        {/* Add more states as needed */}
                        </SelectContent>
                    </Select>
                    )}
                />
                </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION C: Academic Record */}
        <Card>
          <CardHeader>
            <CardTitle>Section C: Academic Record</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Class 10th */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Class 10th</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label>10th Board</Label>
                        <Controller
                            name="tenth_board"
                            control={control}
                            render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger><SelectValue placeholder="Select Board" /></SelectTrigger>
                                <SelectContent>
                                <SelectItem value="CBSE">CBSE</SelectItem>
                                <SelectItem value="ICSE">ICSE</SelectItem>
                                <SelectItem value="State Board">State Board</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>10th Percentage</Label>
                        <Input type="number" step="0.01" min="0" {...register("tenth_percentage", { required: true })} />
                    </div>
                    <div className="space-y-2">
                        <Label>10th Year of Passing</Label>
                        <Input type="number" min="2000" {...register("tenth_year_of_passing", { required: true })} />
                    </div>
                </div>
            </div>
            <hr className="my-6" />
            {/* Class 12th */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Class 12th</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label>12th Board</Label>
                        <Controller
                            name="twelfth_board"
                            control={control}
                            render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger><SelectValue placeholder="Select Board" /></SelectTrigger>
                                <SelectContent>
                                <SelectItem value="CBSE">CBSE</SelectItem>
                                <SelectItem value="ICSE">ICSE</SelectItem>
                                <SelectItem value="State Board">State Board</SelectItem>
                                <SelectItem value="Diploma">Diploma</SelectItem>
                                <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                                </SelectContent>
                            </Select>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>12th Percentage</Label>
                        <Input type="number" step="0.01" min="0" {...register("twelfth_percentage")} />
                    </div>
                    <div className="space-y-2">
                        <Label>12th Year of Passing</Label>
                        <Input type="number" min="2000" {...register("twelfth_year_of_passing")} />
                    </div>
                </div>
            </div>
            <hr className="my-6" />
            {/* Diploma */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Diploma (if applicable)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Diploma Branch</Label>
                        <Input {...register("diploma_branch")} placeholder="e.g. CS, ME (or Not Applicable)" />
                    </div>
                    <div className="space-y-2">
                        <Label>Diploma Percentage</Label>
                        <Input type="number" step="0.01" min="0" {...register("diploma_percentage")} />
                    </div>
                </div>
            </div>
            <hr className="my-6" />
            {/* Graduation */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Graduation</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label>Current CGPA</Label>
                        <Input type="number" step="0.01" min="0" {...register("current_cgpa", { required: true })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Active Backlogs</Label>
                        <Input type="number" min="0" {...register("backlogs_active", { required: true })} />
                    </div>
                    <div className="space-y-2">
                        <Label>History of Backlogs</Label>
                        <Input type="number" min="0" {...register("backlogs_history", { required: true })} />
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION D: Career Preference */}
        <Card>
          <CardHeader>
            <CardTitle>Section D: Career Preference</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Career Preference</Label>
              <Controller
                name="career_preference"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select Preference" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Placement">Placement</SelectItem>
                      <SelectItem value="Higher Studies">Higher Studies</SelectItem>
                      <SelectItem value="Family Business">Family Business</SelectItem>
                      <SelectItem value="Entrepreneurship">Entrepreneurship</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Open to relocation?</Label>
              <Controller
                name="open_to_relocation"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select Option" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Depends">Depends</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Preferred Job Location(s)</Label>
              <Input {...register("preferred_locations")} placeholder="e.g. Pune, Bangalore, Remote" />
            </div>
          </CardContent>
        </Card>

        {/* SECTION E: Technical Domains */}
        <Card>
          <CardHeader>
            <CardTitle>Section E: Technical Domains</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Primary Technical Domain</Label>
              <Controller
                name="domain_interest_primary"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select Primary Domain" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Java Full Stack">Java Full Stack</SelectItem>
                      <SelectItem value="Python Full Stack">Python Full Stack</SelectItem>
                      <SelectItem value="MERN / MEAN">MERN / MEAN</SelectItem>
                      <SelectItem value="Data Analytics">Data Analytics</SelectItem>
                      <SelectItem value="Data Science / ML">Data Science / ML</SelectItem>
                      <SelectItem value="DevOps / Cloud">DevOps / Cloud</SelectItem>
                      <SelectItem value="Cyber Security">Cyber Security</SelectItem>
                      <SelectItem value="Testing / QA">Testing / QA</SelectItem>
                      <SelectItem value="Embedded / VLSI">Embedded / VLSI</SelectItem>
                      <SelectItem value="Non-IT">Non-IT</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Secondary Technical Domain</Label>
              <Controller
                name="domain_interest_secondary"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select Secondary Domain" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Java Full Stack">Java Full Stack</SelectItem>
                      <SelectItem value="Python Full Stack">Python Full Stack</SelectItem>
                      <SelectItem value="MERN / MEAN">MERN / MEAN</SelectItem>
                      <SelectItem value="Data Analytics">Data Analytics</SelectItem>
                      {/* Add others as needed */}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Other Technical Skills (Tags)</Label>
              <Input {...register("technical_skills")} placeholder="e.g. React, Docker, AWS (comma separated)" />
            </div>
          </CardContent>
        </Card>

        {/* SECTION F: Certifications */}
        <Card>
          <CardHeader>
            <CardTitle>Section F: Certifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
                <Controller
                    name="has_certifications"
                    control={control}
                    render={({ field }) => (
                        <Checkbox 
                            id="has_certifications" 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                        />
                    )}
                />
                <Label htmlFor="has_certifications">Have you completed any certifications?</Label>
            </div>

            {hasCertifications && (
                <div className="space-y-4 mt-4">
                    {certFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-md space-y-4 relative">
                            <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm" 
                                className="absolute top-2 right-2"
                                onClick={() => removeCert(index)}
                            >
                                Remove
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Certification Title</Label>
                                    <Input {...register(`certifications.${index}.title`)} placeholder="e.g. AWS Certified Practitioner" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Issuing Organization</Label>
                                    <Input {...register(`certifications.${index}.issuer`)} placeholder="e.g. Amazon Web Services" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Completion Date</Label>
                                    <Input type="month" {...register(`certifications.${index}.issue_date`)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Certificate URL / ID</Label>
                                    <Input {...register(`certifications.${index}.certificate_url`)} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendCert({ title: '', issuer: '', issue_date: '', certificate_url: '' })}>
                        + Add Certification
                    </Button>
                </div>
            )}
          </CardContent>
        </Card>

        {/* SECTION G: Internship Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Section G: Internship Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center space-x-2">
                <Controller
                    name="has_internships"
                    control={control}
                    render={({ field }) => (
                        <Checkbox 
                            id="has_internships" 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                        />
                    )}
                />
                <Label htmlFor="has_internships">Have you done any internships?</Label>
            </div>

            {hasInternships && (
                <div className="space-y-4 mt-4">
                    {internFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-md space-y-4 relative">
                             <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm" 
                                className="absolute top-2 right-2"
                                onClick={() => removeIntern(index)}
                            >
                                Remove
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Company Name</Label>
                                    <Input {...register(`internships.${index}.company`)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Internship Type</Label>
                                    <Controller
                                        name={`internships.${index}.type`}
                                        control={control}
                                        render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                            <SelectContent>
                                            <SelectItem value="Summer">Summer</SelectItem>
                                            <SelectItem value="Winter">Winter</SelectItem>
                                            <SelectItem value="Vocational">Vocational</SelectItem>
                                            <SelectItem value="Project">Project</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Duration</Label>
                                    <Controller
                                        name={`internships.${index}.duration`}
                                        control={control}
                                        render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select Duration" /></SelectTrigger>
                                            <SelectContent>
                                            <SelectItem value="< 1 month">Less than 1 month</SelectItem>
                                            <SelectItem value="1-2 months">1-2 months</SelectItem>
                                            <SelectItem value="3-6 months">3-6 months</SelectItem>
                                            <SelectItem value="> 6 months">More than 6 months</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Stipend</Label>
                                    <Controller
                                        name={`internships.${index}.stipend`}
                                        control={control}
                                        render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Select Stipend" /></SelectTrigger>
                                            <SelectContent>
                                            <SelectItem value="Paid">Paid</SelectItem>
                                            <SelectItem value="Unpaid">Unpaid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                     <Button type="button" variant="outline" onClick={() => appendIntern({ company: '', type: 'Summer', duration: '1-2 months', stipend: 'Unpaid' })}>
                        + Add Internship
                    </Button>
                </div>
            )}
          </CardContent>
        </Card>

        {/* SECTION H: Other Information */}
        <Card>
          <CardHeader>
            <CardTitle>Section H: Other Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label>Study Gap</Label>
              <Controller
                name="study_gap"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select Gap" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="No Gap">No Gap</SelectItem>
                      <SelectItem value="Up to 1 year">Up to 1 year</SelectItem>
                      <SelectItem value="1-2 years">1-2 years</SelectItem>
                      <SelectItem value="More than 2 years">More than 2 years</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Any medical condition to be considered?</Label>
              <Input {...register("medical_note")} placeholder="Optional" />
            </div>
          </CardContent>
        </Card>

        {/* SECTION I: Resume & Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Section I: Resume & Documents</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label>Upload Resume (PDF only)</Label>
              <Input type="file" accept=".pdf" {...register("resume_file")} />
            </div>
            <div className="space-y-2">
              <Label>Upload Academic Documents (Optional)</Label>
              <Input type="file" multiple {...register("academic_documents")} />
            </div>
          </CardContent>
        </Card>

        {/* SECTION J: Evaluator Mapping */}
        <Card>
          <CardHeader>
            <CardTitle>Section J: Evaluator Mapping</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label>Evaluator (Internal)</Label>
              <Controller
                name="evaluator_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select Evaluator" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eval1">Trainer 1</SelectItem>
                      <SelectItem value="eval2">Trainer 2</SelectItem>
                      <SelectItem value="eval3">Coordinator 1</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* SECTION K: Consent & Declaration */}
        <Card>
          <CardHeader>
            <CardTitle>Section K: Consent & Declaration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-2">
                <Controller
                    name="declaration"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Checkbox 
                            id="declaration" 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                        />
                    )}
                />
                <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="declaration" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Declaration
                    </Label>
                    <p className="text-sm text-muted-foreground">
                        I hereby declare that the information provided above is true and correct to the best of my knowledge. I understand that any false information may lead to cancellation of my candidature in campus placements.
                    </p>
                    {errors.declaration && <span className="text-red-500 text-xs">You must agree to the declaration</span>}
                </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-6">
          <Button type="submit" size="lg" className="w-full md:w-auto">
            {isEditMode ? 'Submit Update Request' : 'Submit CAF'}
          </Button>
        </div>
      </form>
    </div>
  );
}
