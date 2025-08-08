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
import { MoreHorizontal, PlusCircle, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from 'next/navigation';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
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
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
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
        const response = await fetch('/api/signup');
        const data = await response.json();
        console.log(data.users);
        if (data.success) {
          setEmployees(data.users);
        }
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      } finally {
        setIsLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleNavigateToAddTask = () => {
    router.push('/dashboard/tasks/addtask');
  };

  const handleNavigateToAddEmployee = () => {
    router.push('/dashboard/addEmploys');
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!data.success) {
        alert("Failed to delete the task on the server.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("An error occurred while deleting the task.");
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    setEmployees(prevEmployees => prevEmployees.filter(employee => employee._id !== employeeId));

    try {
      const response = await fetch(`/api/users/${employeeId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!data.success) {
        alert("Failed to delete the employee on the server.");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("An error occurred while deleting the employee.");
    }
  };

  const maskPassword = (password) => {
    if (!password) return '••••••••';
    return '••••••••';
  };

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
            <div>Loading tasks...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={``} alt={task.assignTo?.email} />
                          <AvatarFallback>{task.assignTo?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span>{task.assignTo}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{task.status}</Badge>
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
                ))}
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
            <div>Loading employees...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                
                  <TableHead>Role</TableHead>
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
                          <AvatarImage src={``} alt={employee.email} />
                          <AvatarFallback>{employee.email?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{employee.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{employee.role}</Badge>
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