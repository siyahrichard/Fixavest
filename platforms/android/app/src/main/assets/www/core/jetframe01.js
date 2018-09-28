function Jet()
{
};




Jet.get=function(cond)
{
	co=cond.substr(1,cond.length);
	var ret=null;
	switch(cond[0])
	{
		case '#':
			ret=document.getElementById(co);
			if(ret)ret=new JetHtml(ret);
			break;
		case '.':
			ret=document.getElementsByClassName(cond.substr(1,cond.length));
			if(ret)ret=new JetList(ret);
			break;
		case '@':
			if(typeof(Polaris)!="undefined"){
				if(cond.length==1)return PolarApp.activeObject.currentForm;
				else return PolarApp.activeObject.currentForm.get(co);
			}
			break;
		default:
			ret=document.getElementsByTagName(cond);
			if(ret)ret=new JetList(ret);
			break;
	}
	if(ret)ret.selector=cond;
	return ret;
};
Jet.inner=function(source,arg)
{
	try
	{
	if(typeof(source.attr)!="undefined")
	{
	src=source.source;
	}
	else
	{
	src=source;
	}
	}
	catch(ex)
	{
	return null;
	}
	if(typeof(src.innerHTML)!="undefined")
	{
	    if(src.nodeName.toLowerCase()=="input"  || src.nodeName.toLowerCase()=="textarea" || src.nodeName.toLowerCase()=="select")
	    {
	        switch(src.type.toLowerCase())
	        {
	        case 'checkbox': case 'radio':
	        if(typeof(arg)=="undefined")return src.checked;
	        else src.checked=arg;
	        break;
	        default:
	        if(typeof(arg)=="undefined")return src.value;
	        else src.value=arg;
	        break;
	        }
	    }
	    else if(typeof(arg)!=="undefined")
	    {
	    
	    if(typeof(arg)=="object")
	    {
	    src.appendChild(arg);
	    }
	    else if(typeof(arg)=="string")
	    {
	    src.innerHTML=arg;
	    }
	    
	    }
	    else
	    {
	    return src.innerHTML;
	    }
	    return null;
	}
};
Jet.show=function(source,arg,eleminate)
{
	try
	{
	if(typeof(source.attr)!="undefined")
	{
	src=source.source;
	}
	else
	{
	src=source;
	}
	}
	catch(ex)
	{
	return null;
	}
	if(typeof(src.innerHTML)!="undefined")
	{
	if(arg)
	{
	src.style.visibility="visible";
	if(src.lastPosition)src.style.position=source.lastPosition;
	src.lastPosition=null;
	}
	else
	{
	src.style.visibility="hidden";
	if(eleminate || typeof(eleminate)=="undefined")
	{
	src.lastPosition=(src.style.position)?src.style.position:"static";
	src.style.position="absolute";
	}
	}
	}
};
Jet.attr=function(source,name,value)
{
	try
	{
	if(typeof(source.attr)!="undefined")
	{
	src=source.source;
	}
	else
	{
	src=source;
	}
	}
	catch(ex)
	{
	return null;
	}
	if(typeof(src.innerHTML)!="undefined")
	{
	if(typeof(value)!='undefined')src.setAttribute(name,value);
	else return src.getAttribute(name);
	}
	return null;
};
Jet.config=function()
{
	_=Jet.get;
	if(typeof(NetSchedule)!='undefined')
	{
	    _ajaxQ=NetSchedule;
	    _ajaxQ.command=[];
	    _ajaxQ.list=[];
	}
	
	if(typeof(Utility)!="undefined")
	{
	    _util=Utility;
	}
	if(typeof(JetAnimation)!="undefined")
	{
	    _A=JetAnimation;
	    JetS=JetScene;
	    JetSG=SceneGroup;
	}
	if(typeof(JetApp)!="undefined")
	{
		Jet.App=JetApp;
		JetApp.config();
	}
	
	String.prototype.captalize=function(){
	    return this.substring(0,1).toUpperCase()+this.substring(1,this.length);
	};
};
Jet.loadResource=function(file,type,callback)
{
	var node=null;
	switch(type)
	{
	    case 'css': case 'style':
	        node=document.createElement('link');
	        node.setAttribute('rel','stylesheet');
	        node.setAttribute('type','text/css');
	        node.setAttribute('href',file);
	        break;
	    case 'javascript': case 'js': case 'script':
	        node=document.createElement('script');
	        node.setAttribute('type','text/javascript');
	        node.setAttribute('src',file);
	        break;
	    default: break;
	}
	if(node)
	{
	    if(callback)
	    {
	        if(typeof(callback)=="string")node.setAttribute("onload",callback);
	        else node.onload=callback;
	    }
	    document.body.appendChild(node);
	}
};
Jet.setClass=function(obj,className,add)
{
	var ocl=obj.getAttribute('class');
	if(!ocl)ocl="";
	var pat=new RegExp("\\b"+className+"\\b","g");
	var res=ocl.search(pat);
	if(add===undefined){//toggle class
		if(res!=-1)add=false; else add=true;
	}
	if(add)
	{
	    if(res>=0)return true;
	    else
	    {
	        if(ocl!=="")ocl+=" ";
	        ocl+=className;
	    }
	}
	else
	{
	    ocl=ocl.replace(pat,"");
	}
	ocl=ocl.replace(/\s+/,' ');
	obj.setAttribute("class",ocl);
};

