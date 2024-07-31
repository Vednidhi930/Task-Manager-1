import  { Schema,model,Types } from "mongoose"

const userSchema=new Schema(
{
    username:
    
    {
        type:String,
        required:true,
    },

    email:

    {
        type:String,
        required:true,
        unique:true,
    },

    password:

    {
        type:String,
        required:true, 
    },

    profileImage:{
      type:String,
      required:true,
      default:"https://png.pngtree.com/element_our/png/20181206/users-vector-icon-png_260862.jpg"
    },

    tasks:[
        {
            type:Types.ObjectId,
            ref:"task"
        }
    ]

    
},

{ timestamps: true } 

)

export const userModel=model("User",userSchema)