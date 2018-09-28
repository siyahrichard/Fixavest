function MomentUI(title,showDate,showCalendar,showTime,showZone,moment)
{
	
	this.showDate=null;
	this.showTime=null;
	this.showCalendar=null;
	this.showZone=null;
	this.moment=null;
	this.dlg=null;
	this.parent=null;
	this.index=null;
	this.title=null;
this.title=title;
this.showDate=showDate?showDate:false;
this.showTime=showTime?showTime:false;
this.showCalendar=showCalendar?showCalendar:false;
this.showZone=showZone?showZone:false;
this.moment=moment?moment:new Moment();

this.index=MomentUI.count;
MomentUI.count++;

	
	this.buildForm=function(parent,cssClass)
	{
		if(!MomentUI.configed)MomentUI.config();
		
		this.parent=(typeof(parent)=="object")?parent:document.getElementById(parent);
		this.dlg=document.createElement("div");
		this.cssClass=cssClass?cssClass:"momentUI";
		this.dlg.setAttribute("class",this.cssClass);
		
		if(this.showDate)
		{
		    var ddlg=document.createElement("div");
		    ddlg.setAttribute("class","date");
		    ddlg.innerHTML="<input type=\"number\" id=\"year"+this.index+"\" value=\"1900\" min=\"1900\" max=\"2100\"/>/<input type=\"number\" id=\"month"+this.index+"\" value=\"1\" min=\"1\" max=\"12\"/>/<input type=\"number\" id=\"day"+this.index+"\" value=\"1\" min=\"1\" max=\"31\" />";
		    this.dlg.appendChild(ddlg);
		}
		
		if(this.showTime)
		{
		    var tdlg=document.createElement("div");
		    tdlg.setAttribute("class","time");
		    tdlg.innerHTML="<input type=\"number\" id=\"hour"+this.index+"\" value=\"12\" min=\"0\" max=\"23\"/>:<input type=\"number\" id=\"minute"+this.index+"\" value=\"0\" min=\"0\" max=\"59\"/>:<input type=\"number\" id=\"second"+this.index+"\" value=\"0\" min=\"0\" max=\"59\" /><select id=\"noon"+this.index+"\"><option value=\"0\">24h</option><option value=\"1\">AM</option><option value=\"2\">PM</option></select>";
		    this.dlg.appendChild(tdlg);
		}
		
		if(this.showCalendar || this.showZone)
		{
		    var opt=null;
		    var zdlg=document.createElement("div");
		    zdlg.setAttribute("class","zone");
		    if(this.showCalendar)
		    {
		       var calChb=document.createElement("select");
		       calChb.setAttribute("id","calendar"+this.index);
		       var keys=Object.keys(MomentUI.calendars);
		       for(var i=0;i<keys.length;i++)
		       {
		            opt=document.createElement("option");
		            //opt.value=MomentUI.calendars[keys[i]];
		            opt.setAttribute("value",keys[i]);
		            opt.innerHTML=MomentUI.calendars[keys[i]];
		            calChb.appendChild(opt);
		       }
		       zdlg.appendChild(calChb);
		    }
		    if(this.showZone)
		    {
		        var zone=document.createElement("select");
		        zone.setAttribute("id","zone"+this.index);
		        for(var i=0;i<MomentUI.zoneTimes.length;i++)
		        {
		            opt=document.createElement("option");
		            opt.value=MomentUI.zoneTimes[i].value;
		            opt.innerHTML="("+opt.value+")  "+MomentUI.zoneTimes[i].title;
		            zone.appendChild(opt);
		        }
		        zdlg.appendChild(zone);
		    }
		    this.dlg.appendChild(zdlg);
		}
		this.parent.appendChild(this.dlg);
		this.update();
	};
	this.value=function()
	{
		if(!this.moment instanceof Moment)this.moment=new Moment();
		this.moment.calendar=Moment.gregorian;
		if(this.showDate)
		{
		    this.moment.year=parseInt(_("#year"+this.index).value());
		    this.moment.month=parseInt(_("#month"+this.index).value());
		    this.moment.day=parseInt(_("#day"+this.index).value());
		}
		
		if(this.showTime)
		{
		    this.moment.hour=parseInt(_("#hour"+this.index).value());
		    this.moment.minute=parseInt(_("#minute"+this.index).value());
		    this.moment.second=parseInt(_("#second"+this.index).value());
		    this.moment.noon=_("#noon"+this.index).value();
		}
		
		if(this.showCalendar)
		{
		    this.moment.calendar=_("#calendar"+this.index).value();
		}
		
		if(this.showZone)
		{
		    this.moment.zone=_("#zone"+this.index).value();
		}
		
		return this.moment;
	};
	this.update=function()
	{
		if(this.showDate)
		{
		    _("#year"+this.index).value(this.moment.year);
		    _("#month"+this.index).value(this.moment.month);
		    _("#day"+this.index).value(this.moment.day);
		}
		if(this.showTime)
		{
		    _("#hour"+this.index).value(this.moment.hour);
		    _("#minute"+this.index).value(this.moment.minute);
		    _("#second"+this.index).value(this.moment.seconds);
		    _("#noon"+this.index).value(this.moment.noon);
		}
		if(this.showCalendar)_("#calendar"+this.index).value(this.moment.calendar);
		if(this.showZone)_("#zone"+this.index).value(this.moment.zone);
	};
};



