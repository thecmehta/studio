import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cid, name, email, password, role } = body;

    // Validate required fields
    if (!cid || !name || !email || !password || !role) {
      return NextResponse.json(
        { error: "All fields are required", success: false },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered", success: false },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      cid,
      name,
      email,
      password: hashedPassword,
      role, // should be "mngr" from frontend
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User created successfully", success: true },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error.message || "Signup failed", success: false },
      { status: 500 }
    );
  }
}
