export type Employee = {
  id: string;
  name: string;
  email: string;
  position: string;
  avatar: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // Employee ID
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
};
