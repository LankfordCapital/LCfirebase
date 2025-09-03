'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle, Building2, Calculator } from 'lucide-react';
import Link from 'next/link';

export default function TestGroundUpIntegrationPage() {
  const [testData] = useState({
    propertyAddress: '123 Main Street, Austin, TX 78701',
    loanAmount: 300000,
    companyName: 'Real Estate Holdings LLC',
    revenue: 50000,
    grossProfit: 35000
  });

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          🏗️ Residential NOO Ground Up Construction Integration Test
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Test the new comprehensive form system that automatically saves all user data 
          without requiring individual state variables.
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Auto-Save System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Every keystroke automatically saves to the comprehensive object structure. 
              No manual variables needed!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Progress Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Real-time progress tracking across all 12 pages with visual completion indicators.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-purple-600" />
              Auto-Calculations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Financial ratios, construction costs, and risk scores calculated automatically.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Test Data Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Data That Will Be Saved</CardTitle>
          <CardDescription>
            This is the type of data that gets automatically saved in the comprehensive object structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">Property Information</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Address:</span> {testData.propertyAddress}</p>
                <p><span className="font-medium">Loan Amount:</span> ${testData.loanAmount.toLocaleString()}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">Business Information</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Company:</span> {testData.companyName}</p>
                <p><span className="font-medium">Revenue:</span> ${testData.revenue.toLocaleString()}</p>
                <p><span className="font-medium">Gross Profit:</span> ${testData.grossProfit.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Page 1 - Property & Loan Info</CardTitle>
            <CardDescription>
              Test the main application form with property details, loan information, and business info.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Features to Test:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time form updates</li>
                <li>• Progress tracking</li>
                <li>• Auto-save functionality</li>
                <li>• Page completion marking</li>
              </ul>
            </div>
            <Link href="/broker-office/application/residential-noo-ground-up-construction">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Test Page 1
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Page 2 - Company P&L Statement</CardTitle>
            <CardDescription>
              Test the financial information form with auto-calculations for gross profit and expenses.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Features to Test:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Auto-calculated financial totals</li>
                <li>• Cross-page data persistence</li>
                <li>• Progress continuation</li>
                <li>• Navigation between pages</li>
              </ul>
            </div>
            <Link href="/broker-office/application/residential-noo-ground-up-construction/page-2">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Test Page 2
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Integration Benefits */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">🎉 Integration Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-800">Before (Old System)</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>❌ 50+ individual state variables</li>
                <li>❌ Manual save operations</li>
                <li>❌ Data loss between pages</li>
                <li>❌ No progress tracking</li>
                <li>❌ Complex state management</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-green-800">After (New System)</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✅ Single comprehensive object</li>
                <li>✅ Automatic real-time saving</li>
                <li>✅ Persistent data across pages</li>
                <li>✅ Visual progress tracking</li>
                <li>✅ Simple hook-based management</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Implementation</CardTitle>
          <CardDescription>
            How the new system works under the hood
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Badge variant="outline" className="mb-2">Hook</Badge>
                <p className="text-sm text-gray-600">
                  <code>useGroundUpConstructionForm()</code> manages all state
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Badge variant="outline" className="mb-2">Types</Badge>
                <p className="text-sm text-gray-600">
                  <code>ResidentialNOOGroundUpConstructionApplication</code> interface
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Badge variant="outline" className="mb-2">Auto-Save</Badge>
                <p className="text-sm text-gray-600">
                  <code>updateField()</code> saves data instantly
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
