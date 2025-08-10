import { connect } from "@/dbConfig/dbConfig";
import Task from "@/models/taskModel";
import { NextResponse } from "next/server";

// Ensure database connection
connect();

// Input validation helper
function validateTaskInput(data) {
  const errors = [];
  
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push("Title is required and must be a non-empty string");
  }
  
  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    errors.push("Description is required and must be a non-empty string");
  }
  
  if (!data.assignedTo || typeof data.assignedTo !== 'string' || data.assignedTo.trim().length === 0) {
    errors.push("AssignedTo is required and must be a non-empty string");
  }
  
  // Validate priority if provided
  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  if (data.priority && !validPriorities.includes(data.priority)) {
    errors.push("Priority must be one of: low, medium, high, urgent");
  }
  
  // Validate status if provided
  const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push("Status must be one of: pending, in-progress, completed, cancelled");
  }
  
  // Validate due date if provided
  if (data.dueDate) {
    const date = new Date(data.dueDate);
    if (isNaN(date.getTime())) {
      errors.push("Due date must be a valid date");
    }
  }
  
  return errors;
}

// Sanitize input data
function sanitizeTaskInput(data) {
  return {
    title: data.title?.toString().trim(),
    description: data.description?.toString().trim(),
    assignedTo: data.assignedTo?.toString().trim(),
    assignedBy: data.assignedBy?.toString().trim() || "manager",
    cid: data.cid?.toString().trim() || "company1",
    priority: data.priority || "medium",
    status: data.status || "pending",
    ...(data.dueDate && { dueDate: new Date(data.dueDate) })
  };
}

export async function POST(request) {
  try {
    const reqBody = await request.json();
    
    console.log("Request body:", reqBody);

    // Validate input
    const validationErrors = validateTaskInput(reqBody);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationErrors,
          success: false
        },
        { status: 400 }
      );
    }

    // Sanitize and prepare task data
    const taskData = sanitizeTaskInput(reqBody);

    // Create and save the task
    const newTask = new Task(taskData);
    const savedTask = await newTask.save();

    console.log("Task saved successfully:", savedTask._id);

    return NextResponse.json({
      message: "Task created successfully",
      success: true,
      task: savedTask
    }, { status: 201 });

  } catch (error) {
    console.error("Task creation error:", error);

    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        {
          error: "Database validation failed",
          details: validationErrors,
          success: false
        },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        {
          error: "Duplicate entry found",
          success: false
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: error.message || "Failed to create task",
        success: false
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Extract query parameters for filtering and pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const assignedTo = searchParams.get('assignedTo');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    // Build query filter
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Create sort object
    const sort = {};
    sort[sortBy] = sortOrder;

    // Fetch tasks with filters, pagination, and sorting
    const tasks = await Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance

    // Get total count for pagination info
    const total = await Task.countDocuments(filter);

    return NextResponse.json({
      message: "Tasks fetched successfully",
      success: true,
      data: {
        tasks,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalTasks: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error("Task fetch error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch tasks",
        success: false
      },
      { status: 500 }
    );
  }
}