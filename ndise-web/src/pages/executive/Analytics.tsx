import { useState } from 'react';
import {
  BarChart2,
  TrendingUp,
  Users,
  Globe,
  Shield,
  Activity,
  Calendar,
  ArrowUp,
  ArrowDown,
  Download,
  Filter,
  RefreshCw,
} from 'lucide-react';

interface MetricCard {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: any;
  color: string;
}

interface ChartDataPoint {
  label: string;
  value: number;
  percentage?: number;
}

interface TimeSeriesData {
  date: string;
  enrollments: number;
  verifications: number;
  borderCrossings: number;
  alerts: number;
}

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d');
  const [selectedView, setSelectedView] = useState<'overview' | 'enrollment' | 'border' | 'security'>('overview');

  // Key Metrics
  const metrics: MetricCard[] = [
    {
      label: 'Total Enrollments',
      value: '2,847,392',
      change: 12.5,
      trend: 'up',
      icon: Users,
      color: 'blue',
    },
    {
      label: 'Active IDs',
      value: '2,695,441',
      change: 8.3,
      trend: 'up',
      icon: Shield,
      color: 'green',
    },
    {
      label: 'Border Crossings',
      value: '156,834',
      change: -3.2,
      trend: 'down',
      icon: Globe,
      color: 'purple',
    },
    {
      label: 'Verifications/Day',
      value: '42,891',
      change: 15.7,
      trend: 'up',
      icon: Activity,
      color: 'orange',
    },
    {
      label: 'Security Alerts',
      value: '1,247',
      change: -18.4,
      trend: 'down',
      icon: Shield,
      color: 'red',
    },
    {
      label: 'System Uptime',
      value: '99.97%',
      change: 0.02,
      trend: 'up',
      icon: Activity,
      color: 'green',
    },
  ];

  // Time Series Data (Last 30 days)
  const timeSeriesData: TimeSeriesData[] = [
    { date: '2024-01-01', enrollments: 1250, verifications: 38500, borderCrossings: 5200, alerts: 45 },
    { date: '2024-01-02', enrollments: 1180, verifications: 39200, borderCrossings: 5100, alerts: 52 },
    { date: '2024-01-03', enrollments: 1420, verifications: 41000, borderCrossings: 5400, alerts: 38 },
    { date: '2024-01-04', enrollments: 1350, verifications: 40200, borderCrossings: 5300, alerts: 41 },
    { date: '2024-01-05', enrollments: 1510, verifications: 42800, borderCrossings: 5600, alerts: 47 },
    { date: '2024-01-06', enrollments: 890, verifications: 35200, borderCrossings: 4800, alerts: 33 },
    { date: '2024-01-07', enrollments: 920, verifications: 36100, borderCrossings: 4900, alerts: 29 },
    { date: '2024-01-08', enrollments: 1380, verifications: 40800, borderCrossings: 5500, alerts: 44 },
    { date: '2024-01-09', enrollments: 1440, verifications: 41500, borderCrossings: 5700, alerts: 51 },
    { date: '2024-01-10', enrollments: 1290, verifications: 39800, borderCrossings: 5200, alerts: 39 },
  ];

  // Enrollment by County
  const enrollmentByCounty: ChartDataPoint[] = [
    { label: 'Montserrado', value: 845231, percentage: 29.7 },
    { label: 'Nimba', value: 412389, percentage: 14.5 },
    { label: 'Bong', value: 356892, percentage: 12.5 },
    { label: 'Grand Bassa', value: 298745, percentage: 10.5 },
    { label: 'Lofa', value: 267431, percentage: 9.4 },
    { label: 'Margibi', value: 198234, percentage: 7.0 },
    { label: 'Grand Gedeh', value: 156782, percentage: 5.5 },
    { label: 'Maryland', value: 134567, percentage: 4.7 },
    { label: 'Others', value: 177121, percentage: 6.2 },
  ];

  // Age Demographics
  const ageDemographics: ChartDataPoint[] = [
    { label: '0-17', value: 892341, percentage: 31.3 },
    { label: '18-30', value: 1045672, percentage: 36.7 },
    { label: '31-45', value: 567234, percentage: 19.9 },
    { label: '46-60', value: 245890, percentage: 8.6 },
    { label: '60+', value: 96255, percentage: 3.5 },
  ];

  // Verification Methods
  const verificationMethods: ChartDataPoint[] = [
    { label: 'Fingerprint', value: 658234, percentage: 45.2 },
    { label: 'Facial Recognition', value: 512890, percentage: 35.2 },
    { label: 'ID Card Scan', value: 198456, percentage: 13.6 },
    { label: 'Manual Entry', value: 87245, percentage: 6.0 },
  ];

  // Risk Level Distribution
  const riskDistribution: ChartDataPoint[] = [
    { label: 'Low Risk', value: 2645891, percentage: 92.9 },
    { label: 'Medium Risk', value: 156234, percentage: 5.5 },
    { label: 'High Risk', value: 38456, percentage: 1.4 },
    { label: 'Critical', value: 6811, percentage: 0.2 },
  ];

  // Border Crossing Trends by Checkpoint
  const borderCheckpoints: ChartDataPoint[] = [
    { label: 'Roberts Intl Airport', value: 68234, percentage: 43.5 },
    { label: 'Ganta Border', value: 34567, percentage: 22.0 },
    { label: 'Bo Waterside', value: 28456, percentage: 18.1 },
    { label: 'Foya Crossing', value: 15890, percentage: 10.1 },
    { label: 'Harper Seaport', value: 9687, percentage: 6.3 },
  ];

  const getMetricColor = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-600' },
      green: { bg: 'bg-green-50', text: 'text-green-700', icon: 'text-green-600' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-600' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'text-orange-600' },
      red: { bg: 'bg-red-50', text: 'text-red-700', icon: 'text-red-600' },
    };
    return colors[color] || colors.blue;
  };

  const renderBarChart = (data: ChartDataPoint[], color: string) => {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700 font-medium">{item.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-slate-600">{item.value.toLocaleString()}</span>
                <span className="text-slate-500 text-xs w-12 text-right">{item.percentage?.toFixed(1)}%</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${color}`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTimeSeriesChart = () => {
    const maxValue = Math.max(...timeSeriesData.map(d => d.enrollments));

    return (
      <div className="space-y-4">
        <div className="flex items-end justify-between h-48 gap-1">
          {timeSeriesData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="flex-1 w-full flex items-end">
                <div
                  className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                  style={{ height: `${(item.enrollments / maxValue) * 100}%` }}
                  title={`${item.date}: ${item.enrollments.toLocaleString()}`}
                />
              </div>
              <span className="text-xs text-slate-500 rotate-45 origin-top-left mt-4">
                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">System Analytics</h1>
          <p className="text-slate-600 mt-1">Deep dive into NDISE data and trends</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-slate-600" />
        <span className="text-sm font-medium text-slate-700">Time Period:</span>
        <div className="flex gap-1">
          {[
            { value: '7d', label: 'Last 7 Days' },
            { value: '30d', label: 'Last 30 Days' },
            { value: '90d', label: 'Last 90 Days' },
            { value: '1y', label: 'Last Year' },
            { value: 'all', label: 'All Time' },
          ].map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value as any)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                selectedPeriod === period.value
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const colors = getMetricColor(metric.color);
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? ArrowUp : ArrowDown;

          return (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600">{metric.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{metric.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendIcon
                      className={`w-4 h-4 ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        metric.trend === 'up' ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {Math.abs(metric.change)}%
                    </span>
                    <span className="text-sm text-slate-500">vs last period</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${colors.bg}`}>
                  <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View Selector */}
      <div className="flex gap-2 border-b border-slate-200">
        {[
          { value: 'overview', label: 'Overview', icon: BarChart2 },
          { value: 'enrollment', label: 'Enrollment', icon: Users },
          { value: 'border', label: 'Border Control', icon: Globe },
          { value: 'security', label: 'Security', icon: Shield },
        ].map((view) => {
          const Icon = view.icon;
          return (
            <button
              key={view.value}
              onClick={() => setSelectedView(view.value as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                selectedView === view.value
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {view.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {selectedView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enrollment Trends */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Enrollment Trends</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            {renderTimeSeriesChart()}
          </div>

          {/* Risk Level Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Risk Level Distribution</h3>
            {renderBarChart(riskDistribution, 'bg-gradient-to-r from-green-500 via-yellow-500 to-red-500')}
          </div>

          {/* Verification Methods */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Verification Methods</h3>
            {renderBarChart(verificationMethods, 'bg-purple-500')}
          </div>

          {/* Border Checkpoints */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Border Crossings by Checkpoint</h3>
            {renderBarChart(borderCheckpoints, 'bg-blue-500')}
          </div>
        </div>
      )}

      {/* Enrollment Tab */}
      {selectedView === 'enrollment' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enrollment by County */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Enrollment by County</h3>
            {renderBarChart(enrollmentByCounty, 'bg-blue-500')}
          </div>

          {/* Age Demographics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Age Demographics</h3>
            {renderBarChart(ageDemographics, 'bg-green-500')}
          </div>

          {/* Enrollment Rate by Month */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 lg:col-span-2">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Monthly Enrollment Rate</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { month: 'January', count: 38945, change: 12.3 },
                { month: 'February', count: 41234, change: 5.9 },
                { month: 'March', count: 39567, change: -4.0 },
                { month: 'April', count: 42891, change: 8.4 },
                { month: 'May', count: 45123, change: 5.2 },
                { month: 'June', count: 43678, change: -3.2 },
                { month: 'July', count: 46234, change: 5.9 },
                { month: 'August', count: 44567, change: -3.6 },
              ].map((item, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm font-medium text-slate-600">{item.month}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{item.count.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {item.change >= 0 ? (
                      <ArrowUp className="w-3 h-3 text-green-600" />
                    ) : (
                      <ArrowDown className="w-3 h-3 text-red-600" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        item.change >= 0 ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {Math.abs(item.change)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Border Control Tab */}
      {selectedView === 'border' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Border Crossings Trend */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 lg:col-span-2">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Border Crossings Over Time</h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {timeSeriesData.map((item, index) => {
                const maxCrossings = Math.max(...timeSeriesData.map(d => d.borderCrossings));
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="flex-1 w-full flex items-end">
                      <div
                        className="w-full bg-purple-500 rounded-t hover:bg-purple-600 transition-colors cursor-pointer"
                        style={{ height: `${(item.borderCrossings / maxCrossings) * 100}%` }}
                        title={`${item.date}: ${item.borderCrossings.toLocaleString()}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checkpoint Activity */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Checkpoint Activity</h3>
            {renderBarChart(borderCheckpoints, 'bg-purple-500')}
          </div>

          {/* Visa Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Visa Applications</h3>
            {renderBarChart(
              [
                { label: 'Approved', value: 8945, percentage: 68.5 },
                { label: 'Pending', value: 2834, percentage: 21.7 },
                { label: 'Under Review', value: 892, percentage: 6.8 },
                { label: 'Rejected', value: 389, percentage: 3.0 },
              ],
              'bg-blue-500'
            )}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {selectedView === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alert Trends */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 lg:col-span-2">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Security Alerts Trend</h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {timeSeriesData.map((item, index) => {
                const maxAlerts = Math.max(...timeSeriesData.map(d => d.alerts));
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="flex-1 w-full flex items-end">
                      <div
                        className="w-full bg-red-500 rounded-t hover:bg-red-600 transition-colors cursor-pointer"
                        style={{ height: `${(item.alerts / maxAlerts) * 100}%` }}
                        title={`${item.date}: ${item.alerts} alerts`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Risk Level Distribution</h3>
            {renderBarChart(riskDistribution, 'bg-gradient-to-r from-green-500 via-yellow-500 to-red-500')}
          </div>

          {/* Alert Types */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Alert Types</h3>
            {renderBarChart(
              [
                { label: 'Watchlist Match', value: 456, percentage: 36.6 },
                { label: 'Document Fraud', value: 312, percentage: 25.0 },
                { label: 'Identity Mismatch', value: 234, percentage: 18.8 },
                { label: 'Border Violation', value: 156, percentage: 12.5 },
                { label: 'Other', value: 89, percentage: 7.1 },
              ],
              'bg-red-500'
            )}
          </div>

          {/* Watchlist Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 lg:col-span-2">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Watchlist Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Entries', value: '8,456', color: 'blue' },
                { label: 'Active', value: '7,234', color: 'green' },
                { label: 'Critical Risk', value: '892', color: 'red' },
                { label: 'Recent Matches', value: '156', color: 'orange' },
              ].map((stat, index) => {
                const colors = getMetricColor(stat.color);
                return (
                  <div key={index} className={`p-4 rounded-lg ${colors.bg}`}>
                    <p className={`text-sm font-medium ${colors.text}`}>{stat.label}</p>
                    <p className={`text-2xl font-bold ${colors.text} mt-1`}>{stat.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
