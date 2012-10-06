/* Teacher
* 
* Models professors and other instructors who may be associated with a course.
*/

var Teacher = function (first, last, dept, email, office) {
	this.first = first;
	this.last = last;
	this.dept = dept;
	this.email = email;
	this.office = office;

	this.courses = this.courses = new ClassManager();
}