import { Link } from 'react-router-dom';
import { useCafStore } from '@/store/cafStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, FileText, Briefcase, Building2, UserCheck } from 'lucide-react';

export default function StudentDashboard() {
  const { cafStatus } = useCafStore();
  const isApproved = cafStatus === 'approved';

  const DashboardCard = ({ title, icon: Icon, href, locked, description }) => (
    <Card className={`relative ${locked ? 'opacity-75 bg-gray-50' : 'hover:shadow-md transition-shadow'}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        {locked ? <Lock className="h-5 w-5 text-gray-400" /> : <Icon className="h-5 w-5 text-primary" />}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        {locked ? (
          <Button disabled variant="outline" className="w-full">
            Locked
          </Button>
        ) : (
          <Link to={href}>
            <Button className="w-full">Access</Button>
          </Link>
        )}
        {locked && (
          <p className="text-xs text-red-500 mt-2 font-medium">
            Complete CAF approval to unlock
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">Manage your placement activities and profile.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="CAF Form"
          icon={FileText}
          href="/student/caf"
          locked={false}
          description="Submit and manage your Campus Application Form."
        />
        <DashboardCard
          title="Internships"
          icon={Briefcase}
          href="/student/internships"
          locked={!isApproved}
          description="Manage your internship records and PPO details."
        />
        <DashboardCard
          title="Placement Drives"
          icon={Building2}
          href="/student/placements"
          locked={!isApproved}
          description="View and apply for eligible placement drives."
        />
        <DashboardCard
          title="Mock Interviews"
          icon={UserCheck}
          href="/student/mock-interviews"
          locked={!isApproved}
          description="Check your mock interview results and feedback."
        />
      </div>
    </div>
  );
}
