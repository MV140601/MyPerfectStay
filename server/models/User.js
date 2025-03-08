const mongoose=require('mongoose');
const {Schema}=mongoose;
const UserSchema=new Schema({
    name:{type:String,unique:true,require:true},
    email:{type:String,unique:true,require:true},
    password:{type:String,require:true}
});

const UserModel=mongoose.model('User',UserSchema);//(Name in db,schema name)
module.exports = UserModel