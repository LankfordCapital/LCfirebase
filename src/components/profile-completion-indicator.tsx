
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, AlertCircle } from "lucide-react";

interface ProfileCompletionProps {
  completion: {
    personalInfo: number;
    contactInfo: number;
    companies: number;
    documents: number;
    financialInfo: number;
    overall: number;
  } | null;
}

export function ProfileCompletionIndicator({ completion }: ProfileCompletionProps) {
  if (!completion) return null;

  const sections = [
    { key: 'personalInfo', label: 'Personal Information', value: completion.personalInfo },
    { key: 'contactInfo', label: 'Contact Information', value: completion.contactInfo },
    { key: 'companies', label: 'Company Information', value: completion.companies },
    { key: 'documents', label: 'Required Documents', value: completion.documents },
    { key: 'financialInfo', label: 'Financial Information', value: completion.financialInfo },
  ];

  const getStatusIcon = (percentage: number) => {
    if (percentage === 100) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (percentage >= 50) return <Circle className="h-4 w-4 text-yellow-600" />;
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };

  const getStatusColor = (percentage: number) => {
    if (percentage === 100) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-lg flex items-center gap-2">
          Profile Completion
          <span className={`text-sm font-normal ${getStatusColor(completion.overall)}`}>
            {completion.overall.toFixed(0)}% Complete
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className={`text-sm font-bold ${getStatusColor(completion.overall)}`}>
              {completion.overall.toFixed(0)}%
            </span>
          </div>
          <Progress value={completion.overall} className="h-3" />
        </div>

        {/* Section Details */}
        <div className="space-y-3">
          {sections.map((section) => (
            <div key={section.key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(section.value)}
                <span className="text-sm text-gray-700">{section.label}</span>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(section.value)}`}>
                {section.value.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>

        {/* Completion Status */}
        <div className="pt-4 border-t border-gray-200">
          {completion.overall === 100 ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Profile Complete!</span>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              <p>Complete all sections to submit your loan application.</p>
              <p className="mt-1">
                {Math.round(100 - completion.overall)}% remaining
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
