if(typeof(Libre)=="undefined")Libre={};
Libre.promptClass="";
Libre.images={};
Libre.menu=new Object();
Libre.menu.items=[];
Libre.menu.getItem=function(title,icon,command,cssClass)
{
	var c=document.createElement("li");
	c.setStyle=function(s){this.setAttribute('style',s);return c;}
	if(icon)c.innerHTML="<img src=\""+icon+"\" />";
	if(title)c.innerHTML=title;
	if(command)c.onclick=command;
	if (cssClass)c.setAttribute("class",cssClass);
	return c;
}
Libre.menu.clearItems=function()
{
	_("#menuItemList").value("");
};
Libre.menu.addItem=function(inner)
{
	if(typeof(inner)=="object")
		_("#menuItemList").source.appendChild(inner);
	else
		_("#menuItemList").source.innerHTML+=inner;
};
Libre.menu.clearTools=function()
{
	_("#menuItemTools").value("");
};
Libre.menu.addTool=function(inner)
{
	if(typeof(inner)=="object")
		_("#menuItemTools").source.appendChild(inner);
	else
		_("#menuItemTools").source.innerHTML+=inner;
};
Libre.work={};
Libre.work.show=function(inner)
{
	_("#workPan").value(inner);
};
Libre.status={};
Libre.status.show=function(inner)
{
	_("#statusPan").value(inner);
};
Libre.sidebar={};
Libre.sidebar.visibleStatus=true;
Libre.sidebar.visible=function(visible)
{
	if(typeof(visible)=="undefined")visible=!Libre.sidebar.visibleStatus;
	Libre.sidebar.visibleStatus=visible;
	var btnImage='normalSidebar';
	if (visible)
	{
		_("#sidebar").attr("class","sidebar sidebarNormal");
		if(Libre.sidebar.pined)_("#workPan").attr("class","workPanNormal");
		btnImage='setSidebar';
  }else{
  		if(Libre.sidebar.pined)Libre.sidebar.pin(false);
		_("#sidebar").attr("class","sidebar sidebarFwork");
		_("#workPan").attr("class","workPanFwork");
	}
	_("#sidebarBtn").attr('src',Libre.images[btnImage]);
};
Libre.sidebar.pined=false;
Libre.sidebar.pin=function(a){
	if(typeof(a)=="undefined")a=!Libre.sidebar.pined;
	Libre.sidebar.pined=a;
	var btnImage='normalPin';
	if(a){btnImage='setPin'; Libre.sidebar.visible(true);}
	_("#pinBtn").attr('src',Libre.images[btnImage]);
}
Libre.sidebar.show=function(inner)
{
	_("#sidebar").value(inner);
};
Libre.floatbar={};
Libre.floatbar.visibleStatus=false;
Libre.floatbar.visible=function(visible)
{
	Libre.floatbar.visibleStatus=visible;
	if(visible)
	{
        _("#floatbar").attr("class","visibleFloatbar");
    }
	else
	{
		_("#floatbar").attr("class","invisibleFloatbar");
	}
};
Libre.floatbar.show=function(inner)
{
	_("#floatbar").value(inner);
};
Libre.prompt=function(question,callback,answer)
{
	if (!answer)answer="";
	if (Libre.prompt.dialog)Libre.prompt.close();
	Libre.prompt.callback=callback;

	var back=document.createElement("div");
	back.setAttribute("class","windowback");
	back.onclick=Libre.prompt.close;
	var dlg=document.createElement("div");
	dlg.setAttribute("class","popupDialog"+(Libre.promptClass?" "+Libre.promptClass:""));

	title=document.createElement('p');
	title.innerHTML=question;
	var inp=document.createElement('input');
	inp.setAttribute('type','text');
	inp.setAttribute("value",answer);
	inp.setAttribute("class","textbox");
	Libre.prompt.input=inp;
	var submit=document.createElement('button');
	submit.setAttribute("class","orange btn");
	submit.innerHTML="OK";
	submit.onclick=Libre.prompt.submit;
	var inpArea=document.createElement('p');
	inpArea.appendChild(inp); inpArea.appendChild(submit);
	dlg.appendChild(title); dlg.appendChild(inpArea);
	back.appendChild(dlg);
	document.body.appendChild(back);
	Libre.prompt.dialog=back; //background dialog
	dlg.onclick=Libre.prompt.stopClose;
};
Libre.prompt.callback=null;
Libre.prompt.dialog=null;
Libre.prompt.input=null;
Libre.prompt.close=function()
{
	try{document.body.removeChild(Libre.prompt.dialog);}catch(ex){}
};
Libre.prompt.submit=function()
{
	Libre.prompt.close();
	if (Libre.prompt.callback) {
        Libre.prompt.callback(Libre.prompt.input.value);
    }
    Libre.prompt.callback=null;
};
Libre.prompt.stopClose=function(evt)
{
	if(evt.stopPropagation)evt.stopPropagation();
	evt.cancelBubble=true;
}
Libre.stopPropagation=function(e){
	if(e.stopPropagation)e.stopPropagation();
	e.cancelBubble=true;
}
Libre.alert=function(text,callback) //uses prompt dialog as default
{
	if (Libre.prompt.dialog)Libre.prompt.close();
	Libre.alert.callback=callback;

	var back=document.createElement("div");
	back.setAttribute("class","windowback");
	back.onclick=Libre.alert.close;
	var dlg=document.createElement("div");
	dlg.setAttribute("class","dialogBox"+(Libre.promptClass?" "+Libre.promptClass:""));

	title=document.createElement('p');
	title.innerHTML=text;
	
	var submit=document.createElement('button');
	submit.setAttribute("class","orange btn");
	submit.innerHTML="OK";
	submit.onclick=Libre.alert.submit;
	var inpArea=document.createElement('p'); inpArea.appendChild(submit);
	dlg.appendChild(title); dlg.appendChild(inpArea);
	back.appendChild(dlg);
	document.body.appendChild(back);
	Libre.prompt.dialog=back; //background dialog
	dlg.onclick=Libre.alert.stopClose;
};
Libre.alert.callback=null;
Libre.alert.close=function()
{
	try{document.body.removeChild(Libre.prompt.dialog);}catch(ex){} //alert uses prompt dialog also (variable)
};
Libre.alert.submit=function()
{
	Libre.alert.close();
	if (Libre.alert.callback)Libre.alert.callback();
	Libre.alert.callback=null;
};
Libre.alert.stopClose=function(evt)
{
	if(evt.stopPropagation)evt.stopPropagation();
	evt.cancelBubble=true;
}
