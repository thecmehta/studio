"use client"; 

import React, { useState, useEffect } from 'react';
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Users, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoadingTasks(true);
      try {
        const response = await fetch('/api/tasks');
        const data = await response.json();
        console.log(data.tasks);
        if (data.success) {
          setTasks(data.tasks);
        } else {
          setError(data.error || 'Failed to fetch tasks');
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setError('Failed to fetch tasks');
      } finally {
        setIsLoadingTasks(false);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoadingEmployees(true);
      try {
        // Changed from /api/signup to /api/users
        const response = await fetch('/api/users');
        const data = await response.json();
        console.log(data.users);
        if (data.success) {
          setEmployees(data.users);
        } else {
          if (response.status === 401) {
            setError('Please login to access this page');
            router.push('/login');
          } else {
            setError(data.error || 'Failed to fetch employees');
          }
        }
      } catch (error) {
        console.error("Failed to fetch employees:", error);
        setError('Failed to fetch employees');
      } finally {
        setIsLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, [router]);

  const handleNavigateToAddTask = () => {
    router.push('/dashboard/manager/tasks/addtask');
  };

  const handleNavigateToAddEmployee = () => {
    router.push('/dashboard/manager/addEmploys');
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    // Optimistically update UI
    setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!data.success) {
        // Revert optimistic update on failure
        const refreshResponse = await fetch('/api/tasks');
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setTasks(refreshData.tasks);
        }
        alert("Failed to delete the task on the server.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      // Revert optimistic update on error
      const refreshResponse = await fetch('/api/tasks');
      const refreshData = await refreshResponse.json();
      if (refreshData.success) {
        setTasks(refreshData.tasks);
      }
      alert("An error occurred while deleting the task.");
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    // Optimistically update UI
    setEmployees(prevEmployees => prevEmployees.filter(employee => employee._id !== employeeId));

    try {
      const response = await fetch(`/api/users/${employeeId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!data.success) {
        // Revert optimistic update on failure
        const refreshResponse = await fetch('/api/users');
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setEmployees(refreshData.users);
        }
        alert(data.error || "Failed to delete the employee on the server.");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      // Revert optimistic update on error
      const refreshResponse = await fetch('/api/users');
      const refreshData = await refreshResponse.json();
      if (refreshData.success) {
        setEmployees(refreshData.users);
      }
      alert("An error occurred while deleting the employee.");
    }
  };

  // Helper function to get employee name from assignedTo field
  const getEmployeeName = (assignedTo) => {
    // If assignedTo is an email, return it
    if (assignedTo && assignedTo.includes('@')) {
      return assignedTo;
    }
    
    // If it's a user ID, try to find the employee
    const employee = employees.find(emp => emp._id === assignedTo || emp.email === assignedTo);
    return employee ? employee.email : assignedTo || 'Unknown';
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Task Management Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Task Management</CardTitle>
              <CardDescription>Assign and track tasks for your team.</CardDescription>
            </div>
            <Button size="sm" className="gap-1" onClick={handleNavigateToAddTask}>
              <PlusCircle className="h-4 w-4" />
              Assign Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingTasks ? (
            <div className="flex justify-center py-8">
              <div className="text-muted-foreground">Loading tasks...</div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex justify-center py-8">
              <div className="text-muted-foreground">No tasks found</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => {
                  const employeeName = getEmployeeName(task.assignedTo);
                  return (
                    <TableRow key={task._id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{task.title}</div>
                          {task.description && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {task.description.length > 50 
                                ? task.description.substring(0, 50) + '...'
                                : task.description
                              }
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={``} alt={employeeName} />
                            <AvatarFallback>
                              {employeeName?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span>{employeeName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          task.status === 'completed' ? 'default' :
                          task.status === 'in-progress' ? 'secondary' :
                          'outline'
                        }>
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          task.priority === 'high' ? 'destructive' :
                          task.priority === 'medium' ? 'default' :
                          'secondary'
                        }>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                      </TableCell>
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
                            <DropdownMenuItem
                              onClick={() => handleDeleteTask(task._id)}
                              className="text-destructive"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Employee Management Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Employee Management</CardTitle>
              <CardDescription>Manage your team members and their access.</CardDescription>
            </div>
            <Button size="sm" className="gap-1" onClick={handleNavigateToAddEmployee}>
              <Users className="h-4 w-4" />
              Add Employee
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingEmployees ? (
            <div className="flex justify-center py-8">
              <div className="text-muted-foreground">Loading employees...</div>
            </div>
          ) : employees.length === 0 ? (
            <div className="flex justify-center py-8">
              <div className="text-muted-foreground">No employees found</div>
            </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Company ID</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={``} alt={employee.name} />
                          <AvatarFallback>{employee.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{employee.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>
                      <Badge variant={employee.role === 'mngr' ? 'default' : 'secondary'}>
                        {employee.role === 'mngr' ? 'Manager' : 'Employee'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{employee.cid}</span>
                    </TableCell>
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
                          <DropdownMenuItem>Edit Employee</DropdownMenuItem>
                          <DropdownMenuItem>Reset Password</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteEmployee(employee._id)}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}