function JetApp()
{
};



JetApp.form=null;
JetApp.classRegister=null;
JetApp.dictionary=null;
JetApp.currentClass=null;
JetApp.uid=null;
JetApp.groupId=null;


JetApp.register=function(className,classType)
{
	if(!JetApp.classRegister)JetApp.classRegister={};
	JetApp.classRegister[className]=classType;
};
JetApp.buildForm=function(o,view,par,defClassName)
{
	for(var cls in JetApp.classRegister)
	{
		if(o instanceof JetApp.classRegister[cls]){
			var className=cls;
		}
	}
	if(!className && defClassName)className=defClassName;
	JetApp.currentClass=className;
	if(view==2 && JetApp.classRegister[className].buildItem)
	    JetApp.classRegister[className].buildItem(o);
	else
	    var dlg=JetApp.form[className][view];
	if(view==2)
	{
	    //for operation
	    var ownResult=false;
	    if(JetApp.classRegister[className].checkPrivilege)ownResult=JetApp.classRegister[className].checkPrivilege(o);
	    var owner= o.owner || o.uid;
	    var groupId= o.groupId?o.groupId:"NO GROUP ID";
	    if((owner=JetApp.uid || groupId==JetApp.groupId || ownResult) && JetApp.form[className].ownerOperation)
	    {
	    	dlg=dlg.replace("%operation%",JetApp.form[className].ownerOperation);
	    }
	    else if(JetApp.form[className].userOperation)
	    {
	    	dlg=dlg.replace("%operation%",JetApp.form[className].userOperation);
	    }
	    else
	    {
	    	dlg=dlg.replace("%operation%","");
	    }
	}
	
	dlg=JetApp.bindToObject(o,dlg,JetApp.dictionary);
	var c=null;
	if(JetApp.form[className+view+"par"])
	{
		c=document.createElement(JetApp.form[className+view+"par"]);
	}
	else if((view%2) !==0 )c=document.createElement('div');
	else if(view==2) var c=document.createElement('tr');
	//else var c=document.createElement('li');//view=4 and others
	if(c){
		c.innerHTML=dlg;
		if(JetApp.form[className+view+"cssClass"])c.setAttribute('class',JetApp.form[className+view+"cssClass"]);
	}
	else c=dlg;
	
	
	if(par)
	{
	    par=typeof(par)=="string"?document.getElementById(par):par;
	    if(typeof(c)=="string")par.innerHTML+=c;
	    else par.appendChild(c);
	}
	var fn=null;
	if((fn=JetApp.classRegister[className].bind))
	{
		if(fn.length==2)
			fn(o,c);/* object and control */
		else if(fn.length==3)
			fn(o,c,view);/* object, control and view */
	}
	return c;
};
JetApp.bindToObject=function(o,dlg,dic)
{
	var objPat=null;
	var lbl=/\%(\w+)\-lbl\%/g;
	if(o)for(var i in o)
	{
		if(typeof(o[i])=="object")
		{
			//dlg=JetApp.bindToObject(o,dlg,dic);
		}
		else
		{
		    objPat=new RegExp("\%"+i+"\%","g");
		    dlg=dlg.replace(objPat,o[i]);
		}
	}
	if(dic)
	{
	    while((r=lbl.exec(dlg)))
	    {
	        dlg=dlg.replace(r[0],dic[r[1]]);
	    }
	}
	return dlg;
};
JetApp.config=function()
{
	JetApp.form={};
};
JetApp.listItems=function(arr,view,par,className)
{
	if(!view)view=2;
	if(arr instanceof Array)
	{
	    var c=(view==2)?document.createElement('table'):document.createElement('ul');
	    var id="";
	    if(typeof(par)=="string")
	    {
	        id=par+"Items";
	        par=document.getElementById(par);
	    }
	    else if(par)
	    {
	        id=par.getAttribute('id')+"Items";
	    }
	    else
	    {
	        if(typeof(LU))
	        {
	            par=document.getElementById(LU.painterArea);
	            id=LU.painterArea+"Items";
	        }
	    }
	    c.setAttribute('id',id);
	    if(view==2){
	        var header=document.createElement('tr');
	        header.setAttribute('class','header');
	        c.appendChild(header);
	    }
	    if(par)par.appendChild(c);
	    for(var i=0;i<arr.length;i++)
	    {
	        JetApp.buildForm(arr[i],view,c,className);
	    }
	    if(view==2){
	        var hdlg=JetApp.form[JetApp.currentClass || className][view];
	        hdlg=JetApp.bindToObject(StrRes,hdlg);
	        header.innerHTML=hdlg;
	    }
	    return c;
	}
};
