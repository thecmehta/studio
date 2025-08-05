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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { employees, tasks } from "@/lib/data";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function TasksPage() {
  const employeeMap = new Map(employees.map(e => [e.id, e]));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Task Management</CardTitle>
            <CardDescription>Assign and track tasks for your team.</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Assign Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign a New Task</DialogTitle>
                <DialogDescription>
                  Fill in the details below to assign a new task.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input id="title" placeholder="e.g., Design new logo" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Description
                  </Label>
                  <Textarea id="description" placeholder="Provide a detailed description of the task." className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="assignTo" className="text-right">
                    Assign To
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select an employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dueDate" className="text-right">
                    Due Date
                  </Label>
                  <Input id="dueDate" type="date" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Assign Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => {
              const employee = employeeMap.get(task.assignedTo);
              return (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="profile picture" alt={employee?.name} />
                        <AvatarFallback>{employee?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{employee?.name ?? 'Unassigned'}</span>
                    </div>
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
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
                        <DropdownMenuItem>Edit Task</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
