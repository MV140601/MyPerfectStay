const mongoose=require('mongoose');
const {Schema}= mongoose
const PlaceSchema= new Schema({
    owner:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    title:{type:String,require:true},
    address:{type:String,require:true},
    photos:{type:[String],require:true},
    description:{type:String},
    perks:{type:[String]},
    extraInfo:{type:String},
    checkIN:{type:Number},
    checkOUT:{type:Number},
    maxGuests:{type:Number},

})
//const varirable_to_export=mongoose.model('modelname_in_mongoose',Schema_of_the_model)
const Place=mongoose.model('Place',PlaceSchema);
module.exports=Place;