function JetHtml(source)
{
	
	this.source=null;
	this.selector=null;
this.source=source;
	
	this.inner=function(arg)
	{
		if(typeof(arg)=="undefined")return Jet.inner(this);
		else Jet.inner(this,arg);
	};
	this.show=function(arg,eleminate)
	{
		if(typeof(eleminate)!="undefined")Jet.show(this,arg,eleminate);
		else Jet.show(this,arg);
	};
	this.attr=function(name,value)
	{
		if(typeof(value)!="undefined")Jet.attr(this,name,value);
		else return Jet.attr(this,name);
	};
	this.value=function(arg)
	{
		if(typeof(arg)=="undefined")return Jet.inner(this);
		else Jet.inner(this,arg);
	};
	this.a=function(effect,tag,speed,callback)
	{
		return JetAnimation.do(effect,this.selector,tag,speed,-1,callback);
	};
	this.addClass=function(className)
	{
		Jet.setClass(this.source,className,true);
	};
	this.removeClass=function(className)
	{
		Jet.setClass(this.source,className,false);
	};
	this.toggleClass=function(className)
	{
		Jet.setClass(this.source,className);//if thirth was undefined then toggle
	};
};




function JetList(list)
{
	
	this.sources=null;
	this.length=0;
	this.selector=null;
if(typeof(list)!="undefined")
{
    for(var i=0;i<list.length;i++)
    {
        if(typeof(list[i].attr)!="undefined")this[i]=list[i];
        else this[i]=new JetHtml(list[i]);
    }
    this.length=i;
}
	
	this.inner=function(arg)
	{
		if(typeof(arg)!="undefined")  for(var i in this)Jet.inner(this[i],arg);
		else
		{
		var ret=[];
		var r=null;
		for(var i in this)
		{
		if(r=Jet.inner(this[i]))
		{
		ret[i]=r;
		}
		
		}
		return ret;
		}
	};
	this.show=function(eleminate,arg)
	{
		for(i in this)Jet.show(this[i],arg,eleminate);
	};
	this.attr=function(name,value)
	{
		if(typeof(value)!="undefined")for(var i in this)Jet.attr(this[i],name,value);
		else
		{
		var ret=[];
		var r=null;
		for(i in this)
		{
		if(this[i])
		if(r=Jet.attr(this[i],name))
		{
		ret[i]=r;
		}
		}
		return ret;
		}
	};
	this.push=function(jh)
	{
		this.length++;
		this[this.length]=jh;
	};
	this.value=function(arg)
	{
		if(typeof(arg)!="undefined")  for(var i in this)Jet.inner(this[i],arg);
		else
		{
		var ret=[];
		var r=null;
		for(var i in this)
		{
		if(r=Jet.inner(this[i]))
		{
		ret[i]=r;
		}
		
		}
		return ret;
		}
	};
	this.addClass=function(className)
	{
		for(var i in this)
		    if(this[i] instanceof JetHtml)this[i].addClass(className);
	};
	this.removeClass=function(className)
	{
		for(var i in this)
		    if(this[i] instanceof JetHtml)this[i].removeClass(className);
	};
	this.toggleClass=function(className)
	{
		for(var i in this)
		    if(this[i] instanceof JetHtml)this[i].toggleClass(className);
	};
};




function NetSchedule()
{
	
	this.repeat=false;
};



NetSchedule.list=null;
NetSchedule.command=null;
NetSchedule.net=null;
NetSchedule.currentCommand=null;
NetSchedule.processing=false;
NetSchedule.watchList=null;


