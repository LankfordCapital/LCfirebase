'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function AdminProfilePage() {
  const { user, userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-headline text-4xl font-bold text-gray-900">Admin Profile</h1>
          <p className="text-gray-600 text-lg">Your administrator account details</p>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Administrator Account</CardTitle>
                <CardDescription>You have full system access and user management privileges</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Full Name</p>
                <p className="text-lg font-semibold">{user?.displayName || 'Admin User'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Email Address</p>
                <p className="text-lg font-semibold">{user?.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">User ID</p>
                <p className="text-sm font-mono text-gray-500">{user?.uid}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Role</p>
                <p className="text-lg font-semibold text-red-600">Administrator</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-lg mb-3">Administrator Capabilities</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  Manage all user accounts and roles
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  Approve or reject user registrations
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  Access system-wide analytics and reports
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  Configure system settings and permissions
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

