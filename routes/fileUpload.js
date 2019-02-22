const express=require('express');
const router=express();
const upload = require("express-fileupload");
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const fs= require('fs');
const csv=require('fast-csv');
var expressValidator = require('express-validator');
var events=require('events');

var parse=require('./parseCsv');
var p=new parse();
var len;var filename;var graph;var genfile;

class Upload
{
    getFile()
    {
            //Getting the Html file
            router.get("/",(req, res)=> {
            fs.createReadStream('./public/home.html').pipe(res);});
            //Getting the Javascript file
            router.get("/home.js",(req, res)=> {
            fs.createReadStream('./public/home.js').pipe(res);});
            //
            router.get("/index.css",(req, res)=> {
            fs.createReadStream('./public/index.css').pipe(res);});
    }
    postFile()
    {
      var _this= this;
      console.log("Staring Point--------------------------------------------");
      router.use(upload({useTempFiles : true,tempFileDir : '/tmp/',createParentPath :true,parseNested : true}));
      router.post('/',(req,res)=>{

            console.log("url Request : " + req.url);
             graph=req.body.graph;
            // req.checkBody('graph', ' Graph Name is required').notEmpty();
            console.log(graph);
            if(req.files)
            {//===================================================
                console.log("Requested File Information : ",req.files);
                var file = req.files.inputfile;//file object
               filename = file.name;
                console.log("FileName : ",filename);//file name

                file.mv("./Temp/" + filename, function (err) {
                if (err) 
                {
                    console.log("error in uploading file");
                    res.redirect('http://127.0.0.1:4000/')
                }
                else 
                {
                    //res.redirect('http://127.0.0.1:4000/');//
                    console.log("FIle Uploaded to server")
                    console.log("End of fileUpload>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                    _this.postTriple(filename,graph);
                  
                }
               });
            }//=======================================================
            });
      }

      postTriple(filename,graph)
      {
        var _this=this;
        router.post('/t',(req,res)=>{
           console.log("file:=======================" + filename);
           console.log("This is the tuple Post");
            var sub=req.body.sell;var pre=req.body.pre;var ob=req.body.ob;
           
            console.log("1---------"+sub);console.log("2---------" +pre);console.log("3---------" +ob);
            //==============================================================
            var csvArray= new Array();
            var tempArray=new Array();
            csv.fromPath('./Temp/'  + filename).on("data", function(data){
              len=data.length;
              tempArray=data.map(function(v){
                  return v.split('\n');
              })
              csvArray.push(tempArray);
            }).on("end", function(){//==================================
             //we need graph,csvArray,sub,pre,ob====rows.length=csvArray.length && collength=tempArray.length===
            for(var j=0;j<tempArray.length;j++)
            {
              if(sub==csvArray[0][j])
               {
                 var subval=j;
                 console.log("Subject column : " + subval);
               }   
            
            }            
            //now i have sub loc,pre array, ob array  and csvArray  and graphname
            var subTriple;var preTriple;var obTriple;
            var writeStream;
            genfile=filename.replace('.csv','');
            if(graph=='')
            {
                writeStream = fs.createWriteStream('./gen/' + genfile + '.nt');
            }
            else
            {
                writeStream = fs.createWriteStream('./gen/' + genfile + '.nq');
            }
             
            
            for(var i=1;i<csvArray.length;i++)
             {
                //Subject Triples>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.....
                console.log("Subject Triple");
                subTriple= ob[subval] + '/' + sub + '#' + csvArray[i][subval];
                console.log(subTriple);
             
                for(var k=0;k<pre.length;k++)
                {
                  //Predicate>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>...
                  if(pre[k]=='')
                  {
                    preTriple='http:www.default.com/' + csvArray[0][k];
                  }
                  else
                  {
                    preTriple=pre[k] //       + '/' + csvArray[0][k];
                  }
                  
                  console.log("Predicate triple : " + preTriple);

                  //Object triples>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>..
                  if(ob[k]=='')
                  {
                     obTriple= '\"' + csvArray[i][k] + '\"';
                  }
                  else
                  {
                      obTriple= ob[k] + '/' + encodeURIComponent(csvArray[i][k]);
                  }
                  
                   console.log("Object triples : " + obTriple);
                    console.log("     ");
                    //use of Triples to store in file........................
                    if(graph=='')
                    {
                        if(ob[k]=='')
                        {
                        var output='<' + subTriple +'>' + ' ' + '<' + preTriple + '>' + ' ' +  obTriple  + '.' ;
                        }
                        else
                        {
                        var output='<' + subTriple +'>' + ' ' + '<' + preTriple + '>' + ' ' + 
                        '<' + obTriple + '>'  + '.' ;
                        }

                    }
                    else
                    {
                        if(ob[k]=='')
                        {
                        var output='<' + subTriple +'>' + ' ' + '<' + preTriple + '>' + ' ' +  obTriple  +
                         ' '+ '<' + graph + '>' + '.' ;
                        }
                        else
                        {
                        var output='<' + subTriple +'>' + ' ' + '<' + preTriple + '>' + ' ' + '<' + obTriple + '>'
                        + ' '+ '<' + graph + '>' + '.' ;                         
                        }
                    
                    }

                    writeStream.write(output);
                    writeStream.write("\n"); 
                }
                writeStream.write("\n");
           }//main for loop end
           writeStream.end();
           console.log("End of the Program======================================================");

           _this.download(res,graph,genfile,(e,r)=>{
                console.log(e,r);
             });
           
            });//=====================================================   
        
        });//ENd of Post method=====================================

      }
      download(res,graph,genfile,callback)
      {
          if(graph==''){
                 res.download('./gen/' + genfile + '.nt',(err)=>{
                    console.log(err);
                 }); 
             }else{
                 res.download('./gen/' + genfile + '.nq',(err)=>{
                  console.log(err);
                 });      
             }
            
      }
     
}
var u=new Upload();
u.getFile();
u.postFile();
module.exports=router;
 