NetSchedule.add=function(netData,command)
{
	if(!NetSchedule.list)NetSchedule.list=[];
	if(!command){
		command= netData.command || netData.callback;
	}
	NetSchedule.list.push({'command':command,'netData':netData});
	
	if(netData.watchdog){
		if(!NetSchedule.watchList)NetSchedule.watchList={};
		NetSchedule.watchList[netData.watchdog]=netData; //add netdata to watchList of watchdog
	}
	
	return NetSchedule;
};
NetSchedule.run=function(force)
{
	if(!NetSchedule.processing || force)
	{
	    if(!NetSchedule.net)NetSchedule.net=new NetworkTransfer();
	    //var task=NetSchedule.list.pop();
	    var task=NetSchedule.list[0];
	    NetSchedule.currentTask=task;
	    if(task)
	    {
	    	NetSchedule.list.splice(0,1);
	        NetSchedule.processing=true;
	        NetSchedule.currentCommand=task.command;
	        NetSchedule.net.data=task.netData.data;
	        NetSchedule.net.target=task.netData.url;
	        NetSchedule.net.method=task.netData.method;
	        NetSchedule.net.callback=NetSchedule.callback;
	        NetSchedule.net.onerror=NetSchedule.errorCallback;
	        NetSchedule.net.send();
	    }
	    else{
	    	NetSchedule.processing=false; //finished all tasks
	    	NetSchedule.watchdogRun(); //run watchdog to run incompleted tasks
		    if(NetSchedule.repeat)setTimeout(NetSchedule.run,5000);//check NetSchedule 5 seconds again
	    }
	}
};
NetSchedule.callback=function(res)
{
	try{
		var n=NetSchedule.currentTask.netData;
		if(n.callback)n.callback(res,n.lObj);
		else if(NetSchedule.currentTask.netData.lObj)NetSchedule.currentCommand(res,NetSchedule.currentTask.netData.lObj);
		else NetSchedule.currentCommand(res);
		NetSchedule.watched(n.watchdog); //remove from watch list if every thing ok
	}
	catch(ex)
	{
	    console.log(ex);
	}
	NetSchedule.run(true);
};
NetSchedule.errorCallback=function(arg)
{
	if(NetSchedule.currentTask.netData.onerror)NetSchedule.currentTask.netData.onerror(arg,NetSchedule.currentTask.netData.lObj);
	NetSchedule.run(true);//force run
};
NetSchedule.watched=function(arg)
{
	if(NetSchedule.watchList[arg])delete NetSchedule.watchList[arg];
};
NetSchedule.watchdogRun=function()
{
	for(var i in NetSchedule.watchList)
	{
		if(NetSchedule.watchList[i] instanceof NetData){
			var n=NetSchedule.watchList[i];
			delete NetSchedule.watchList[i];
			n.watchdog=null; //denay to watch again
			n.review=true; //tells the callback it is review of the watchdog
			NetSchedule.add(n).run();
		}
	}
};

function NetData(url,data,method)
{
	
	this.url=null;
	this.data=null;
	this.method=null;
	this.lObj=null;
	this.callback=null;
	this.watchdog=null;
	this.review=null;
this.url=url;
this.method=method?method.toUpperCase():"GET";
if(typeof(data)=="undefined")
{
    this.data=[];
}
else if(typeof(data)=="string")
{
    
}
else if(data instanceof Array)
{
    this.data=data;
}

this.watchdog=null;//disable watchdog
this.review=false;
	
	this.add=function(param,value,encode)
	{
		if(encode)  this.data[param]=encodeURIComponent(value);
		else this.data[param]=value;
		//if(callback)this.callback=callback;
		return this;
	};
	this.commit=function()
	{
		_ajaxQ.add(this).run();
	};
	this.ifAdd=function(condition,param,value,encode)
	{
		if(condition)this.add(param,value,encode);
		return this;
	};
};




NetData.get=function(net)
{
	this.url=net.target;
	this.data=net.data;
	this.method=net.method;
	
};

function Utility()
{
};




Utility.parseXml=function(xml)
{
	if(window.DOMParser)
	{
	    var parser=new window.DOMParser();
	    var doc=parser.parseFromXML(xml,"text/xml");
	}
	else
	{
	    var doc=new ActiveXObject("Microsoft.DOMXML");
	    doc.async=false;
	    doc.load(xml);
	}
	return doc;
};
Utility.StringForm=function(format,data)
{
	var result=format;
	if(data instanceof Array)
	{
	    
	}
	else if(data instanceof Object)
	{
	    for(var i in data)
	    {
	        result=result.replace(new RegExp("\%"+i+"\%","g"),data[i]);
	    }
	    return result;
	}
	return format;
};
