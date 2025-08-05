import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { employees, tasks } from "@/lib/data";
import { Users, ClipboardList, AlertTriangle, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardPage() {
  const recentTasks = tasks.slice(0, 5);
  const employeeMap = new Map(employees.map(e => [e.id, e]));

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">Currently active in your team</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length}
            </div>
            <p className="text-xs text-muted-foreground">Tasks requiring action</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter(t => t.status === 'Completed').length}
            </div>
            <p className="text-xs text-muted-foreground">Successfully finished tasks</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
          <CardDescription>A quick look at the most recently assigned tasks.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTasks.map((task) => {
                const employee = employeeMap.get(task.assignedTo);
                return (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="profile picture" alt={employee?.name} />
                            <AvatarFallback>{employee?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{employee?.name ?? 'Unassigned'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={task.status === 'Completed' ? 'default' : 'secondary'} className={
                        task.status === 'Completed' ? 'bg-green-500/20 text-green-700' : 
                        task.status === 'In Progress' ? 'bg-blue-500/20 text-blue-700' : 'bg-yellow-500/20 text-yellow-700'
                      }>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
