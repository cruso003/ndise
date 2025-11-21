import { useState } from 'react';
import {
  FileText, Download, Calendar, Filter, TrendingUp, TrendingDown,
  Users, Shield, Activity, AlertTriangle, CheckCircle, Clock,
  BarChart3, PieChart, ArrowUpRight, ArrowDownRight, Eye
} from 'lucide-react';
import { NDISEPageHeader } from './NDISEBadge';

interface UniversalReportsProps {
  dashboardName: string;
  dashboardType: 'border' | 'police' | 'enrollment' | 'executive' | 'agency' | 'nsa';
}

export default function UniversalReports({ dashboardName, dashboardType }: UniversalReportsProps) {
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'>('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');

  // Generate dashboard-specific metrics based on dashboard type
  const getMetricsConfig = () => {
    switch (dashboardType) {
      case 'border':
        return {
          title: 'Border Control Metrics',
          categories: [
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'crossings', label: 'Border Crossings', icon: Users },
            { id: 'watchlist', label: 'Watchlist Encounters', icon: AlertTriangle },
            { id: 'visas', label: 'Visa & Documents', icon: FileText },
            { id: 'security', label: 'Security Incidents', icon: Shield },
          ],
          stats: [
            { label: 'Total Crossings', value: '12,847', change: '+15%', trend: 'up', icon: Users, color: 'blue' },
            { label: 'Watchlist Hits', value: '23', change: '-8%', trend: 'down', icon: AlertTriangle, color: 'red' },
            { label: 'Approved Entries', value: '12,715', change: '+16%', trend: 'up', icon: CheckCircle, color: 'green' },
            { label: 'Detentions', value: '8', change: '+2', trend: 'up', icon: Shield, color: 'orange' },
          ],
        };

      case 'police':
        return {
          title: 'Police Operations Metrics',
          categories: [
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'cases', label: 'Cases & Investigations', icon: FileText },
            { id: 'arrests', label: 'Arrests & Warrants', icon: Shield },
            { id: 'response', label: 'Response Times', icon: Clock },
            { id: 'crimes', label: 'Crime Statistics', icon: AlertTriangle },
          ],
          stats: [
            { label: 'Active Cases', value: '342', change: '+12', trend: 'up', icon: FileText, color: 'blue' },
            { label: 'Arrests This Period', value: '89', change: '-5%', trend: 'down', icon: Shield, color: 'orange' },
            { label: 'Warrants Executed', value: '34', change: '+18%', trend: 'up', icon: CheckCircle, color: 'green' },
            { label: 'Avg Response Time', value: '8.5m', change: '-12%', trend: 'down', icon: Clock, color: 'green' },
          ],
        };

      case 'enrollment':
        return {
          title: 'Enrollment Metrics',
          categories: [
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'registrations', label: 'New Registrations', icon: Users },
            { id: 'quality', label: 'Data Quality', icon: CheckCircle },
            { id: 'processing', label: 'Processing Times', icon: Clock },
            { id: 'biometric', label: 'Biometric Capture', icon: Eye },
          ],
          stats: [
            { label: 'New Registrations', value: '1,823', change: '+24%', trend: 'up', icon: Users, color: 'blue' },
            { label: 'Data Quality Score', value: '96.8%', change: '+2.1%', trend: 'up', icon: CheckCircle, color: 'green' },
            { label: 'Avg Processing Time', value: '12m', change: '-8%', trend: 'down', icon: Clock, color: 'green' },
            { label: 'Biometric Success', value: '98.2%', change: '+1.2%', trend: 'up', icon: Eye, color: 'green' },
          ],
        };

      case 'executive':
        return {
          title: 'Executive Dashboard Metrics',
          categories: [
            { id: 'overview', label: 'System Overview', icon: BarChart3 },
            { id: 'agencies', label: 'Agency Performance', icon: Shield },
            { id: 'security', label: 'National Security', icon: AlertTriangle },
            { id: 'operations', label: 'Operations', icon: Activity },
            { id: 'trends', label: 'Trends & Insights', icon: TrendingUp },
          ],
          stats: [
            { label: 'Total System Users', value: '45,829', change: '+1,234', trend: 'up', icon: Users, color: 'blue' },
            { label: 'Active Agencies', value: '15', change: '0', trend: 'neutral', icon: Shield, color: 'green' },
            { label: 'Security Alerts', value: '12', change: '-3', trend: 'down', icon: AlertTriangle, color: 'orange' },
            { label: 'System Uptime', value: '99.97%', change: '+0.02%', trend: 'up', icon: Activity, color: 'green' },
          ],
        };

      default:
        return {
          title: 'System Metrics',
          categories: [
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'activity', label: 'Activity', icon: Activity },
            { id: 'performance', label: 'Performance', icon: TrendingUp },
          ],
          stats: [
            { label: 'Total Records', value: '45,829', change: '+15%', trend: 'up', icon: Users, color: 'blue' },
            { label: 'Active Users', value: '234', change: '+8%', trend: 'up', icon: Activity, color: 'green' },
            { label: 'System Health', value: '99.9%', change: '+0.1%', trend: 'up', icon: CheckCircle, color: 'green' },
          ],
        };
    }
  };

  const metricsConfig = getMetricsConfig();

  const getStatColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-600 border-blue-300';
      case 'green': return 'bg-green-100 text-green-600 border-green-300';
      case 'red': return 'bg-red-100 text-red-600 border-red-300';
      case 'orange': return 'bg-orange-100 text-orange-600 border-orange-300';
      default: return 'bg-slate-100 text-slate-600 border-slate-300';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const handleExport = () => {
    // Simulate export
    const filename = `${dashboardType}-report-${dateRange}.${exportFormat}`;
    console.log('Exporting report:', filename);
    // In production: trigger actual file download
    alert(`Exporting ${metricsConfig.title} as ${exportFormat.toUpperCase()}...\n\nFile: ${filename}`);
  };

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case 'today': return 'Today';
      case 'week': return 'Last 7 Days';
      case 'month': return 'Last 30 Days';
      case 'quarter': return 'Last 90 Days';
      case 'year': return 'Last 365 Days';
      case 'custom': return `${customStartDate || 'Start'} - ${customEndDate || 'End'}`;
      default: return 'Select Range';
    }
  };

  return (
    <div className="space-y-6">
      <NDISEPageHeader
        title={`${dashboardName} Reports`}
        subtitle="Analytics, metrics, and insights"
      />

      {/* Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Date Range Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-500" />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDateRange('today')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  dateRange === 'today'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setDateRange('week')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  dateRange === 'week'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setDateRange('month')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  dateRange === 'month'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setDateRange('quarter')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  dateRange === 'quarter'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Quarter
              </button>
              <button
                onClick={() => setDateRange('year')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  dateRange === 'year'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Year
              </button>
            </div>
          </div>

          {/* Export Controls */}
          <div className="flex items-center gap-2">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as any)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium bg-white"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Custom Date Range (if selected) */}
        {dateRange === 'custom' && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-200">
            <label className="text-sm font-medium text-slate-700">From:</label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
            />
            <label className="text-sm font-medium text-slate-700">To:</label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
            />
          </div>
        )}
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsConfig.stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center ${getStatColor(stat.color)}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              {getTrendIcon(stat.trend)}
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
              <p className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-slate-500'}`}>
                {stat.change} from previous period
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Report Categories */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-slate-500" />
          <h3 className="text-lg font-bold text-slate-900">Report Categories</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {metricsConfig.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedMetric(category.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedMetric === category.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <category.icon className={`w-6 h-6 mx-auto mb-2 ${selectedMetric === category.id ? 'text-blue-600' : 'text-slate-500'}`} />
              <p className={`text-sm font-medium ${selectedMetric === category.id ? 'text-blue-900' : 'text-slate-700'}`}>
                {category.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Chart Visualization Placeholder */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">
            {metricsConfig.categories.find(c => c.id === selectedMetric)?.label || 'Overview'} - {getDateRangeLabel()}
          </h3>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <BarChart3 className="w-5 h-5 text-slate-600" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <PieChart className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Simulated Chart Area */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 border-2 border-dashed border-blue-200">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-blue-900 mb-2">Interactive Chart Visualization</h4>
            <p className="text-sm text-blue-700 mb-4">
              Real-time data visualization for {metricsConfig.categories.find(c => c.id === selectedMetric)?.label.toLowerCase()}
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/50 rounded-lg p-4">
                <div className="h-24 bg-blue-200 rounded mb-2"></div>
                <p className="text-xs font-medium text-blue-800">Week 1</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <div className="h-32 bg-blue-300 rounded mb-2"></div>
                <p className="text-xs font-medium text-blue-800">Week 2</p>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <div className="h-40 bg-blue-400 rounded mb-2"></div>
                <p className="text-xs font-medium text-blue-800">Week 3</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity / Detailed Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Detailed Report Data</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All Records →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Metric</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Value</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Change</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-600">Nov {20 + row}, 2025</td>
                  <td className="py-3 px-4 text-slate-900 font-medium">
                    {metricsConfig.stats[row % metricsConfig.stats.length].label}
                  </td>
                  <td className="py-3 px-4 text-slate-900 font-semibold">
                    {metricsConfig.stats[row % metricsConfig.stats.length].value}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 ${row % 3 === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {row % 3 === 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {row % 3 === 0 ? '+' : '-'}{5 + row}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      row % 2 === 0 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {row % 2 === 0 ? 'Normal' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NDISE Connection Status */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">
              Connected to NDISE National Registry
            </p>
            <p className="text-xs text-slate-600">
              All reports generated from real-time centralized data • Last sync: Just now
            </p>
          </div>
          <Activity className="w-5 h-5 text-blue-600" />
        </div>
      </div>
    </div>
  );
}
