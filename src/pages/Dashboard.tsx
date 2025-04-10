
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Users, Wrench, Cpu } from "lucide-react";

const statsCards = [
  { title: "Total Assets", value: "145", icon: Monitor, description: "Across all categories" },
  { title: "Total Users", value: "48", icon: Users, description: "Assigned to assets" },
  { title: "Pending Maintenance", value: "12", icon: Wrench, description: "Tickets to be resolved" },
  { title: "Components", value: "358", icon: Cpu, description: "In inventory" }
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of IT inventory and maintenance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
              <card.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Assets</CardTitle>
            <CardDescription>Recently added hardware and software</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No assets found</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Status</CardTitle>
            <CardDescription>Overview of maintenance tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No maintenance data found</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
