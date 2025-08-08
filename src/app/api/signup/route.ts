import {connect} from "@/dbConfig/dbConfig"
import User from "@/models/userModel"
import {NextRequest,NextResponse} from "next/server"
import bcryptjs from "bcryptjs"

connect()

export async function POST(request:NextRequest){
    try {
        const reqBody = await request.json()
         
        const {email,password,role} =  reqBody
        console.log(reqBody)
        const user = await User.findOne({email})
        if(user){
            return NextResponse.json({error:"User already exists"},{status:400})
        }
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password,salt)
           
        const newUser= new User({
                email,
                role,
                password:hashedPassword
            })
           
        const savedUser =  await newUser.save()
           
        console.log(savedUser)
            
        return NextResponse.json({
            message:"User created successfully",
            success:true,
            savedUser
        })
             
    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }
     
}

export async function GET(request: NextRequest) {
    try {
        // Fetch all users where role is "emp"
        const users = await User.find({ role: "emp" });

        return NextResponse.json({
            message: "Users fetched successfully",
            success: true,
            users,
        });
        
    } catch (error: any) {
        console.error("User fetch error:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to fetch users",
                success: false
            },
            { status: 500 }
        );
    }
}