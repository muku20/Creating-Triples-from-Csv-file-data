const express=require('express');
const app=express();

const fileUpload=require('./routes/fileUpload');
//const getspo=require('./routes/tuple');
//const geta=require('./routes/get');


class appp{

    apihandle()
    {


      //Handle Requests by Clients
      app.use('/',fileUpload);
    

    }
}
module.exports=app;
var a=new appp();
a.apihandle();

