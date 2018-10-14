function Gesture(start,end){
	this.start=start; this.end=end;
};
Gesture.x=0; Gesture.y=1;
Gesture.listo=null;
Gesture.window=null;//JetHtml Object
Gesture.width=0; Gesture.height=0;
Gesture.callback=null;
Gesture.config=function(el){
	if(!el)el=document.body;
	el.addEventListener('touchstart',Gesture.start,true);
	el.addEventListener('touchmove',Gesture.move,true);
	el.addEventListener('touchend',Gesture.end,true);
	el.addEventListener('touchcancel',Gesture.cancel,true);
	//Gesture.window=new JetHtml(document.body);
	Gesture.width=document.body.offsetWidth;
	Gesture.height=document.body.offsetHeight;
};
Gesture.start=function(e){
	//e.preventDefault(); //if this line runs other touch functionality will disable
	Gesture.listo=[];
	var touches=e.changedTouches;
	for(var i=0;i<touches.length;i++){
		Gesture.listo[i]=new Gesture([touches[i].pageX,touches[i].pageY],null);
	}
};
Gesture.move=function(e){
	//e.preventDefault();
};
Gesture.end=function(e){
	//e.preventDefault();
	var touches=e.changedTouches;
	for(var i=0;i<touches.length;i++){
		Gesture.listo[i].end=[touches[i].pageX,touches[i].pageY];
	}
	if(Gesture.callback)Gesture.callback(Gesture.listo);
};
Gesture.cancel=function(e){
	//e.preventDefault();
	Gesture.listo=null;
};
Gesture.isLeft=function(g){
	if(g.start[Gesture.x]<(Gesture.width/2) || g.end[Gesture.x]<(Gesture.width/2))return true;
	else return false;
};
Gesture.isTop=function(g){
	if(g.start[Gesture.y]<(Gesture.height/2) || g.end[Gesture.y]<(Gesture.height/2))return true;
	else return false;
};
Gesture.isToLeft=function(g){
	if(g.start[Gesture.x]>g.end[Gesture.x])return true;
	else return false;
};
Gesture.isToTop=function(g){
	if(g.start[Gesture.y]>g.end[Gesture.y])return true;
	else return false;
};
Gesture.delta=function(g){
	return [
		g.start[Gesture.x]-g.end[Gesture.x],
		g.start[Gesture.y]-g.end[Gesture.y]
	];
};