import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  RotateCcw,
  XCircle
} from 'lucide-react';

interface GenerationStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
  progress: number;
  duration?: number;
  startTime?: Date;
  endTime?: Date;
}

interface RealTimeStatusProps {
  isGenerating: boolean;
  currentStep: string;
  progress: number;
  steps?: GenerationStep[];
  onCancel?: () => void;
}

const RealTimeStatus: React.FC<RealTimeStatusProps> = ({
  isGenerating,
  currentStep,
  progress,
  steps = [],
  onCancel
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGenerating, startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'processing':
        return <RotateCcw className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'skipped':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  if (!isGenerating && steps.length === 0) return null;

  return (
    <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-purple-400" />
            <CardTitle className="text-white">Generation Status</CardTitle>
            {isGenerating && (
              <Badge variant="outline" className="border-blue-400 text-blue-300">
                <Zap className="w-3 h-3 mr-1" />
                Active
              </Badge>
            )}
          </div>
          <div className="text-sm text-slate-400">
            {isGenerating ? formatTime(elapsedTime) : 'Completed'}
          </div>
        </div>
        <CardDescription className="text-slate-300">
          {currentStep || 'AI content generation pipeline'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Overall Progress</span>
            <span className="text-sm text-slate-400">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Detailed Steps */}
        {steps.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-200">Pipeline Steps</h4>
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(step.status)}
                  <span className="text-slate-200 text-sm">{step.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Progress value={step.progress} className="w-16 h-1" />
                  <span className="text-xs text-slate-400 w-10 text-right">
                    {step.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Generation Stats */}
        {isGenerating && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
            <div className="text-center">
              <div className="text-lg font-bold text-white">{elapsedTime}s</div>
              <div className="text-xs text-slate-400">Elapsed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {steps.filter(s => s.status === 'completed').length}/{steps.length}
              </div>
              <div className="text-xs text-slate-400">Steps</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {Math.round((progress / 100) * (steps.length || 1))}
              </div>
              <div className="text-xs text-slate-400">Progress</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeStatus;