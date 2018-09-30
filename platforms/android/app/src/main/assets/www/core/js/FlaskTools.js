function FLHome()
{
};



FLHome.buttons=null;
FLHome.currentType=null;


FLHome.show=function(par)
{
	FLHome.buttons={
		"all":"allSearchBtn",
		"contact":"contactSearchBtn",
		"message":"messageSearchBtn",
		"web":"webSearchBtn"
	};
	par.innerHTML="<div style=\"padding:5px;background-color: midnightblue\"><img style=\"width: 50px;height: 50px;vertical-align: middle;margin-right: 10px\" src=\"res/image/png/logo.png\"/><button id=\"allSearchBtn\" class=\"blue btn b5\" onclick=\"FLHome.setType('all');\">All</button><button id=\"contactSearchBtn\" class=\"orange btn b5\" onclick=\"FLHome.setType('contact');\">Contacts</button><button id=\"messageSearchBtn\" class=\"blue btn b5\" onclick=\"FLHome.setType('message');\">Messages</button><button id=\"webSearchBtn\" class=\"blue btn b5\" onclick=\"FLHome.setType('web');\">Web</button></div><div id=\"resultArea\" style=\"margin:5px;border:1px solid gray;border-radius: 5px;padding:5px;box-shadow: 2px 2px 20px gray;background:linear-gradient(to right,white,#F8E5FF);\"><p style=\"margin:1vw\">Features:<ul style=\"margin:3vh\"><li>Edit/Delete and unsend messages</li><li>Flag Messages</li><li>Run applications and Play games (in this version only chess)</li><li>View message status (sent,received,seen)</li><li>Search over messages and contacts</li></ul></p><p style=\"margin:1vw\">Features of next version:<ul style=\"margin:3vh\"><li>Upload files</li><li>Record audio and video</li><li>Drawing application</li><li>Application status snapshop</li><li>Edit profile information directly</li><li>Search over the web</li><li>Support for system notification</li><li>Scheduled send message</li><li>Messaging panel and API for business</li></ul></p></div>";
};
FLHome.setType=function(type)
{
	FLHome.currentType=type;
	var keys=Object.keys(FLHome.buttons);
	for(var i=0;i<keys.length;i++){
		if(keys[i]==type)
			_("#"+FLHome.buttons[keys[i]]).attr('class','orange btn b5');
		else
			_("#"+FLHome.buttons[keys[i]]).attr('class','blue btn b5');
	}
};

function FLSetting()
{
};



FLSetting.buttons=null;
FLSetting.currentType=null;


FLSetting.show=function(par)
{
	FLSetting.buttons={
		"device":"deviceSettingBtn",
		"contact":"contactSettingBtn",
		"message":"messageSettingBtn",
		"user":"userSettingBtn"
	};
	if(typeof(device)=="undefined"){
		var device={
			'platform':'Browser',
			'manufacturer':'unknown',
			'model':'unknown'
		};
	}
	par.innerHTML="<div style=\"padding:5px;background-color: midnightblue\"><img style=\"width: 50px;height: 50px;vertical-align: middle;margin-right: 10px\" src=\"res/image/png/setting.png\"/><button id=\"deviceSettingBtn\" class=\"orange btn b5\" onclick=\"FLSetting.setType('device');\">Device</button><button id=\"contactSettingBtn\" class=\"blue btn b5\" onclick=\"FLSetting.setType('contact');\">Contacts</button><button id=\"messageSettingBtn\" class=\"blue btn b5\" onclick=\"FLSetting.setType('message');\">Messages</button><button id=\"userSettingBtn\" class=\"blue btn b5\" onclick=\"FLSetting.setType('user');\">User</button></div><div id=\"resultArea\" style=\"margin:5px;border:1px solid gray;border-radius: 5px;padding:5px;box-shadow: 2px 2px 20px gray;background:linear-gradient(to right,white,#F8E5FF);\"><div id=\"deviceSettingPan\"><table><tr><td>Platform:</td><td>%platform%</td></tr><tr><td>Manufacturer:</td><td>%manufacturer%</td></tr><tr><td>Model:</td><td>%device_model%</td></tr></table></div><div id=\"contactSettingPan\" class=\"hide\"><button class=\"green btn b5\" onclick=\"ContactCheck.refresh()\">Refresh Contacts</button></div><div id=\"messageSettingPan\" class=\"hide\"></div><div id=\"userSettingPan\" class=\"hide\"><table><tr><td>UID:</td><td>%uid%</td></tr></table></div></div>"
	.replace('%platform%',device.platform).replace('%manufacturer%',device.manufacturer).replace('%device_model%',device.model).replace('%uid%',Messenger.currentUID);
};
FLSetting.setType=function(type)
{
	FLSetting.currentType=type;
	var keys=Object.keys(FLSetting.buttons);
	for(var i=0;i<keys.length;i++){
		if(keys[i]==type)
			_("#"+FLSetting.buttons[keys[i]]).attr('class','orange btn b5');
		else
			_("#"+FLSetting.buttons[keys[i]]).attr('class','blue btn b5');
		_("#"+keys[i]+"SettingPan").attr('class',"hide");
	}
	
	_("#"+type+"SettingPan").attr('class',"");
};
