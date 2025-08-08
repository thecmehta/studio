'use client';

import { useRouter } from "next/navigation"; 
import React, { useState } from 'react';

export default function EmployeeCreationForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: "emp",
  });
  const router = useRouter();
  
  const backToDashboard = () => {
    console.log("Back Button Clicked - navigating to dashboard");
    try {
      router.push('../dashboard');
      console.log("Navigation to dashboard initiated successfully");
    } catch (error) {
      console.error("Error navigating to dashboard:", error);
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

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation function
  const isValidPassword = (password) => {
    return password.length >= 6; // Minimum 6 characters
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    // Client-side validation
    if (!isValidEmail(formData.email)) {
      setMessage('Please enter a valid email address');
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    if (!isValidPassword(formData.password)) {
      setMessage('Password must be at least 6 characters long');
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }
    
    try {
      const requestBody = {
        email: formData.email.trim(),
        password: formData.password.trim(),
        role: formData.role.trim(),
      };

      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message || 'Employee added successfully!');
        setIsSuccess(true);
        // Reset form
        setFormData({
          email: '',
          password: '',
          role: 'emp'
        });
      } else {
        setMessage(data.error || 'Failed to add employee');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Network error: Unable to add employee');
      setIsSuccess(false);
      console.error('Frontend error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearForm = () => {
    setFormData({
      email: '',
      password: '',
      role: 'emp'
    });
    setMessage('');
  };

  const isFormValid = formData.email.trim() && formData.password.trim() && 
                     isValidEmail(formData.email) && isValidPassword(formData.password);

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <button
          type="button"
          onClick={backToDashboard}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-gradient-to-r from-white to-gray-100 text-gray-800 font-medium shadow-sm hover:shadow-md hover:from-gray-100 hover:to-white hover:text-black transition-all duration-200"
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
          Back to Dashboard
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Employee</h2>
      
      <div className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter employee email"
          />
          {formData.email && !isValidEmail(formData.email) && (
            <p className="text-xs text-red-500 mt-1">Please enter a valid email address</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter password (min. 6 characters)"
          />
          {formData.password && !isValidPassword(formData.password) && (
            <p className="text-xs text-red-500 mt-1">Password must be at least 6 characters long</p>
          )}
        </div>

        {/* Role Field (Read-only for now) */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-50 text-gray-600"
            readOnly
          />
          <p className="text-xs text-gray-500 mt-1">All new employees are assigned the 'emp' role by default</p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
              isFormValid && !isLoading
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
                Adding Employee...
              </span>
            ) : (
              'Add Employee'
            )}
          </button>
          
          <button
            type="button"
            onClick={handleClearForm}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
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
      <div className="mt-6 text-xs text-gray-500 text-center space-y-1">
        <p>Fields marked with * are required</p>
        <p>Password must be at least 6 characters long</p>
        <p>New employees will be able to log in with these credentials</p>
      </div>
    </div>
  );
}