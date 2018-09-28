function Bon()
{
};



Bon.source=null;
Bon.targetOrigin=null;
Bon.cmd=null;
Bon.server=null;
Bon.net=null;
Bon.sourceList=null;
Bon.requestId=0;
Bon.leader=false;
Bon.msgQue=null;


Bon.receive=function(event)
{
	if(typeof(event)!=="undefined") //cross application
	{
	  Bon.source=event.source;
	  Bon.targetOrigin=event.origin;
	  if(event.data!="hello")
	  {
	    try
	    {
	      res=FSMessage.parseXml(event.data);
	      for(var i=0;i<res.length;i++)
	      {
	        if(typeof(res[i].subject)!="undefined")
	        if(res[i].receiver=="0")
	        {
	            var activeMode="full";
	            if(res[i].subject.substring(0,4)=="side")activeMode="side";
	            else if(res[i].subject.substring(0,4)=='hide')activeMode='hide';
	            if(res[i].receiverApp=="0" || !Bon.leader){
	            	if(Bon.cmd[res[i].subject])Bon.cmd[res[i].subject](res[i]);
	            	if(res[i].subject=="hello")FSMessage.defaultSenderApp=res[i].receiverApp;
	            }
	            else
	            {
	                //Bon.catchApp(res[i],event.source);
	                //var nmsg=res[i].originalXml.replace(/senderApp=\"\w+\"/,"senderApp=\""+res[i].senderApp+"\"");
	                /*if(Bon.sourceList[res[i].receiverApp])
	                {
	                    Bon.source=Bon.sourceList[res[i].receiverApp];
	                    Bon.send(nmsg,"*");
	                    if(ClientApp.list[res[i].receiverApp])ClientApp.run(res[i].receiverApp,activeMode);
	                }
	                else
	                {*/
	                    //run client app
	                    if(ClientApp)
	                    {
	                        var app=ClientApp.list[res[i].receiverApp];
	                        if(app)
	                        {
	                            if(!app.running)Bon.msgQue=res[i].originalXml; else Bon.msgQue=null;
	                            ClientApp.run(res[i].receiverApp,activeMode);
	                            Bon.source=app.iframe.contentWindow;
	                            //if(!Bon.msgQue)Bon.send(res[i].originalXml,"*");
	                            if(!Bon.msgQue)Bon.send(event.data,"*");
	                        }
	                    }
	                //}
	            }
	        }
	      }
	    }
	    catch(ex)
	    {
	      alert("firesmoke data is not valid on current app!");
	    }
	  }
	  else
	  {
	      if(Bon.cmd.hello)Bon.cmd.hello();
	  }
	}
	else
	{
	  //cross user
	}
};
Bon.send=function(data,targetOrigin)
{
	try
	{
	    var tar=(targetOrigin)?targetOrigin:Bon.targetOrigin;
	    if(Bon.source)Bon.source.postMessage(data,"*");
	    else
	    {
	        //send over cuad protocol (CUAD:)
	        window.location.href="cuad:"+FSMessage.encodeToLine(data);
	    }
	}
	catch(ex){
		console.log(ex);
	}
};
Bon.reset=function(source,targetOrigin)
{
	window.addEventListener("message",Bon.receive,false);
	Bon.source=(source)?source:null;
	Bon.targetOrigin=(targetOrigin)?targetOrigin:"*";
	if(!Bon.cmd)Bon.cmd={};
};
Bon.sayHello=function(appIndex)
{
	if(Bon.msgQue)Bon.send(Bon.msgQue);
	else
	{
	    var hello=new FSMessage("hello","",0,0,0,appIndex);
	    Bon.send(FSMessage.toXml(hello));
	}
	Bon.msgQue=null;
};
Bon.forward=function(user,app,message)
{
	var n=Bon.net;
	n.clear();
	n.target=Bon.server+"client/send/";
	if(message instanceof FSMessage)
	{
	    n.add("message","<fs>"+FSMessage.toXml(message)+"</fs>",true);
	}
	else if(message instanceof Array)
	{
	    var msg="<fs>";
	    for(var i=0;i<message.length;i++)
	    {
	        msg+=("\n\t"+FSMessage.toXml(message[i]));
	    }
	    msg+="</fs>";
	    n.add('message',msg,true);
	}
	else if(typeof(message)=="string")
	{
	    n.add("message",message,true);
	}
	n.callback=null;
	n.send();
};
Bon.catchApp=function(msg,source)
{
	if(!Bon.sourceList)Bon.sourceList={};
	if(msg.senderApp=="0"){Bon.requestId++;msg.senderApp=Bon.requestId;}
	Bon.sourceList[msg.senderApp]=source;
	
};

