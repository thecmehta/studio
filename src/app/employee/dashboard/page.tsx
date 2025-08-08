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
import { tasks } from "@/lib/data";


export default function EmployeeDashboardPage() {
  const myTasks = tasks.filter(task => task.assignedTo === LOGGED_IN_EMPLOYEE_ID);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome, Alice!</CardTitle>
        <CardDescription>Here are the tasks currently assigned to you. Let&apos;s get to work!</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myTasks.length > 0 ? (
              myTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-muted-foreground hidden md:inline">{task.description}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={task.status === 'Completed' ? 'default' : 'secondary'} className={
                      task.status === 'Completed' ? 'bg-green-500/20 text-green-700 hover:bg-green-500/30' : 
                      task.status === 'In Progress' ? 'bg-blue-500/20 text-blue-700 hover:bg-blue-500/30' : 'bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30'
                    }>
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  You have no assigned tasks. Great job!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
