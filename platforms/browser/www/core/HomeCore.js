function HomeCore()
{
};



HomeCore.panelPath=null;
HomeCore.countryCodes=null;
HomeCore.defaultCountryCode='98';
HomeCore.phoneMode=false;
HomeCore.currentFragment=null;


HomeCore.onChangeLanguage=function()
{
	
};
HomeCore.setInputError=function(id,errorText)
{
	var x=_("#"+id);
	x.source.style.border="2px solid #b22222";
	if(errorText)
	{
	    x.source.setAttribute("placeholder",errorText);
	    x.value("");
	}
};
HomeCore.checkFragment=function()
{
	var fragment=window.location.hash.substring(1,window.location.hash.length);
	HomeCore.currentFragment=fragment;
	if(HomeCore.fragmentFunction[fragment])HomeCore.fragmentFunction[fragment]();
	else
	{
	    var reg=_("#register-dialog").source;
	    var log=_("#login-dialog").source;
	    switch(fragment)
	    {
	        case 'register':
	            log.style.display='none';
	            reg.style.display='inline-block';
	            HomeCore.loadCountryCodes();
	            break;
	            
	        case 'login':
	            log.style.display='inline-block';
	            reg.style.display='none';
	            break;
	        
	        case 'logout':
	            
	            break;
	    }
	}
};
HomeCore.setFragment=function(fragment)
{
	window.location.hash=fragment;
	HomeCore.checkFragment();
};
HomeCore.start=function()
{
	HomeCore.fragmentFunction=[];
	if(window.location.hash==="")
	{
	    HomeCore.setFragment("login");
	}
	else
	{
	    HomeCore.checkFragment();
	}
};
HomeCore.loadCountryCodes=function(res)
{
		if(res){
			var ls=JSON.parse(res);
			HomeCore.countryCodes=ls;
			prefix=HomeCore.currentFragment=="login"?'L':'';
			var codeCmb=document.getElementById('countryCode'+prefix);
			var nameCmb=document.getElementById('countryName'+prefix);
			HomeCore.fillCountryBoxes(codeCmb,nameCmb);
			
		}else{
			if(!HomeCore.countryCodes || typeof(jsClientApp)=="undefined"){
				var n=new NetData();
				n.url='/res/countries.json';
				n.callback=HomeCore.loadCountryCodes;
				_ajaxQ.add(n);
				_ajaxQ.run();
			}else{
				prefix=HomeCore.currentFragment=="login"?'L':'';
				var codeCmb=document.getElementById('countryCode'+prefix);
				var nameCmb=document.getElementById('countryName'+prefix);
				HomeCore.fillCountryBoxes(codeCmb,nameCmb);
			}
		}
};
HomeCore.onCountrySet=function(which,prefix)
{
	prefix=prefix?prefix:'';
	switch(which){
		case 'title':
			_('#countryCode'+prefix).value(_('#countryName'+prefix).value());
			break;
		case 'code':
			_('#countryName'+prefix).value(_('#countryCode'+prefix).value());
			break;
	}
};
HomeCore.fillCountryBoxes=function(codeCmb,nameCmb)
{
	var ls=HomeCore.countryCodes;
	var codes=[]; 
	for(var i=0;i<HomeCore.countryCodes.length;i++){
		if(codes.indexOf(HomeCore.countryCodes[i].code)<0) codes.push(HomeCore.countryCodes[i].code);
	}
	codes.sort();
	codeCmb.innerHTML=""; nameCmb.innerHTML=""; //clear
	for(i=0;i<ls.length;i++){
		var nopt=document.createElement('option');
		nopt.innerHTML=ls[i].title;
		nopt.value=ls[i].code;
		
		if(ls[i].code==HomeCore.defaultCountryCode){
			nopt.setAttribute('selected','selected');
		}
		nameCmb.appendChild(nopt);
	}
	
	for(i=0;i<codes.length;i++){
		var copt=document.createElement('option');
		copt.innerHTML="+"+codes[i];
		copt.value=codes[i];
		
		if(codes[i]==HomeCore.defaultCountryCode){
			copt.setAttribute('selected','selected');
		}
		codeCmb.appendChild(copt);
	}
};
HomeCore.analyzeLoginName=function()
{
	if(HomeCore.phoneMode){
		var loginName=_("#phoneTxbL").value();
		if(parseInt(loginName)>0){
			//nothing
		}else{
			_('#userLoginField').removeClass('hide');
			_('#phoneLoginField').addClass('hide');
			_('#loginNameTxb').value(loginName);
			HomeCore.phoneMode=false;
		}
	}else{
		var loginName=_("#loginNameTxb").value();
		if(parseInt(loginName)>0){
			//logged with phone
			if(HomeCore.countryCodes)
				HomeCore.fillCountryBoxes(_('#countryCodeL').source,_('#countryNameL').source);
			else
				HomeCore.loadCountryCodes();
			_('#userLoginField').addClass('hide');
			_('#phoneLoginField').removeClass('hide');
			_('#phoneTxbL').value(loginName);
			HomeCore.phoneMode=true;
		}
	}
};
HomeCore.onKeyPress=function(e)
{
	if(e.keyCode==13){
		var id=e.target.getAttribute('id');
		switch(window.location.hash){
			case '#login':
				if(id=="loginNameTxb" || id=="phoneTxbL"){
					//HomeCore.analyzeLoginName();
					if(_("#passwordTxb").value()){
						User.login();
					}else{
						_("#passwordTxb").source.focus();
					}
					return;
				}
				if(id=="passwordTxb"){
					if(HomeCore.phoneMode){
						if(_("#passwordTxb").value() && _("#phoneTxbL").value())User.login();
						else if(_("#phoneTxbL").value())alert("Please Enter the password");
						else _("#phoneTxbL").source.focus();
					}else{
						if(_("#passwordTxb").value() && _("#loginNameTxb").value())User.login();
						else if(_("#loginNameTxb").value())alert("Please Enter the password");
						else _("#loginNameTxb").source.focus();
					}
				}
				
				break;
			case '#register':
				
				break;
		}
	}
};
