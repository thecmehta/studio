'use client';

import { useRouter } from "next/navigation"; 
import React, { useState, useEffect } from 'react';

export default function TaskCreationForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignTo: '',
  });
  const [employees, setEmployees] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const router = useRouter();

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoadingEmployees(true);
      try {
        const response = await fetch('/api/signup');
        const data = await response.json();
        console.log('Fetched employees:', data);
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

  const backToDashboard = () => {
    console.log("Done Button Clicked - navigating to /addtask");
    try {
      router.push('../');
      console.log("Navigation to /dashboard initiated successfully");
    } catch (error) {
      console.error("Error navigating to add task page:", error);
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    // Client-side validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.assignTo.trim()) {
      setMessage('Title, description, and assignTo are required fields');
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }
    
    try {
      const requestBody = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        assignTo: formData.assignTo.trim(),
        ...(formData.dueDate && { dueDate: formData.dueDate })
      };

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message || 'Task created successfully!');
        setIsSuccess(true);
        // Reset form
        setFormData({
          title: '',
          description: '',
          assignTo: ''
        });
      } else {
        setMessage(data.error || 'Failed to create task');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Network error: Unable to create task');
      setIsSuccess(false);
      console.error('Frontend error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearForm = () => {
    setFormData({
      title: '',
      description: '',
      assignTo: ''
    });
    setMessage('');
  };

  const isFormValid = formData.title.trim() && formData.description.trim() && formData.assignTo.trim();

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
       <div>
          <button
  type="button"
  onClick={backToDashboard}
  className="inline-flex items-center gap-2 px-2 py-2 rounded-lg border border-gray-300 bg-gradient-to-r from-white to-gray-100 text-gray-800 font-medium shadow-sm hover:shadow-md hover:from-gray-100 hover:to-white hover:text-black transition-all duration-200"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
  Dashboard
</button>

          </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create New Task</h2>
      
      <div className="space-y-4">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter task title"
            maxLength={100}
          />
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            placeholder="Enter task description"
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.description.length}/500 characters
          </div>
        </div>

        {/* Assign To Field - Now a Dropdown */}
        <div>
          <label htmlFor="assignTo" className="block text-sm font-medium text-gray-700 mb-1">
            Assign To *
          </label>
          {isLoadingEmployees ? (
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
              Loading employees...
            </div>
          ) : employees.length === 0 ? (
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
              No employees available
            </div>
          ) : (
            <select
              id="assignTo"
              name="assignTo"
              value={formData.assignTo}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select an employee</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee.email}>
                  {employee.email}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading || employees.length === 0}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
              isFormValid && !isLoading && employees.length > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : (
              'Create Task'
            )}
          </button>
          
          <button
            type="button"
            onClick={handleClearForm}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            Clear
          </button>
        </div>
        
      </div>
         
      {/* Message Display */}
      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          isSuccess 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {isSuccess ? (
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Info */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Fields marked with * are required
      </div>
    </div>
  );
}