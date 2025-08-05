import type { Employee, Task } from './types';

export const employees: Employee[] = [
  { id: 'emp-001', name: 'Alice Johnson', email: 'alice.j@example.com', position: 'Frontend Developer', avatar: '/avatars/01.png' },
  { id: 'emp-002', name: 'Bob Williams', email: 'bob.w@example.com', position: 'Backend Developer', avatar: '/avatars/02.png' },
  { id: 'emp-003', name: 'Charlie Brown', email: 'charlie.b@example.com', position: 'UI/UX Designer', avatar: '/avatars/03.png' },
  { id: 'emp-004', name: 'Diana Miller', email: 'diana.m@example.com', position: 'Project Manager', avatar: '/avatars/04.png' },
  { id: 'emp-005', name: 'Ethan Davis', email: 'ethan.d@example.com', position: 'QA Tester', avatar: '/avatars/05.png' },
];

export const tasks: Task[] = [
  { id: 'task-01', title: 'Develop landing page', description: 'Create a responsive and visually appealing landing page based on the new design.', assignedTo: 'emp-001', dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0], status: 'In Progress' },
  { id: 'task-02', title: 'Setup database schema', description: 'Define and implement the MongoDB schema for users and tasks.', assignedTo: 'emp-002', dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0], status: 'In Progress' },
  { id: 'task-03', title: 'Design user dashboard mockups', description: 'Create high-fidelity mockups for the employer and employee dashboards.', assignedTo: 'emp-003', dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0], status: 'Completed' },
  { id: 'task-04', title: 'Plan project sprint 2', description: 'Outline the tasks and timeline for the upcoming development sprint.', assignedTo: 'emp-004', dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0], status: 'Pending' },
  { id: 'task-05', title: 'Test authentication flow', description: 'Perform end-to-end testing of the user signup and login functionality.', assignedTo: 'emp-005', dueDate: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString().split('T')[0], status: 'Pending' },
  { id: 'task-06', title: 'Fix navigation bar bug', description: 'The dropdown menu on the main navigation is not working on mobile devices.', assignedTo: 'emp-001', dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], status: 'Pending' },
];
