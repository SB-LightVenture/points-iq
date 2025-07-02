
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, RefreshCw, Database, AlertCircle, CheckCircle } from 'lucide-react';
import { flightScraper } from '@/services/flightScraper';

interface ScrapingStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  cacheHits: number;
  liveScraping: number;
  mockData: number;
  averageResponseTime: number;
  lastUpdate: string;
}

const ScrapingMonitor: React.FC = () => {
  const [stats, setStats] = useState<ScrapingStats | null>(null);
  const [cacheStats, setCacheStats] = useState({ size: 0, keys: [] });
  const [loading, setLoading] = useState(false);

  const refreshStats = async () => {
    setLoading(true);
    try {
      // Get cache statistics
      const cache = flightScraper.getCacheStats();
      setCacheStats(cache);
      
      // In a real implementation, you would fetch these from a monitoring service
      const mockStats: ScrapingStats = {
        totalRequests: 150,
        successfulRequests: 142,
        failedRequests: 8,
        cacheHits: 45,
        liveScraping: 75,
        mockData: 22,
        averageResponseTime: 3.2,
        lastUpdate: new Date().toISOString()
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch scraping stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCache = () => {
    flightScraper.clearCache();
    setCacheStats({ size: 0, keys: [] });
  };

  useEffect(() => {
    refreshStats();
  }, []);

  if (!stats) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="flex items-center justify-center p-6">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
          <span className="ml-2 text-white">Loading scraping statistics...</span>
        </CardContent>
      </Card>
    );
  }

  const successRate = ((stats.successfulRequests / stats.totalRequests) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-400" />
          Scraping Monitor
        </h3>
        <div className="flex space-x-2">
          <Button
            onClick={refreshStats}
            disabled={loading}
            variant="outline"
            size="sm"
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={clearCache}
            variant="outline"
            size="sm"
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            <Database className="w-4 h-4 mr-2" />
            Clear Cache
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-2xl font-bold text-white">{successRate}%</span>
            </div>
            <p className="text-xs text-gray-400">
              {stats.successfulRequests} of {stats.totalRequests} requests
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-2xl font-bold text-white">{stats.averageResponseTime}s</span>
            </div>
            <p className="text-xs text-gray-400">Average response time</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Cache Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-purple-400" />
              <span className="text-2xl font-bold text-white">{cacheStats.size}</span>
            </div>
            <p className="text-xs text-gray-400">Cached entries</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Failed Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-2xl font-bold text-white">{stats.failedRequests}</span>
            </div>
            <p className="text-xs text-gray-400">Failed scraping attempts</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-300">Data Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
              Live Scraping: {stats.liveScraping}
            </Badge>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              Cache Hits: {stats.cacheHits}
            </Badge>
            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
              Mock Data: {stats.mockData}
            </Badge>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Last updated: {new Date(stats.lastUpdate).toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScrapingMonitor;
