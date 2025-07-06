
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Clock, Database, RefreshCw, Bug, Zap, Globe, AlertTriangle } from 'lucide-react';

interface DebugInfo {
  timestamp: string;
  airline: string;
  status: 'success' | 'error' | 'cache';
  source: 'live' | 'mock' | 'cache' | 'error' | 'live_scraping' | 'enhanced_mock';
  error?: string;
  debug?: any;
  responseTime: number;
}

const ScrapingDebugMonitor: React.FC = () => {
  const [debugLogs, setDebugLogs] = useState<DebugInfo[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Listen for flight search events to capture debug info
    const handleFlightSearch = (event: CustomEvent) => {
      if (event.detail?.debugInfo) {
        addDebugLog(event.detail.debugInfo);
      }
    };

    window.addEventListener('flightSearchDebug', handleFlightSearch as EventListener);
    return () => window.removeEventListener('flightSearchDebug', handleFlightSearch as EventListener);
  }, []);

  const addDebugLog = (info: DebugInfo) => {
    setDebugLogs(prev => [info, ...prev.slice(0, 19)]); // Keep last 20 logs
  };

  const clearLogs = () => {
    setDebugLogs([]);
  };

  const getStatusIcon = (status: string, source: string) => {
    if (source === 'error') return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (source === 'cache') return <Database className="w-4 h-4 text-blue-500" />;
    if (source === 'live_scraping') return <Globe className="w-4 h-4 text-green-500" />;
    if (source === 'live') return <Zap className="w-4 h-4 text-green-500" />;
    if (source === 'enhanced_mock') return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    if (source === 'mock') return <CheckCircle className="w-4 h-4 text-yellow-500" />;
    return <Clock className="w-4 h-4 text-gray-500" />;
  };

  const getStatusColor = (source: string) => {
    switch (source) {
      case 'live_scraping': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'live': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'cache': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'enhanced_mock': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'mock': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'error': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getSourceDescription = (source: string) => {
    switch (source) {
      case 'live_scraping': return 'Live data via web scraping';
      case 'live': return 'Real-time data from airline API';
      case 'cache': return 'Recently cached data';
      case 'enhanced_mock': return 'High-quality simulated data (fallback)';
      case 'mock': return 'Basic simulated data';
      case 'error': return 'Failed to retrieve data';
      default: return 'Unknown data source';
    }
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 bg-slate-800 border-slate-600 text-white hover:bg-slate-700 z-50"
      >
        <Bug className="w-4 h-4 mr-2" />
        Debug Monitor
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 z-50">
      <Card className="bg-slate-800/95 border-slate-700 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <Bug className="w-4 h-4 mr-2" />
              Scraping Debug Monitor
            </CardTitle>
            <div className="flex space-x-1">
              <Button
                onClick={clearLogs}
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                Clear
              </Button>
              <Button
                onClick={() => setIsVisible(false)}
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                ×
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="max-h-80 overflow-y-auto">
          {debugLogs.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-xs text-gray-400 mb-2">
                No debug logs yet. Start a flight search to see debug information.
              </p>
              <div className="text-xs text-gray-500">
                <div className="flex items-center justify-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Globe className="w-3 h-3 text-green-500" />
                    <span>Live</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3 text-orange-500" />
                    <span>Enhanced</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Database className="w-3 h-3 text-blue-500" />
                    <span>Cache</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {debugLogs.map((log, index) => (
                <div key={index} className="bg-slate-700/50 rounded p-2 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(log.status, log.source)}
                      <span className="font-medium text-white">{log.airline}</span>
                      <Badge variant="outline" className={getStatusColor(log.source)}>
                        {log.source === 'live_scraping' ? 'LIVE' : log.source === 'enhanced_mock' ? 'ENHANCED' : log.source.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-gray-400">{log.responseTime}ms</span>
                  </div>
                  
                  <div className="text-gray-400 text-xs mb-1">
                    {getSourceDescription(log.source)}
                  </div>
                  
                  {log.debug?.fallback_reason && (
                    <div className="text-orange-300 bg-orange-500/10 rounded px-2 py-1 mb-1 text-xs">
                      Fallback: {log.debug.fallback_reason}
                    </div>
                  )}
                  
                  {log.error && (
                    <div className="text-red-300 bg-red-500/10 rounded px-2 py-1 mb-1">
                      {log.error}
                    </div>
                  )}
                  
                  {log.debug && (
                    <div className="text-gray-300 bg-slate-600/30 rounded px-2 py-1">
                      {log.debug.scraping_method && (
                        <div className="mb-1">Method: {log.debug.scraping_method}</div>
                      )}
                      {log.debug.route && (
                        <div className="mb-1">Route: {log.debug.route}</div>
                      )}
                      {log.debug.data_source && (
                        <div className="mb-1">Source: {log.debug.data_source}</div>
                      )}
                      {log.debug.error_details && (
                        <div className="text-red-300">Error: {log.debug.error_details}</div>
                      )}
                    </div>
                  )}
                  
                  <div className="text-gray-500 text-xs mt-1">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScrapingDebugMonitor;
