const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const ftp = require('basic-ftp');
const res = require('express/lib/response');

 require('dotenv').config();
    
  async function sendFiles(rFile,nFile) {
    
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
        
      
         await client.downloadTo('dowloads/' + nFile,rFile + nFile);
       
         
       
    } catch (err) {
        console.error(err);
        
    }
   client.close();  
}

app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization, Origin, X-Requested-With, Accept, Cache-Control",
    preflightContinue: true,
    optionsSuccessStatus: 204,
}));

// Enable pre-flight across-the-board
app.options('*', cors(), ((req, res, next) => {
    console.log(req, res, next);
    res.send('CORS Allow');
}));

app.post('/service/ftp/tyj/fidu',  function (req, res, next) {
    console.log("Getting POST request from: ", req.ip, new Date().toISOString())

    // Verify the pre-condition, the params Taylor-Param1 and
    // Taylor-Param2 must be exist in the header of HTTP
    if (req.headers["ruta-ftps"] === undefined) {
        // 500 Internal Server Error
        return res.status(500).send("The ruta-ftps not send in the header of HTTP");
    }

    if (req.headers["name-file"] === undefined) {
        // 500 Internal Server Error
        return res.status(500).send("The name-file not send in the header of HTTP");
    }
    
    if (req.headers["ruta-ftps"] === "") {
        // 500 Internal Server Error
        return res.status(500).send("The ruta-ftps not send in the header of HTTP");
    }

    if (req.headers["name-file"] === "") {
        // 500 Internal Server Error
        return res.status(500).send("The name-file not send in the header of HTTP");
    }
    const rutaFile = req.headers["ruta-ftps"] ;
    // @type List[String] List of words in the body.
    const nameFile = req.headers["name-file"];
    
    sendFiles(rutaFile,nameFile).then(v =>{
        try{
            res.download('dowloads/' + nameFile,nameFile);  
        }
        catch{
            res.send("no archivo");
        }

    });
    
   // res.download('dowloads/' + nameFile,nameFile);
    
    
})
 

const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

    


    
  
  
