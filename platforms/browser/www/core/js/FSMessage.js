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
this.subject=subject?subject:null;this.value=value?value:null; this.receiver=receiver?receiver:null; this.senderApp=senderApp?senderApp:null;
this.receiverApp=receiverApp?receiverApp:0; this.moment=moment?moment:null; this.id=id?id:null; this.options=options?options:null;
this.sender=sender?sender:null;
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
