import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    

const cookieStore = await cookies();
const token = cookieStore.get("token")?.value;

    
    if (!token) {
      return NextResponse.json({ 
        error: "Authentication required", 
        success: false 
      }, { status: 401 });
    }

    // Verify token and get user data
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as any;
    
    // Only managers can fetch all users
    if (decoded.role !== "mngr") {
      return NextResponse.json({ 
        error: "Access denied. Manager role required.", 
        success: false 
      }, { status: 403 });
    }

    // Fetch users from same company only (exclude password)
    const users = await User.find({ cid: decoded.cid }).select('-password -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry');
    
    return NextResponse.json({
      message: "Users fetched successfully",
      success: true,
      users,
    });

  } catch (error: any) {
    console.error("User fetch error:", error);
    
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
      {
        error: error.message || "Failed to fetch users",
        success: false,
      },
      { status: 500 }
    );
  }
}