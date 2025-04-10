
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Cpu, AlertCircle, CheckCircle2, Clock, UserCheck } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  increasing?: boolean;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, increasing, icon, color }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline mt-1">
              <h3 className="text-2xl font-bold">{value}</h3>
              {change && (
                <p className={`ml-2 text-sm font-medium ${increasing ? 'text-green-600' : 'text-red-600'}`}>
                  {increasing ? '+' : '-'}{change}
                </p>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const StatsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <StatCard
        title="Total Assets"
        value="246"
        change="3.6%"
        increasing={true}
        icon={<Monitor className="h-6 w-6 text-white" />}
        color="bg-blue-500"
      />
      <StatCard
        title="Components"
        value="1,249"
        change="2.4%"
        increasing={true}
        icon={<Cpu className="h-6 w-6 text-white" />}
        color="bg-indigo-500"
      />
      <StatCard
        title="Pending Issues"
        value="12"
        change="8%"
        increasing={false}
        icon={<AlertCircle className="h-6 w-6 text-white" />}
        color="bg-amber-500"
      />
      <StatCard
        title="Active Users"
        value="185"
        change="1.2%"
        increasing={true}
        icon={<UserCheck className="h-6 w-6 text-white" />}
        color="bg-emerald-500"
      />
      <StatCard
        title="Due Maintenance"
        value="8"
        icon={<Clock className="h-6 w-6 text-white" />}
        color="bg-red-500"
      />
      <StatCard
        title="Maintenance Complete"
        value="32"
        change="12%"
        increasing={true}
        icon={<CheckCircle2 className="h-6 w-6 text-white" />}
        color="bg-green-500"
      />
    </div>
  );
};
