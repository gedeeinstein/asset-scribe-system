
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { StatsCards } from '@/components/Dashboard/StatsCards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { assets, maintenance } from '@/lib/data';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Index = () => {
  // Asset status distribution for pie chart
  const statusData = [
    { name: 'In Use', value: assets.filter(a => a.status === 'In Use').length },
    { name: 'Available', value: assets.filter(a => a.status === 'Available').length },
    { name: 'In Maintenance', value: assets.filter(a => a.status === 'In Maintenance').length },
    { name: 'Retired', value: assets.filter(a => a.status === 'Retired').length },
  ];

  // Maintenance status for bar chart
  const maintenanceData = [
    { name: 'Scheduled', value: maintenance.filter(m => m.status === 'Scheduled').length },
    { name: 'In Progress', value: maintenance.filter(m => m.status === 'In Progress').length },
    { name: 'Completed', value: maintenance.filter(m => m.status === 'Completed').length },
    { name: 'Cancelled', value: maintenance.filter(m => m.status === 'Cancelled').length },
  ];

  // Colors for pie chart
  const COLORS = ['#3B82F6', '#10B981', '#F97316', '#6B7280'];

  // Recent maintenance
  const recentMaintenance = [...maintenance].sort((a, b) => 
    new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
  ).slice(0, 5);

  // Assets due for maintenance (dummy calculation - those without last maintenance or maintenance older than 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const assetsDue = assets.filter(asset => 
    !asset.lastMaintenance || new Date(asset.lastMaintenance) < sixMonthsAgo
  ).slice(0, 5);

  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">
        <StatsCards />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Asset Status</CardTitle>
              <CardDescription>Distribution of assets by current status</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} assets`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Status</CardTitle>
              <CardDescription>Current maintenance tasks by status</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={maintenanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Tasks" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Maintenance</CardTitle>
              <CardDescription>Latest maintenance activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMaintenance.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{item.assetName}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{new Date(item.scheduledDate).toLocaleDateString()}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        item.status === 'Scheduled' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assets Due for Maintenance</CardTitle>
              <CardDescription>Assets that require attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assetsDue.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-sm text-muted-foreground">{asset.category} - {asset.division || 'Unassigned'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Last: {asset.lastMaintenance ? new Date(asset.lastMaintenance).toLocaleDateString() : 'Never'}</p>
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                        Due
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
