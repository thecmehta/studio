import { connect } from "@/dbConfig/dbConfig";
import Task from "@/models/taskModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
   
    
    const { title, description, assignTo } = reqBody;
    
    // Validate required fields
    if (!title || !description || !assignTo) {
      return NextResponse.json(
        { 
          error: "Title, description, and assignTo are required fields",
          success: false 
        },
        { status: 400 }
      );
    }
    
    console.log("Request body:", reqBody);
    
    // Create task data object
    const taskData = {
      title,
      description,
      assignTo,
     // Only include dueDate if provided
    };
    
    const newTask = new Task(taskData);
    const savedTask = await newTask.save();
    
    console.log("Task saved successfully:", savedTask);
    
    return NextResponse.json({
      message: "Task created successfully",
      success: true,
      savedTask
    });
    
  } catch (error) {
    console.error("Task creation error:", error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          error: `Validation failed: ${error.message}`,
          success: false 
        },
        { status: 400 }
      );
    }
    
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          error: "Task with this title already exists",
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
export async function GET(request: NextRequest) {
  try {
    // Fetch all documents from the Task collection
    const tasks = await Task.find({});

    return NextResponse.json({
      message: "Tasks fetched successfully",
      success: true,
      tasks,
    });

  } catch (error: any) {
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