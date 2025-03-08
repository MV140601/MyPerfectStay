const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User.js')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jstsecret = 'MyPerfectStaySecretkey';
const cookieParser = require('cookie-parser');
const imagedownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Place=require('./models/Places.js');
const { Console } = require('console');


// Middleware to parse JSON (optional, but useful for future extensions)
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    credentials: true, // Allow cookies and credentials
}));
app.use(express.json())
app.use(cookieParser());
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const photosMiddleware = multer({ dest: 'uploads/' })
// Serve static files before defining routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
mongoose.connect(process.env.MONGO_URL)
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store'); // Prevents caching of the response
    next();
});
// Route to test the API    
app.get('/test', (req, res) => {
    res.json('test okay 1 2 3');

    console.log('Hit Successful')
});



app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create the user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        //  alert("Registration Successful.")
        res.status(201).json(user);
    } catch (error) {
        console.error('Error in /register:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.get('/profile', async (req, res) => {
    try {
        const { token } = req.cookies; // Extract the specific token
        if (!token) {
            return res.json(null); // No token, return null
        }

        jwt.verify(token, jstsecret, {}, async (err, user) => {
            if (err) {
                console.error('JWT verification failed:', err);


                return res.status(401).json({ error: 'Invalid or expired token' });
            }
            const { name, email, _id } = await User.findById(user.userId);
            // Successfully verified
            res.json({ name, email, _id });
        });
    } catch (error) {
        console.error('Error in /profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("Test Login 2");

        // Check if the user exists
        const userDoc = await User.findOne({ email });
        if (userDoc) {


            // Compare the entered password with the hashed password
            const isPasswordValid = bcrypt.compareSync(password, userDoc.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Invalid password" });
            }

            // Generate JWT token
            const token = jwt.sign(
                { useremail: userDoc.email, userId: userDoc._id, name: userDoc.name },
                jstsecret,
                {} // Token validity
            );
            res.cookie('token', token).status(200).json(userDoc);

        } else {
            return res.status(404).json({ error: "User doesn't exists" });

        }
        // Send response with token in cookie
    } catch (error) {
        console.error('Error in /login:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});
console.log("--__dirname", __dirname);

app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body
    const newName = 'photo' + Date.now() + '.jpg';
    await imagedownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName
    })
    console.log(__dirname + '/uploads/' + newName);
    return res.json(newName);

})

app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];
   // const uploadDir = path.join(__dirname, 'uploads');

    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;

        fs.renameSync(path, newPath);
        console.log(`Uploaded file: ${newPath.replace(`uploads\\`,'')}`);

        // Fix: Ensure the correct URL path
        uploadedFiles.push(`/uploads/${newPath.replace(`uploads\\`,'')}`);
    }

    res.json(uploadedFiles);
});

app.post('/places',(req,res)=>{
    const {token} = req.cookies;
    const {
      title,address,addedPhotos,description,price,
      perks,extraInfo,checkIn,checkOut,maxGuests,
    } = req.body;
    jwt.verify(token, jstsecret, {}, async (err, userData) => {
      if (err) throw err;
      const placeDoc = await Place.create({
        owner:userData.userId,price,
        title,address,photos:addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,
      });
      res.status(200).json(placeDoc);
    });
 })
app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
})
// Default route
app.get('/', (req, res) => {
    console.log('Hello World');
    res.send('Hello World'); // Sends a response back to the client
});

app.get('/user-places',(req,res)=>{
    console.log("Got the hit here");
    const {token} = req.cookies;
    jwt.verify(token, jstsecret, {}, async (err, userData) => {
        console.log(userData);
        if (err) throw err;
         const {userId}=userData;
         console.log(userId);
         res.status(200).json(await Place.find({owner:userId}));
      });
})
app.get('/places', async(req,res)=>{
    console.log("Got the hit here");
     
         res.status(200).json(await Place.find());
      
})
app.get('/places/:id',async (req,res)=>{
    console.log("Got the hit here 1");
    const {token} = req.cookies;
    jwt.verify(token, jstsecret, {}, async (err, userData) => {
        console.log(userData);
        if (err) throw err;
         const {id}=req.params;
          res.status(200).json(await Place.find({_id:id}));
      });
})

app.put('/places',async (req,res)=>{
    const {token} = req.cookies;
 console.log('inside the update ')
 console.log(req.body);
    const {
        id,title,address,addedPhotos,description,price,
        perks,extraInfo,checkIn,checkOut,maxGuests,
      } = req.body;
      
      jwt.verify(token, jstsecret, {}, async (err, userData) => {
          console.log(userData);
          if (err) throw err;
          const placeDoc=await Place.findById(id);
          console.log("placeDoc.owner", userData.userId===placeDoc.owner.toString());
        if(userData.userId===placeDoc.owner.toString()){
     console.log('updating place')
            placeDoc.set({ price,
        title,address,photos:addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,
            })
            placeDoc.save();
            res.status(200).json(placeDoc)
        }
      });
})
// Start server
app.listen(1000, () => {
    console.log('Server running on http://localhost:1000');
});
