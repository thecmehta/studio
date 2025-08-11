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
import { MoreHorizontal, PlusCircle, Users, AlertCircle, FileText } from "lucide-react";
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


  // Helper function to refresh tasks
  const refreshTasks = async () => {
    try {
      const refreshResponse = await fetch('/api/tasks');
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        console.log('Refresh tasks data:', refreshData);
       
        if (refreshData.success) {
          // Handle nested structure (with pagination)
          if (refreshData.data && Array.isArray(refreshData.data.tasks)) {
            setTasks(refreshData.data.tasks);
          }
          // Handle direct structure (fallback)
          else if (Array.isArray(refreshData.tasks)) {
            setTasks(refreshData.tasks);
          }
          // Handle empty or unexpected structure
          else {
            console.log('No tasks in refresh response');
            setTasks([]);
          }
        } else {
          console.warn('Refresh API returned success: false');
          setTasks([]);
        }
      } else {
        console.error('Refresh response not ok:', refreshResponse.status);
        setTasks([]);
      }
    } catch (refreshError) {
      console.error("Error refreshing tasks:", refreshError);
      setTasks([]);
    }
  };


  // Helper function to refresh employees
  const refreshEmployees = async () => {
    try {
      const refreshResponse = await fetch('/api/users');
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        console.log('Refresh employees data:', refreshData);
       
        if (refreshData.success) {
          // Handle nested structure
          if (refreshData.data && Array.isArray(refreshData.data.users)) {
            setEmployees(refreshData.data.users);
          }
          // Handle direct structure (fallback)
          else if (Array.isArray(refreshData.users)) {
            setEmployees(refreshData.users);
          }
          // Handle empty or unexpected structure
          else {
            console.log('No employees in refresh response');
            setEmployees([]);
          }
        } else {
          console.warn('Refresh employees API returned success: false');
          setEmployees([]);
        }
      } else {
        console.error('Refresh employees response not ok:', refreshResponse.status);
        setEmployees([]);
      }
    } catch (refreshError) {
      console.error("Error refreshing employees:", refreshError);
      setEmployees([]);
    }
  };


  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoadingTasks(true);
      setError(''); // Clear any previous errors
     
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
       
        const data = await response.json();
        console.log('Tasks data:', data);
       
        if (data.success) {
          // Handle nested structure (with pagination)
          if (data.data && Array.isArray(data.data.tasks)) {
            setTasks(data.data.tasks);
            console.log('Set tasks from data.data.tasks:', data.data.tasks.length);
          }
          // Handle direct structure (fallback)
          else if (Array.isArray(data.tasks)) {
            setTasks(data.tasks);
            console.log('Set tasks from data.tasks:', data.tasks.length);
          }
          // Handle empty or unexpected structure
          else {
            console.log('No tasks found or unexpected structure, setting empty array');
            setTasks([]);
          }
        } else {
          console.warn('API returned success: false:', data);
          setTasks([]);
          setError(data.error || 'Failed to fetch tasks');
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setError(`Failed to fetch tasks: ${error.message}`);
        setTasks([]);
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
        const response = await fetch('/api/users');
        console.log(response)
        if (!response.ok) {
          if (response.status === 401) {
            setError('Please login to access this page');
            router.push('/login');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
       
        const data = await response.json();
        console.log('Employees data:', data);
       
        if (data.success) {
          // Handle nested structure
          if (data.data && Array.isArray(data.data.users)) {
            setEmployees(data.data.users);
          }
          // Handle direct structure (fallback)
          else if (Array.isArray(data.users)) {
            setEmployees(data.users);
          }
          // Handle empty or unexpected structure
          else {
            console.log('No employees found or unexpected structure');
            setEmployees([]);
          }
        } else {
          console.warn('Employees API returned success: false:', data);
          setEmployees([]);
          if (!error) { // Don't overwrite existing errors
            setError(data.error || 'Failed to fetch employees');
          }
        }
      } catch (error) {
        console.error("Failed to fetch employees:", error);
        setEmployees([]);
        if (!error) { // Don't overwrite existing errors
          setError(`Failed to fetch employees: ${error.message}`);
        }
      } finally {
        setIsLoadingEmployees(false);
      }
    };


    fetchEmployees();
  }, [router, error]); // Added error to dependencies to prevent overwriting


  const handleNavigateToAddTask = () => {
    router.push('/dashboard/manager/tasks/addtask');
  };


  const handleNavigateToAddEmployee = () => {
    router.push('/dashboard/manager/addEmploys');
  };


  const handleDeleteTask = async (taskId) => {
    if (!taskId) {
      console.error('No task ID provided for deletion');
      return;
    }


    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }


    // Optimistically update UI
    const previousTasks = tasks;
    setTasks(prevTasks => (Array.isArray(prevTasks) ? prevTasks.filter(task => task._id !== taskId) : []));


    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
     
      const data = await response.json();
      console.log('Delete response:', data);
     
      if (!response.ok || !data.success) {
        // Revert optimistic update on failure
        setTasks(previousTasks);
        alert(data.error || "Failed to delete the task on the server.");
      } else {
        console.log('Task deleted successfully');
        // Optionally refresh to ensure consistency
        await refreshTasks();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      // Revert optimistic update on error
      setTasks(previousTasks);
      alert("An error occurred while deleting the task.");
    }
  };


  const handleDeleteEmployee = async (employeeId) => {
    if (!employeeId) {
      console.error('No employee ID provided for deletion');
      return;
    }


    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }


    // Optimistically update UI
    const previousEmployees = employees;
    setEmployees(prevEmployees => (Array.isArray(prevEmployees) ? prevEmployees.filter(employee => employee._id !== employeeId) : []));


    try {
      const response = await fetch(`/api/users/${employeeId}`, {
        method: 'DELETE',
      });
     
      const data = await response.json();
      console.log('Delete employee response:', data);
     
      if (!response.ok || !data.success) {
        // Revert optimistic update on failure
        setEmployees(previousEmployees);
        alert(data.error || "Failed to delete the employee on the server.");
      } else {
        console.log('Employee deleted successfully');
        // Optionally refresh to ensure consistency
        await refreshEmployees();
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      // Revert optimistic update on error
      setEmployees(previousEmployees);
      alert("An error occurred while deleting the employee.");
    }
  };


  // Helper function to get employee name from assignedTo field
  const getEmployeeName = (assignedTo) => {
    // Safety check
    if (!assignedTo) return 'Unknown';
   
    // If assignedTo is an email, return it
    if (typeof assignedTo === 'string' && assignedTo.includes('@')) {
      return assignedTo;
    }
   
    // If it's a user ID, try to find the employee
    if (Array.isArray(employees) && employees.length > 0) {
      const employee = employees.find(emp => emp._id === assignedTo || emp.email === assignedTo);
      return employee ? (employee.name || employee.email) : assignedTo;
    }
   
    return assignedTo || 'Unknown';
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
          ) : !Array.isArray(tasks) || tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted/50 p-4 mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No tasks assigned yet</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                Get started by creating and assigning tasks to your team members.
              </p>
              <Button onClick={handleNavigateToAddTask} className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Create Your First Task
              </Button>
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
                {tasks.map((task, index) => {
                  const taskId = task?._id || `task-${index}`;
                  const employeeName = getEmployeeName(task?.assignedTo);
                 
                  return (
                    <TableRow key={taskId}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{task?.title || 'Untitled Task'}</div>
                          {task?.description && (
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
                          task?.status === 'completed' ? 'default' :
                          task?.status === 'in-progress' ? 'secondary' :
                          'outline'
                        }>
                          {task?.status || 'pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          task?.priority === 'high' ? 'destructive' :
                          task?.priority === 'medium' ? 'default' :
                          'secondary'
                        }>
                          {task?.priority || 'low'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {task?.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
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
                              onClick={() => handleDeleteTask(task?._id)}
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
          ) : !Array.isArray(employees) || employees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted/50 p-4 mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No employees found</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                Start building your team by adding employee accounts.
              </p>
              <Button onClick={handleNavigateToAddEmployee} className="gap-2">
                <Users className="h-4 w-4" />
                Add Your First Employee
              </Button>
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
                {employees.map((employee, index) => {
                  const employeeId = employee?._id || `employee-${index}`;
                 
                  return (
                    <TableRow key={employeeId}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={``} alt={employee?.name} />
                            <AvatarFallback>
                              {employee?.name?.charAt(0)?.toUpperCase() || employee?.email?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{employee?.name || 'Unknown'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{employee?.email || 'No email'}</TableCell>
                      <TableCell>
                        <Badge variant={employee?.role === 'mngr' ? 'default' : 'secondary'}>
                          {employee?.role === 'mngr' ? 'Manager' : 'Employee'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{employee?.cid || 'No ID'}</span>
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
                              onClick={() => handleDeleteEmployee(employee?._id)}
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
    </div>
  );
}

