const express = require("express");
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');


const admin = require('firebase-admin');
const serviceAccount = require('./imp-firebase-keys/serviceAccountKey.json');


const firebaseConfig = {

    credential: admin.credential.cert(serviceAccount),
  apiKey: "AIzaSyB1i081lhQ6zWOoaF4X9Tv5xUYBqFPIoNg",
  authDomain: "auto-note-file-storage.firebaseapp.com",
  projectId: "auto-note-file-storage",
  storageBucket: "auto-note-file-storage.appspot.com",
  messagingSenderId: "145258046101",
  appId: "1:145258046101:web:62d8dc77c249449d75719c",
  measurementId: "G-WG5DR3GBM0"
};
admin.initializeApp(firebaseConfig);


const bucket = admin.storage().bucket();
const downloadFolderPath = path.join(__dirname, 'downloads'); // Set your desired download folder path


const app = express();

app.use(express.static(path.join(__dirname, 'assets')));


//firebase config


//fire base config ends



//download the file from the firebase cloud bucket
app.get('/download', async (req, res) => {
    const filename = req.query.fileid;
    const file = bucket.file(filename);
  
    try {
      const [fileExists] = await file.exists();
  
      if (!fileExists) {
        // return res.status(404).send('File not found');
      }
  
      const [metadata] = await file.getMetadata();
  
      const readStream = file.createReadStream();
  
      const savePath = path.join(downloadFolderPath, filename);
      const writeStream = fs.createWriteStream(savePath);
  
      readStream.pipe(writeStream);
  
      writeStream.on('finish', () => {


        //add the code for transcription
        const fileLocation = __dirname+"/downloads/"+filename;
        const childProcess = spawn('node', ['index.js', fileLocation]);
      childProcess.stdout.on('data', (data) => {
      console.log(`Script output: ${data}`);
      // res.send(`transcribe output: ${transcribeOutput}`);
      const transcribeContentOutputObj = {
        fileIdorUniqueFileName: filename,
        transcribeContentOutput: data.toString('utf8')
      }

      res.status(200).json(transcribeContentOutputObj);


      });
   
        // res.status(200).send(`transcribe output: ${transcribeOutput}`);
      });
  
    } 
    
    
    catch (error) {
      console.error('Error:', error);
      // res.status(500).send('Server error');
    }
  });








app.get("/startPage", (req ,res)=>{
  

  res.sendFile(__dirname+"/public/nextPage2.html");
})




app.listen(5000, ()=>{
    console.log("Running on 5000");
})








