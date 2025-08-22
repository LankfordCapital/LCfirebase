'use client';

import { FullscreenVideoModule } from '@/components/fullscreen-video-module';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Video, BookOpen, Users, Target, Award } from 'lucide-react';
import { useState } from 'react';

// Sample video modules data
const sampleVideoModules = [
  {
    id: 'introduction',
    title: 'Introduction to Lankford Capital',
    description: 'Learn about our company and mission',
    videoUrl: 'https://firebasestorage.googleapis.com/v0/b/lankford-homebase.firebasestorage.app/o/Adobe%20Express%20-%20shutterstock_3599048629.mp4?alt=media&token=a42649e7-9a18-4028-b277-b60390039ee2',
    autoPlay: true
  },
  {
    id: 'm1',
    title: 'Module 1: Understanding Your Financing Needs',
    description: 'Explore different types of financing available',
    videoUrl: 'https://firebasestorage.googleapis.com/v0/b/lankford-homebase.firebasestorage.app/o/Adobe%20Express%20-%20shutterstock_1058475664%20(1).mp4?alt=media&token=8ccb373f-4c35-4f78-abe8-f059193863d6',
    autoPlay: false
  },
  {
    id: 'm2',
    title: 'Module 2: Application Process Overview',
    description: 'Step-by-step guide to applying for financing',
    videoUrl: 'https://firebasestorage.googleapis.com/v0/b/lankford-homebase.firebasestorage.app/o/Adobe%20Express%20-%20shutterstock_3610652399.mp4?alt=media&token=e3d9722d-1b03-4c8e-9b91-ce5da80c04e1',
    autoPlay: false
  }
];

export default function FullscreenVideoModulesPage() {
  const [showFullscreen, setShowFullscreen] = useState(false);

  if (showFullscreen) {
    return (
      <FullscreenVideoModule
        modules={sampleVideoModules}
        initialModuleId="introduction"
        onClose={() => setShowFullscreen(false)}
        className="min-h-screen"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl font-bold mb-4">
            Fullscreen Video Module System
          </h1>
          <p className="text-xl text-muted-foreground">
            Experience our interactive video learning modules in fullscreen mode
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sampleVideoModules.map((module) => (
            <Card key={module.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  {module.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {module.description}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowFullscreen(true)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button 
            size="lg" 
            onClick={() => setShowFullscreen(true)}
            className="px-8"
          >
            <Play className="h-5 w-5 mr-2" />
            Launch Fullscreen Video Experience
          </Button>
          
          <div className="mt-6 text-sm text-muted-foreground space-y-2">
            <p><strong>Fullscreen Navigation:</strong> Fullscreen mode is maintained when moving between modules</p>
            <p><strong>Keyboard Controls:</strong> ← → arrows to navigate, Space to play/pause, M to mute, Escape to exit fullscreen</p>
            <p><strong>Auto-advance:</strong> Videos automatically advance to the next module when finished</p>
          </div>
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">How It Works</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• Enter fullscreen mode to start the immersive experience</li>
            <li>• Navigate between modules using the Next/Previous buttons or arrow keys</li>
            <li>• Fullscreen state is preserved during navigation between modules</li>
            <li>• Videos automatically advance to the next module when completed</li>
            <li>• Use keyboard shortcuts for quick navigation and control</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
