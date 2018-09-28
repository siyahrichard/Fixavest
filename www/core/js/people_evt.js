function oncuadsearch(msg)
{
	var param="";
	var pan=document.getElementById("contentPan");
	pan.innerHTML="";
	var val=msg.value;
	/*for(var i=0;i<val.length;i++)
	{
		if(val[i].nodeType==3)
		{
			param+=val[i].nodeValue;
		}
	}*/
	People.search(val);
}