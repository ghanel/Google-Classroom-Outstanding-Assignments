//Author: gavin@id3.org.uk
//Some apps script code snippets borrowed from Oli Trussell
//
//Classroom Api needs to be enabled under resources -> Advanced Google Services
//Then view -> Show manifest file
//open appscript.json and paste the following line below the STACKDRIVER line 
//you may need to add a comma after "STACKDRIVER"
//This is needed because the advanced Google services does not properly add the OAuth scopes for Classroom.Courses.CourseWork.StudentSubmissions.list
//See https://stackoverflow.com/questions/42799045/permission-denied-using-classroom-courses-coursework-studentsubmissions-list414
//and https://stackoverflow.com/questions/42796630/google-classroom-apps-script-coursework-list-permission-error?rq=1
//
//
//
//PASTE THE NEXT LINE
//"oauthScopes": ["https://www.googleapis.com/auth/classroom.courses", "https://www.googleapis.com/auth/classroom.coursework.me.readonly", "https://www.googleapis.com/auth/classroom.profile.emails", "https://www.googleapis.com/auth/classroom.profile.photos", "https://www.googleapis.com/auth/classroom.rosters", "https://www.googleapis.com/auth/classroom.coursework.me", "https://www.googleapis.com/auth/classroom.coursework.me.readonly", "https://www.googleapis.com/auth/classroom.coursework.students", "https://www.googleapis.com/auth/classroom.coursework.students.readonly"]
//and remove the // from the start
//
//
//
//deploy this script as a webapp using Publish -> deploy as Web App
//Set execute this app as -> Me
//You should be a user with the correct privileges to read all classrooms in the domain.
//This was tested with an account with Super Admin privileges
//Who has access to the app -> Users in your domain
//
//Web app URL can be embedded e.g. in Google sites, or deployed standalone
//
//

function doGet(e) {
  var tmp = HtmlService.createTemplateFromFile('html')
  return tmp.evaluate()
  .setSandboxMode(HtmlService.SandboxMode.IFRAME).setTitle("Google Classroom Assignments").addMetaTag('viewport', 'initial-scale=1.0,width=device-width');
}

function getCourses() {
  var email = Session.getActiveUser().getEmail()
  var courseArray = [];
  try{var courses = Classroom.Courses.list({
    courseStates: "ACTIVE",
    studentId: email
  }).courses;
      for (var c = 0; c < courses.length; c++) {
        var course = courses[c];
        var name = course.name;
        var section = course.section;
        if (section != undefined) {
          var name = name + " " + section;
        }
        var link = course.alternateLink;
        var id = course.id;
        var teachers = course.teacherGroupEmail;
        courseArray.push([name, id, link, teachers]);
      }
      var work = getCourseWork(courseArray, email);
      return work}
  catch(e){
    //Student has no courses
    return []
  }
}

function getCourseWork(courseArray, email) {
  var workArray = [];
  for (var c = 0; c < courseArray.length; c++) {
    var course = courseArray[c];
    var name = course[0];
    var id = course[1];
    try {
      var works = Classroom.Courses.CourseWork.list(id).courseWork
      try {
        for (var w = 0; w < works.length; w++) {
          var work = works[w];
          var title = work.title;
          var link = work.alternateLink
          var due = work.dueDate;
          var type = work.workType;
          try {
            var dueDate = new Date(due.year, due.month - 1, due.day);
            var dueDate = Utilities.formatDate(dueDate, Session.getScriptTimeZone(), "dd/MM/yyyy")
            } catch (e) {
              var dueDate = "No due date"
              }
          var submission = Classroom.Courses.CourseWork.StudentSubmissions.list(id, work.id, {
            userId: email
          })
          if (submission.studentSubmissions[0].state != "TURNED_IN" || submission.studentSubmissions[0].state != "RETURNED") {
            workArray.push([type, name, title, link, dueDate]);
          }
        }
      } catch (error) {
        Logger.log('noWork');
      }
    } catch (error) {
      Logger.log(error);
      Logger.log('could not get work');
    }
  }
  return workArray
}