import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // Get token from cookies
    const token = request.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ 
        error: "Authentication required", 
        success: false 
      }, { status: 401 });
    }

    // Verify token and get user data
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as any;
    
    // Only managers can delete users
    if (decoded.role !== "mngr") {
      return NextResponse.json({ 
        error: "Access denied. Manager role required.", 
        success: false 
      }, { status: 403 });
    }

    // Find the user to be deleted
    const userToDelete = await User.findById(userId);

    if (!userToDelete) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }

    // Check if user belongs to same company
    if (userToDelete.cid !== decoded.cid) {
      return NextResponse.json({ 
        error: "Access denied. User not in your company.", 
        success: false 
      }, { status: 403 });
    }

    // Prevent managers from deleting themselves
    if (userToDelete._id.toString() === decoded.id) {
      return NextResponse.json({ 
        error: "Cannot delete your own account", 
        success: false 
      }, { status: 400 });
    }

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    return NextResponse.json({
      message: "User deleted successfully",
      success: true,
    });

  } catch (error: any) {
    console.error("User deletion error:", error);
    
    // Handle JWT errors specifically
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: "Invalid token", success: false },
        { status: 401 }
      );
    }
    
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { error: "Token expired", success: false },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to delete user", success: false },
      { status: 500 }
    );
  }
}