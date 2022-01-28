const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const ftp = require('basic-ftp');

 require('dotenv').config();
    
  async function sendFiles() {
    
    const client = new ftp.Client();
    // Only for debug session
    client.ftp.verbose = (process.env.DEBUG === 'true');
    
    try {
        
         await client.access({
            host: process.env.FTPS_HOST,
            port: process.env.FTPS_PORT,
            user: process.env.FTPS_USER,
            password: process.env.FTPS_PASS,
            secure: true
            
        })
        
        // Log progress for any transfer from now on.
        client.trackProgress(info => {
            if (process.env.DEBUG === 'true') {
                console.log("File", info.name)
                console.log("Type", info.type)
                console.log("Transferred", info.bytes)
                console.log("Transferred Overall", info.bytesOverall)
                console.log("conectando")
            }
        })

        let destinationPath = process.env.FTPS_DIR;
        
      
         await client.downloadTo('dowloads/' + process.env.FTPS_NAMEDOC,destinationPath + process.env.FTPS_NAMEDOC);
         
       
    } catch (err) {
        console.error(err);
    }
   client.close();  
}
 
    sendFiles().then(v =>{

    });


    
  