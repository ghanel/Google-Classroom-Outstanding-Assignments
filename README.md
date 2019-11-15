# Google-Classroom-Outstanding-Assignments

Author: gavin@id3.org.uk
Some apps script code snippets borrowed from Oli Trussell

Classroom Api needs to be enabled under resources -> Advanced Google Services
Then view -> Show manifest file
open appscript.json and paste the following line below the STACKDRIVER line 
you may need to add a comma after "STACKDRIVER"
This is needed because the advanced Google services does not properly add the OAuth scopes for Classroom.Courses.CourseWork.StudentSubmissions.list
See https://stackoverflow.com/questions/42799045/permission-denied-using-classroom-courses-coursework-studentsubmissions-list414
and https://stackoverflow.com/questions/42796630/google-classroom-apps-script-coursework-list-permission-error?rq=1

PASTE THE NEXT LINE
"oauthScopes": ["https://www.googleapis.com/auth/classroom.courses", "https://www.googleapis.com/auth/classroom.coursework.me.readonly", "https://www.googleapis.com/auth/classroom.profile.emails", "https://www.googleapis.com/auth/classroom.profile.photos", "https://www.googleapis.com/auth/classroom.rosters", "https://www.googleapis.com/auth/classroom.coursework.me", "https://www.googleapis.com/auth/classroom.coursework.me.readonly", "https://www.googleapis.com/auth/classroom.coursework.students", "https://www.googleapis.com/auth/classroom.coursework.students.readonly"]

deploy this script as a webapp using Publish -> deploy as Web App
Set "execute this app as" -> Me
You should be a user with the correct privileges to read all classrooms in the domain.
This was tested with an account with Super Admin privileges
Set "Who has access to the app" -> Users in your domain

Web app URL can be embedded e.g. in Google sites, or deployed standalone
