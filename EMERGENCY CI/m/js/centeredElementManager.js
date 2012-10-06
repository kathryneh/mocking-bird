/* CenteredElementManager
* 
* Models CenteredElementManager
*/

//** An object to manage all elements to be centered
var CenteredElementManager=function(){
    //get a reference to this
    var self = this;
    
    //List of centered elements
    self.elementList = new Array();
    
    //set up the window resize centering
    $(window).resize(function(){
	//Only do centering if the screen is still bigger than the minimum screen width
	if($(window).width()>parseInt($('header').css('min-width'))){
	    for(var i=0; i<self.elementList.length; i++){
		//Recenter each element appropriately, but don't add them to the list
		self.centerElement(self.elementList[i].elem, self.elementList[i].dir, self.elementList[i].ref, true);
	    }
	}
    });
}
    
//** Center an element in respect to some reference point, element: the element to be centered, [direction]: the direction the element should be centered (top, left, or both) Defaults to both, [reference] : The reference element for the primary element to be centered in.  Defaults to body, [noAdd]: Defaults to false, whether or not to not add the element to the list of elements to be centered on window resizes
CenteredElementManager.prototype.centerElement =function (element, direction, reference, noAdd){
    if(reference==null){
	reference=$('body');
    }
    //Center horizontally
    if(!direction||direction=='left'){
	element.css({
	    'left' : reference.width()/2 - element.width()/2
	});
    }
    //Center vertically
    if(!direction||direction=='top'){
	element.css({
	   'top' : reference.height()/2 - element.height()/2 
	});
    }
    //Add the element to the list
    if(!noAdd){
	this.addCenterElement(element, direction, reference);
    }
}
    
//** Add an element to the list of centered elements, element: the element to be added, type: the direction the element should be centered, reference: the element to be referenced as center
CenteredElementManager.prototype.addCenterElement = function (element, type, reference){
    this.elementList.push({elem : element, dir : type, ref: reference});
}