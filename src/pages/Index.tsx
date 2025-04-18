
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { StatsCards } from '@/components/Dashboard/StatsCards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useAssets } from '@/hooks/useSupabaseData';

const Index = () => {
  const { data: assets = [] } = useAssets();

  // Asset status distribution for pie chart
  const statusData = [
    { name: 'In Use', value: assets.filter(a => a.status === 'In Use').length },
    { name: 'Available', value: assets.filter(a => a.status === 'Available').length },
    { name: 'In Maintenance', value: assets.filter(a => a.status === 'In Maintenance').length },
    { name: 'Retired', value: assets.filter(a => a.status === 'Retired').length },
  ];

  // Colors for pie chart
  const COLORS = ['#3B82F6', '#10B981', '#F97316', '#6B7280'];

  // Assets due for maintenance (those without last maintenance or maintenance older than 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const assetsDue = assets
    .filter(asset => 
      !asset.last_maintenance || new Date(asset.last_maintenance) < sixMonthsAgo
    )
    .slice(0, 5);

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
                      <p className="text-sm">Last: {asset.last_maintenance ? new Date(asset.last_maintenance).toLocaleDateString() : 'Never'}</p>
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
