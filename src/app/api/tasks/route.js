// api/tasks/route.js
import { connect } from "@/dbConfig/dbConfig";
import Task from "@/models/taskModel";
import { NextResponse } from "next/server";

// Connect to DB once
connect();

// GET - Fetch all tasks
export async function GET() {
  try {
    const tasks = await Task.find().lean();

    return NextResponse.json({
      message: "Tasks fetched successfully",
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch tasks", success: false },
      { status: 500 }
    );
  }
}

// POST - Create a new task
export async function POST(request) {
  try {
    const { title, description, assignedTo, priority, status, dueDate } =
      await request.json();

    // Basic validation
    if (!title || !description || !assignedTo) {
      return NextResponse.json(
        { error: "Title, description, and assignedTo are required", success: false },
        { status: 400 }
      );
    }

    const newTask = new Task({
      title: title.trim(),
      description: description.trim(),
      assignedTo: assignedTo.trim(),
      priority: priority || "medium",
      status: status || "pending",
      dueDate: dueDate ? new Date(dueDate) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newTask.save();

    return NextResponse.json({
      message: "Task created successfully",
      success: true,
      task: newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create task", success: false },
      { status: 500 }
    );
  }
}