MomentUI.zoneTimes=null;
MomentUI.count=0;
MomentUI.configed=false;


MomentUI.config=function(dic)
{
	MomentUI.zoneTimes=[
	new Pair("UTC/GMT","0:0"),
	new Pair("European Central Time","+1:00"),
	new Pair("Eastern European Time	","+2:00"),
	new Pair("(Arabic) Egypt Standard Time","+2:00"),
	new Pair("Eastern African Time","+3:00"),
	new Pair("Middle East Time","+3:30"),
	new Pair("Near East Time","+4:00"),
	new Pair("Pakistan Lahore Time","+5:00"),
	new Pair("India Standard Time","+5:30"),
	new Pair("Bangladesh Standard Time","+6:00"),
	new Pair("Vietnam Standard Time","+7:00"),
	new Pair("China Taiwan Time","+8:00"),
	new Pair("Japan Standard Time","+9:00"),
	new Pair("Australia Central Time","+9:30"),
	new Pair("Australia Eastern Time","+10:00"),
	new Pair("Solomon Standard Time","+11:00"),
	new Pair("New Zealand Standard Time","+12:00"),
	new Pair("Midway Islands Time","-11:00"),
	new Pair("Hawaii Standard Time","-10:00"),
	new Pair("Alaska Standard Time","-9:00"),
	new Pair("Pacific Standard Time","-8:00"),
	new Pair("Phoenix Standard Time","-7:00"),
	new Pair("Mountain Standard Time","-7:00"),
	new Pair("Central Standard Time","-6:00"),
	new Pair("Eastern Standard Time","-5:00"),
	new Pair("Indiana Eastern Standard Time","-5:00"),
	new Pair("Puerto Rico and US Virgin Islands Time","-4:00"),
	new Pair("Canada Newfoundland Time","-3:30"),
	new Pair("Argentina Standard Time","-3:00"),
	new Pair("Brazil Eastern Time","-3:00"),
	new Pair("Central African Time","-1:00")
	];
	
	if(dic)
	{
		MomentUI.calendars={
		  1:dic['gregorian'],
		  2:dic['solar'],
		  3:dic['lunar']
		};
	}
	else
	{
		MomentUI.calendars={
		  //"Gregorian":1,
		 // "Persian-Solar":2
			 1:"Gregorian",
			 2:"Persian-Solar"
		};
	}
};

function Pair(title,value)
{
	
	this.title=null;
	this.value=null;
this.title=title;
this.value=value;
};




