function Watchdog(timeout,tasks){
	this.tasks=tasks?tasks:{};
	this.keys=Object.keys(this.tasks);
	this.timeout=timeout?timeout:3000;
	this.fuse=Date.now();
	this.taskIndex=-1;
	this.check=function(){
		if(this.fuse<(Date.now()-this.timeout)){
			this.fuse=Date.now();
			this.callNext();
		}else{
			setTimeout(this.check,this.timeout);
		}
	};
	this.done=function(label,call_next){
		var index=this.keys.indexOf(label);
		if(index>-1){
			if(this.taskIndex==index){
				this.fuse=Date.now();
				this.callNext();
			}
		}
	};
	this.callNext=function(){
		this.taskIndex++;
		var task=this.tasks[this.keys[this.taskIndex]];
		if(task){
			task(this); //send watchdog to the task to control it
			setTimeout(this.check,this.timeout);
		}
	};
	this.run=function(){
		this.taskIndex=-1; this.callNext();
	}

}