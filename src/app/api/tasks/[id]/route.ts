import { connect } from "@/dbConfig/dbConfig";
import Task from "@/models/taskModel"; // Ensure this path is correct
import { NextRequest, NextResponse } from "next/server";

connect();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id; // Get the ID from the URL

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Task deleted successfully",
      success: true,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}