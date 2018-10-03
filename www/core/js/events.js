function onLogedIn(watchdog){
	if(!LU.login){
		Libre.log('login...');
		_("#splash").addClass('hide');//hide splash screen after login
		Messenger.onHome();//show home dialog
		if(typeof(CAuth)!="undefined"){
		  Messenger.currentUID=CAuth.activeObject.uid;
		}
		configMessenger();//in this file
		FollowContact.uid=Messenger.currentUID;
		UserInfo.getDB(); //connect to database
		LU.peopleRoot=UniversalServer.getServer(3,
		FollowContact.parseUid(FollowContact.uid,true)).url;
		FollowContact.read();
		//Device
		if(typeof(device)!="undefined"){
		  if(device.uuid){
		    Libre.log('updating device info...')
		    Device.cordova(Messenger.currentUID); //cordova jobs by jointab device
		  }
		}
		LU.login=true;
	}
}
function configMessenger(watchdog){//for test call on onLogedIn()
	if(!LU.startedMessenger){
      Libre.log('Connected.');
      Messenger.config();
      Conversation.config();
      ConvSetting.config();
      //var msg=new Messenger(_("#workPan").source);
      Conversation.install();
      LU.startedMessenger=true;
    }
}
function checkDeviceContacts(watchdog){
	if(!LU.loadDeviceContact){
		Libre.log('Loading device contacts...');
		//ContactCheck.config();//start to check contacts then trigger contactchecked to start messenger
		setTimeout(ContactCheck.config,200);//check contacts after 200 ms
		LU.loadDeviceContact=true;
	}
}
function onGetMeCompleted(uinfo){
	Messenger.showMeOnSidebar(uinfo);//show me on sidebar
	UserInfo.load(Object.keys(FollowContact.list));//load all contact users
}