function ActiveButton(title,activeTitle,style,activeStyle,icon,activeIcon,active,onclick)
{
	
	this.title=null;
	this.activeTitle=null;
	this.style=null;
	this.activeStyle=null;
	this.active=null;
	this.onclick=null;
	this.currentIndex=null;
	this.parent=null;
	this.dlg=null;
	this.icon=null;
	this.activeIcon=null;
	this.titlePan=null;
	this.iconPan=null;
	this.param=null;
this.title=title;
this.activeTitle=activeTitle;
this.style=style;
this.activeStyle=activeStyle;
this.icon=icon;
this.activeIcon;
this.active=active?true:false;
this.onclick=onclick;

if(ActiveButton.count===0)ActiveButton.list=[];
this.index=ActiveButton.count;
ActiveButton.count++;

ActiveButton.list[this.index]=this;
};



ActiveButton.count=0;
ActiveButton.list=null;


ActiveButton.toggle=function(btn)
{
	btn.active=!btn.active;
	if(btn.active)
	{
	    btn.dlg.setAttribute("class",btn.activeStyle);
	    btn.titlePan.innerHTML=btn.activeTitle;
	    if(btn.icon)btn.iconPan.backgroundImage=btn.activeIcon;
	}
	else
	{
	    btn.dlg.setAttribute("class",btn.style);
	    btn.titlePan.innerHTML=btn.title;
	    if(btn.icon)btn.iconPan.backgroundImage=btn.icon;
	}
};
ActiveButton.buildForm=function(btn,parent)
{
	btn.dlg=document.createElement("div");
	btn.dlg.setAttribute("onclick","ActiveButton.onclick("+btn.index+")");
	btn.titlePan=document.createElement("span");
	btn.titlePan.setAttribute("class","title");
	
	if(btn.icon)
	{
	    var innerDlg=document.createElement("div");
	    innerDlg.setAttribute("class","innerDlg");
	    btn.dlg.appendChild(innerDlg);
	    btn.iconPan=document.createElement("div");
	    btn.iconPan.setAttribute("class","icon");
	    btn.innerDlg.appendChild(btn.iconPan);
	    btn.innerDlg.appendChild(btn.titlePan);
	}
	else
	{
	    btn.dlg.appendChild(btn.titlePan);
	}
	
	btn.active=!btn.active;
	ActiveButton.toggle(btn);//rebuild style and also change last change active mode
	
	btn.parent=typeof(parent)=="string"?document.getElementById(parent):parent;
	btn.parent.appendChild(btn.dlg);
};
ActiveButton.onclick=function(index)
{
	var btn=ActiveButton.list[index];
	ActiveButton.toggle(btn);
	if(btn.onclick)btn.onclick(btn);//send btn object to onclick function pointer
	// be careful btn.onclick is a function pointer not a internal function
};

function Doclist(title,content)
{
	
	this.dlg=null;
	this.title=null;
	this.body=null;
	this.parent=null;
	this.cssClass=null;
	this.content=null;
	this.bodyPan=null;
	this.contentPan=null;
this.title=title;
this.content=content;
	
	this.buildForm=function(parent,cssClass)
	{
		this.parent=typeof(parent)=="object"?parent:document.getElementById(parent);
		this.cssClass=cssClass?cssClass:"docList";
		
		this.dlg=document.createElement("div");
		this.dlg.setAttribute("class",this.cssClass);
		
		this.titlePan=document.createElement("div");
		this.titlePan.setAttribute("class","title");
		this.titlePan.innerHTML=this.title;
		this.dlg.appendChild(this.titlePan);
		
		this.bodyPan=document.createElement("div");
		this.bodyPan.setAttribute("class","body");
		
		if(typeof(this.content)=="string")this.bodyPan.innerHTML=this.content;
		else this.bodyPan.appendChild(this.content);
		
		this.dlg.appendChild(this.bodyPan);
		
		this.parent.appendChild(this.dlg);
	};
	this.clear=function()
	{
		this.bodyPan.innerHTML="";
	};
	this.append=function(arg)
	{
		if(typeof(arg)=="string")this.bodyPan.innerHTML+=arg;
		else if(arg instanceof Array)for(var i in arg)this.append(arg[i]);
		else if(arg) this.bodyPan.appendChild(arg);
	};
};



