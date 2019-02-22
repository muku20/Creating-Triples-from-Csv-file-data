
class Home
{
    validate()
    {   
        var _this=this;
        var fileUpload = document.getElementById("fileUpload");
        var file=fileUpload.files[0]
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.tsv)$/;
        if (regex.test(fileUpload.value))
        {
            var reader = new FileReader();
            reader.onload = function (e) {

            var rows = e.target.result.split("\n");
            var cells = rows[0].split(",");
            var arr=[];
            for (var j = 0; j < cells.length; j++) {
            arr.push(cells[j]);}
            console.log(arr);
            
            _this.sendReq('/',$("#idForm1"));
            _this.responseUi(arr);
            }
                reader.readAsText(file);
        } else {
            var text="Please upload a valid CSV file.";
             document.getElementById("print").innerHTML = text;

        }
       
    }
     //===============================================================================================   
    responseUi(a)
    {
        var br; var _this=this;
        var div=document.getElementById("print");
        div.innerHTML=" "
        var form=document.createElement('form'); 
        form.action="/t";form.method="post";form.enctype="multipart/form-data";form.id="idForm2";
        div.append(form);
        br=document.createElement("br");
        form.append(br)

        var g1 = document.createTextNode('Subject : ');
        form.append(g1);

        var sub=document.createElement("select");
        sub.name="sell";sub.id="sel"
        form.append(sub);

    
        a.map(name=>
        {
             var option=document.createElement("Option");
             option.id="opt";option.name=name;option.value=name;option.innerHTML=name;
             sub.append(option);
        })

        br=document.createElement("br");
        form.append(br)

        br=document.createElement("br");
        form.append(br)
       
        var g2 = document.createTextNode('Predicate : ');
        form.append(g2);

        br=document.createElement("br");
        form.append(br)
        br=document.createElement("br");
        form.append(br)
        /////////////////////////////////////////////////////
        a.map(name=>
        {   
            form.append(name);
            var pre=document.createElement("input");
            pre.type="text";pre.id="pre";pre.name="pre";
            
            form.append(pre);

            br=document.createElement("br");
            form.append(br)
    
        });
        var g3 = document.createTextNode('Object : ');
        form.append(g3);

        br=document.createElement("br");
        form.append(br)

        br=document.createElement("br");
        form.append(br)
        //////////////////////////////////////////////////////////
        a.map(name=>
        {
            form.append(name);
            var ob=document.createElement("input");
            ob.type="text";ob.id="ob";ob.name="ob";
            
            form.append(ob);

            br=document.createElement("br");
            form.append(br)
        });

        br=document.createElement("br");
        form.append(br)

        var cre=document.createElement("input");
        cre.type="submit";cre.id="cre";cre.value="Create Tuple";
        //cre.onclick=_this.downloadFile();
        form.append(cre);

    }
    //====================================================================================================
    sendReq(url,id)
    {
        $(document).ready(()=>{
             var form= id;
             $.ajax({
                method:'post',
                 url: url,
                 data: form.serialize()
                 }).done(function(data){
                    //console.log(data);
                    console.log("Request End")
                 }) 
                 
            });
        
    }
    downloadFile()
    {
        this.sendReq('/t',$("#idForm2"));
    }
}
var h=new Home();

