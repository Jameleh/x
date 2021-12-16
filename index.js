
import express from 'express';
//he crypto module provides cryptographic functionality that includes
// a set of wrappers for OpenSSL's hash, HMAC, cipher, decipher, sign, and verify functions.
import  crypto from "crypto";
// busBoy A node.js module for parsing incoming HTML form data.
import  busboy  from "busboy";

// import fs from "fs";


const appExp  = express();
var PORT =process.env.PORT || 4321;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,PUT,OPTIONS,PATCH",
  "Access-Control-Allow-Headers":
    "x-test,Content-Type,Accept,Access-Control-Allow-Headers",
  "Access-Control-Expose-Headers":
    "X-Resp,Content-Type, Accept, Access-Control-Allow-Headers, Access-Control-Expose-Headers",
  "Access-Control-Allow-Headers":
    "X-Resp,Content-Type, Accept, Access-Control-Allow-Headers, Access-Control-Expose-Headers",
};

appExp.get('/', async(req,res)=>

{

    res.writeHead(200, { Connection: 'close' });
    res.end('<html><head></head><body>\
               <form   action="/test" method="POST" enctype="multipart/form-data">\
                <input type="file" name="key"><br />\
                <input type="file" name="secret"><br />\
                <input type="submit">\
              </form>\
            </body></html>');
  
});
appExp
  .post('/test', async (req, res) => {
    
    let o = {};
   let  upload= new busboy({ headers: req.headers });
  upload.on('error', (err) => {
    debugLog(options, `Busboy error`);
    next(err);
   });
 /*busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
  console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype)
  File [filefield]: filename: ryan-speaker.jpg, encoding: binary;*/
  // This code will process each file uploaded.
  upload
      .on('file', (fieldname, file , filename, encoding, mimetype) =>
       // process files


       {console.log(`process files`);
         console.log(`File ${fieldname} started to process`);
        file
        .on('data', (data) =>{
           o[fieldname] = data;
        //  o[fieldname] =  fs.readFileSync(data,'utf-8');
        })
       // fs.readFileSync('./key.pem', 'utf8')
       // .on('data', (data) => o[fieldname] = data)
        .on('end', () => console.log(` File ${fieldname} finnished `))
       }
        
      );
      upload.on('field',()=>console.log(`field`));
      upload.on('finish', () => {
        console.log("connection close");
        // send response
        let result;
        try {
          //crypto.privateDecrypt( privateKey, buffer )
           /*
          Error  is  Error: error:0909006C:PEM routines:get_name:no start line in crypto.privateDecrypt
          var crt = crypto.createPrivateKey(fs.readFileSync(curPath + '/openssl/something.key.pem'));*/
          var crt = crypto.createPrivateKey(o['key']);
          var buffer = Buffer.from(o['secret'],'base64');
          //var msg = crypto.privateDecrypt({ key: crtUse, padding: crypto.constants.RSA_PKCS1_PADDING }, buffer).toString('utf8');
          //result = crypto.privateDecrypt({key:crt,padding :crypto.constants.RSA_PKCS1_PADDING}, buffer).toString('utf8');
          result = crypto.privateDecrypt(crt, buffer).toString('utf8');
         // result = crypto.privateDecrypt( o['key'], o['secret']);
        } catch (e){

          /*
          Error  is  Error: error:0909006C:PEM routines:get_name:no start line in crypto.privateDecrypt
          var crt = crypto.createPrivateKey(fs.readFileSync(curPath + '/openssl/something.key.pem'));
          var buffer = Buffer.from(to_decrypt);
          var msg = crypto.privateDecrypt({ key: crtUse, padding: crypto.constants.RSA_PKCS1_PADDING }, buffer).toString('utf8');

          */
          result = `Error  is  ${e} in crypto.privateDecrypt `;
          console.log(result)
        }
        debugger;
        res.set(CORS).send(String(result));
      // res.send(String(result));
      });
   //liga request no upload (budboy)
    req.pipe(upload);
  })
  .listen(PORT, () => console.log(`listening 0n  ${PORT}`))
  /*
  curl -X POST -F key="@C:\Users\Жамиля\Desktop\SecretKey\id_rsa2" -F secret="@C:\Users\Жамиля\Desktop\SecretKey\secret2"  http://localhost:4321/
  
  curl -X POST -F key="@C:\Users\Жамиля\Desktop\SecretKey\id_rsa2" -F secret="@C:\Users\Жамиля\Desktop\SecretKey\secret2" https://keysecret.herokuapp.com/
  */
 