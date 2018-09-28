function jetXtra()
{
};



jetXtra.startX=null;
jetXtra.startY=null;
jetXtra.deltaX=null;
jetXtra.deltaY=null;
jetXtra.oldStartEvent=null;
jetXtra.oldMoveEvent=null;
jetXtra.oldEndEvent=null;
jetXtra.activeObject=null;
jetXtra.resizeStartX=null;
jetXtra.resizeStartY=null;
jetXtra.oldMoveEvent=null;


jetXtra.moveable=function(obj,callback)
{
	if(typeof(obj)=="string")obj=document.getElementById(obj);
	else if(typeof(JetHtml)!="undefined"){ if(obj instanceof JetHtml)obj=obj.source;}
	
	obj.dragStarted=false;
	obj.addEventListener("mousedown",jetXtra.drStart,false);
	//obj.addEventListener("mousemove",jetXtra.drMove,false);
	obj.parentNode.onmousemove=jetXtra.drMove;
	obj.addEventListener("mouseup",jetXtra.drEnd,false);
	
	obj.addEventListener("touchstart",jetXtra.drStart,false);
	obj.addEventListener("touchmove",jetXtra.drMove,false);
	obj.addEventListener("touchend",jetXtra.drEnd,false);
	obj.addEventListener("touchcancel",jetXtra.drStart,false);
	
	obj.jetParentObject=null;//this is not jack for initial
	
	obj.moveCallback=callback;
};
jetXtra.resizable=function(obj,callback)
{
	if(typeof(obj)=="string")obj=document.getElementById(obj);
	else if(typeof(JetHtml)!="undefined"){ if(obj instanceof JetHtml)obj=obj.source;}
	
	var jack=document.createElement("div");
	jack.setAttribute("style","background-color:white;border:1px solid gray;width:2px;height:2px;position:absolute;bottom:2px;right:2px;");
	//jack.setAttribute("style","background-color:white;border:1px solid gray;width:2px;height:2px;position:absolute;");
	obj.appendChild(jack);
	//obj.parentNode.appendChild(jack);
	jetXtra.moveable(jack);
	jack.jetParentObject=obj;
	/*jack.style.left=obj.offsetLeft+obj.offsetWidth+"px";
	jack.style.top=obj.offsetTop+obj.offsetHeight+"px";
	jack.style.zIndex=parseInt(obj.style.zIndex)+1;*/
	obj.resizeCallback=callback;
};
jetXtra.drStart=function(event)
{
	jetXtra.activeObject=event.target;
	jetXtra.activeObject.dragStarted=true;
	
	jetXtra.startX=jetXtra.activeObject.offsetLeft;
	jetXtra.startY=jetXtra.activeObject.offsetTop;
	
	jetXtra.oldMoveEvent=jetXtra.activeObject.onmousemove;
	
	if(event.type=="mousedown")
	{
	    jetXtra.deltaX=event.clientX-jetXtra.activeObject.offsetLeft;
	    jetXtra.deltaY=event.clientY-jetXtra.activeObject.offsetTop;
	}
	else if(event.type=="touchstart")
	{
	    try
	    {
	        
	        jetXtra.deltaX=event.changedTouches[0].clientX-jetXtra.activeObject.offsetLeft;
	        jetXtra.deltaY=event.changedTouches[0].clientY-jetXtra.activeObject.offsetTop; 
	    }
	    catch(ex)
	    {
	        
	    }
	}
	
	//for resize
	if(jetXtra.activeObject.jetParentObject)//then it is a jack
	{
	    jetXtra.resizeStartX=jetXtra.activeObject.jetParentObject.offsetWidth;
	    jetXtra.resizeStartY=jetXtra.activeObject.jetParentObject.offsetHeight;
	}
};
jetXtra.drMove=function(event)
{
	if(jetXtra.activeObject)if(jetXtra.activeObject.dragStarted)
	{
	    if(event.type=="mousemove")
	    {
	        jetXtra.activeObject.style.left=event.clientX-jetXtra.deltaX+"px";
	        jetXtra.activeObject.style.top=event.clientY-jetXtra.deltaY+"px";
	    }
	    else if(event.type=="touchmove")
	    {
	        try
	        {
	            
	            jetXtra.activeObject.style.left=event.changedTouches[0].clientX-jetXtra.deltaX+"px";
	            jetXtra.activeObject.style.top=event.changedTouches[0].clientY-jetXtra.deltaY+"px";
	        }
	        catch(ex)
	        {
	            
	        }
	    }
	    
	    //resize
	    if(jetXtra.activeObject.jetParentObject)
	    {
	        jetXtra.activeObject.jetParentObject.style.width=jetXtra.resizeStartX+(jetXtra.activeObject.offsetLeft-jetXtra.startX)-
	        (parseInt(jetXtra.activeObject.jetParentObject.style.paddingLeft?jetXtra.activeObject.jetParentObject.style.paddingLeft:0)
	        +parseInt(jetXtra.activeObject.jetParentObject.style.paddingRight?jetXtra.activeObject.jetParentObject.style.paddingRight:0))+"px";
	        
	        jetXtra.activeObject.jetParentObject.style.height=jetXtra.resizeStartY+(jetXtra.activeObject.offsetTop-jetXtra.startY)-
	        (parseInt(jetXtra.activeObject.jetParentObject.style.paddingTop?jetXtra.activeObject.jetParentObject.style.paddingTop:0)+
	        parseInt(jetXtra.activeObject.jetParentObject.style.paddingBottom?jetXtra.activeObject.jetParentObject.style.paddingBottom:0))+"px";
	    }
	}
};
jetXtra.drEnd=function(event)
{
	if(jetXtra.activeObject.jetParentObject)//this is jack
	{
	    if(jetXtra.activeObject.jetParentObject.resizeCallback)
	    {
	        jetXtra.activeObject.jetParentObject.resizeCallback(jetXtra.activeObject.jetParentObject,"resized");
	    }
	}
	
	//movecallback
	if(jetXtra.activeObject.moveCallback)
	{
	    jetXtra.activeObject.moveCallback(jetXtra.activeObject,"moved");
	}
	
	if(jetXtra.activeObject)
	{
	    jetXtra.deltaX=0;
	    jetXtra.deltaY=0;
	    jetXtra.activeObject.dragStarted=false;
	    jetXtra.activeObject=null;
	}
};
jetXtra.drCancel=function(event)
{
	jetXtra.deltaX=0;
	jetXtra.deltaY=0;
	jetXtra.activeObject.dragStarted=false;
	jetXtra.activeObject=null;
};
jetXtra.direction=function(obj,onMinimum)
{
	if(typeof(obj)=="string")obj=document.getElementById(obj);
	else if(typeof(JetHtml)!="undefined"){ if(obj instanceof JetHtml)obj=obj.source;}
	
	var text=obj.nodeName.toLowerCase()=="input"?obj.value:obj.innerHTML;
	var faStr="ابپتثجچهخدذرزژسشصضطظعغفقکگلمنوهی";
	var pat1=new RegExp("["+faStr+"]+");
	var pat2=new RegExp("^\\s*["+faStr+"]+");
	if(onMinimum)
	{
	    if(text.search(pat1)>=0)
	    {
	        obj.style.direction="rtl";
	        obj.style.textAlign="right";
	    }
	    else
	    {
	        obj.style.direction="ltr";
	        obj.style.textAlign="left";
	    }
	}
	else
	{
	    if(text.search(pat2)>=0)
	    {
	        obj.style.direction="rtl";
	        obj.style.textAlign="right";
	    }
	    else
	    {
	        obj.style.direction="ltr";
	        obj.style.textAlign="left";
	    }
	}
};
