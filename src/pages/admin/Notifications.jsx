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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Notifications</h1>
      
      <Tabs defaultValue="new-caf" className="w-full">
        <TabsList>
          <TabsTrigger value="new-caf">New CAF Applications ({newCAFs.length})</TabsTrigger>
          <TabsTrigger value="edit-requests">Edit Requests ({editRequests.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new-caf">
          {newCAFs.length === 0 ? (
            <p className="text-gray-500 mt-4">No new CAF applications.</p>
          ) : (
            newCAFs.map(notification => (
              <Card key={notification.id} className="mb-4">
                <CardHeader>
                  <CardTitle>{notification.studentName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Enrollment: {notification.details.enrollmentNo}</p>
                  <p className="text-sm text-gray-500 mb-4">Submitted: {new Date(notification.timestamp).toLocaleString()}</p>
                  <div className="flex gap-2">
                    <Button onClick={() => approveRequest(notification.id, 'caf')} className="bg-green-600 hover:bg-green-700">
                      Approve
                    </Button>
                    <Button variant="destructive" onClick={() => rejectRequest(notification.id, 'caf')}>
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="edit-requests">
          {editRequests.length === 0 ? (
            <p className="text-gray-500 mt-4">No pending edit requests.</p>
          ) : (
            editRequests.map(notification => (
              <Card key={notification.id} className="mb-4">
                <CardHeader>
                  <CardTitle>{notification.studentName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Request to edit: <span className="font-semibold capitalize">{notification.details.field}</span></p>
                  <p className="text-sm text-gray-500 mb-4">Requested: {new Date(notification.timestamp).toLocaleString()}</p>
                  <div className="flex gap-2">
                    <Button onClick={() => approveRequest(notification.id, 'edit')} className="bg-green-600 hover:bg-green-700">
                      Approve
                    </Button>
                    <Button variant="destructive" onClick={() => rejectRequest(notification.id, 'edit')}>
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