function FSMessage(subject,value,sender,receiver,senderApp,receiverApp,moment,options,id)
{
	
	this.subject=null;
	this.value=null;
	this.data=null;
	this.receiver=null;
	this.senderApp=null;
	this.receiverApp=0;
	this.moment=null;
	this.id=null;
	this.options=null;
	this.originalXml=null;
	this.sender=null;
this.subject=subject?subject:'';this.value=value?value:''; this.receiver=receiver?receiver:0; this.senderApp=senderApp?senderApp:0;
this.receiverApp=receiverApp?receiverApp:0; this.moment=moment?moment:0; this.id=id?id:0; this.options=options?options:0; this.originalXml='';
this.sender=sender?sender:0;
};



FSMessage.defaultSenderApp=0;


FSMessage.toXml=function(msg)
{
	if(msg instanceof Array)
	{
	    var ret="<FS>";
	    for(var i=0; i<msg.length;i++)ret+=FSMessage.toXml(msg[i]);
	    ret+="</FS>";
	    return ret;
	}
	else
	return "<FSM id=\""+msg.id+"\" sub=\""+msg.subject+"\" sender=\""+msg.sender+"\" receiver=\""+msg.receiver+"\" senderApp=\""+msg.senderApp+"\" receiverApp=\""+msg.receiverApp+"\" moment=\""+msg.moment+"\">"+FSMessage.encode(msg.value)+"</FSM>";
};
FSMessage.parseXml=function(xml)
{
	if(typeof(xml)=="string")
	{
	    if(window.DOMParser)
	    {
	        parser=new DOMParser();
	        doc=parser.parseFromString(xml,"text/xml");
	    }
	    else
	    {
	        doc=new ActiveXObject("Microsoft.DOMXML");
	        doc.async=false;
	        doc.loadXML(xml);
	    }
	    msgs=doc.getElementsByTagName("FSM");
	    var ml=Array();
	    for(var i=0;i<msgs.length;i++)
	    {
	        if(msgs[i].nodeType==1)
	          ml[i]=FSMessage.parseXml(msgs[i]) ;
	    }
	    return ml;
	}
	else
	{
	    var value="";
	    for(var i=0;i<xml.childNodes.length;i++)
	    {
	        if(xml.childNodes[i].nodeType==3)value+=xml.childNodes[i].nodeValue;
	    }
	    var tmp= new FSMessage(xml.getAttribute('sub'),FSMessage.decode(value),
	    xml.getAttribute("sender"),xml.getAttribute("receiver"),xml.getAttribute("senderApp"),xml.getAttribute("receiverApp"),
	    xml.getAttribute("moment"),xml.getAttribute("options"));
	    tmp.originalXml=xml.outerHTML;
	    return tmp;
	}
};
FSMessage.encode=function(arg)
{
	return arg.replace(/>/g,"[:gt:]").replace(/</g,"[:lt:]").replace(/\&/g,"[:amp:]");
};
FSMessage.decode=function(arg)
{
	return arg.replace(/\[\:gt\:\]/g,">").replace(/\[\:lt\:\]/g,"<").replace(/\[\:amp\:\]/g,"&");
};
