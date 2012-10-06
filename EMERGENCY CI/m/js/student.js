/* Student
* 
* Models student
*/

var Student = function (first, last, pid, major, email) {
	this.first = first;
	this.last = last;
	this.pid = pid;
	this.major = major;
	this.email = email;
	this.hours = 0;
	this.courses = new ClassManager();
}
