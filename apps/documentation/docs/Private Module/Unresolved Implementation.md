# Unresolved Implementation

Within the private module, there is one large area of implementation yet to be integrated. This has to do with scraping Canvas Classic Quizzes

# Quiz Dilemma
### Context
When it comes the grabbing quiz data, there are a few nuances. Ideally, data from the quiz overall and questions overall is wanted by professors.   

For overall quiz information, the following data is wanted:
+ Comments
+ Quiz Name
+ Quiz Description
+ Score

For individual quiz question information, the following data is wanted:
+ Correct Comments
+ Incorrect Comments
+ Neutral Comments
+ Additional Comments
+ Score
+ Question Body  
+ Student Answer
+ Question Name and Number

Using the Canvas API, all information can be retrieved except Additional Comments
and Score. Unfortunately, these are the most important resources for the professor.  

Refer to the Canvas API Module to learn more about these specific endpoints and exactly what data is retrieved.
There may be some endpoints that appear to be redundant, but they are all included for a reason. 
For example, There are two endpoints for getting quiz versions: latest and most common. If a professor creates a quiz, do they want
the quiz to be grabbed have the most common version to be used, or the latest version? Every time a quiz is edited in Canvas, 
the version of that quiz changes. Do NOT delete endpoints unless completely convinced they are not necessary. Another 
important example is the difference between quizQuestionsParams versus quizQuestionsNoParams. The untrained eye will think that 
they return the exact same data but they in fact do not. NoParams will return question names while including params yields question numbers instead of the names.  

Those are two examples of nuances from what the Canvas API returns and how to utilize them. There may be more nuances to 
the pre-existing endpoints, but reading a little documentation and research into the Canvas LMS API will clear up any confusion. 

**How to combat the problem of not retrieving all the desired data?**

### Scraping
Since not all the data is accessible through the API, resorting to web-scraping is necessary
Using the professor view in canvas to look at a quiz means that all the required information is rendered onto the page in the HTML. 

This work is ongoing and unfinished. The most upto date information lives in the _scraper_ branch. This 
branch includes the Scraper module. The specific module works to take in a body of text (the quiz html) and to parse out all the neccesary information.
This module by itself should work once it gets integrated into the project. However, since it has not been 
integrated, it has not been tested and therefore there could potentially be some small issues.

The issue with scraping occurs when trying to retrieve the HTML from Canvas. This process, however, works using postman. Here are the steps:
1. Download postman (or some other similar tool)
2. Query the following url (http://sdlstudentvm06.msoe.edu/api/v1/login/session_token?return_to=http://sdlstudentvm06.msoe.edu/courses/2/quizzes/3/history?quiz_submission_id=9). The id's might not be current. If there are any issues. Try connecting to MSOE VPN using globalProtect and then change the ids. This URL should actually match the url in the professor view on the quiz item.
3. Query the session url retrieved from the query above: (http://sdlstudentvm06.msoe.edu/courses/2/quizzes/3/history?quiz_submission_id=9&session_token=eyJjcmVhdGVkX2F0IjoxNzA5NzM1Mjc1LCJwc2V1ZG9ueW1faWQiOjEwMDAwMDAwMDAwMDAxLCJjdXJyZW50X3VzZXJfaWQiOm51bGwsInVzZWRfcmVtZW1iZXJfbWVfdG9rZW4iOnRydWUsInNpZ25hdHVyZSI6eyJfYmluYXJ5IjoiTlRObU1UZzVNMlF6WXpobU9HUTBNMk5qT1RNeVl6WmtNRFE0TkdWaVltUXpNamMwTXpFeU9RPT1cbiJ9fQ) Again, use the that was retrieved, not the specific one in this step. That is just there for reference on what it should look like.

**Now the HTML is retrieved using Postman.** 

When trying to accomplish this using the Canvas API Module within the application, it does not work. 
The reason for the request failing is actually known. It is due to certain cookies not being properly applied during the request. These cookies are: 
+ _csrf_token 
+ _legacy_normandy_session
+ _normandy_session
+ log_session_id

While these cookies are known, and that the issue for why it is not working is due to improperly using these, it is not actually known how to incorporate them correctly.
There will need to be research into how to handle these cookies. 

### Selenium
Another option is to use selenium Web driver to simply login and then retrieve the HTML that way. This is an option that can be pursued if the aforementioned fails. However, this will be difficult to package, it is **HIGHLY** recommended that the cookie issue be resolved instead. 

### Helpful Endpoints 
Using postman, there is a resource called a collection which will store API calls. Some helpful ones
are provided below:
+ Assignments Submissions: http://sdlstudentvm06.msoe.edu/api/v1/courses/1/assignments/4/submissions?include[]=rubric_assessment&include[]=submission_comments&per_page=1000
+ Assignment:  http://sdlstudentvm06.msoe.edu/api/v1/courses/1/assignments/4
+ Get quiz from course using assignments. id of quiz is 4 (http://sdlstudentvm06.msoe.edu/api/v1/courses/1/assignments/4)
+ Users in a course: http://sdlstudentvm06.msoe.edu/api/v1/courses/1/quizzes/1/submissions/2
+ Specific Questions: http://sdlstudentvm06.msoe.edu/api/v1/quiz_submissions/1/questions/1/formatted_answer?answer=12
+ Quiz Submissions: http://sdlstudentvm06.msoe.edu/api/v1/courses/2/quizzes/3/submissions
+ Quiz Question Submissions: http://sdlstudentvm06.msoe.edu/api/v1/quiz_submissions/9/questions?include[]=quiz_question
+ Quiz Type Assignment: http://sdlstudentvm06.msoe.edu/api/v1/courses/2/quizzes/3/questions?&quiz_submission_id=9&quiz_submission_attempt=1
+ Session ID: http://sdlstudentvm06.msoe.edu/api/v1/login/session_token?return_to=http://sdlstudentvm06.msoe.edu/courses/2/quizzes/3/history?quiz_submission_id=9
+ Quiz HTML: http://sdlstudentvm06.msoe.edu/courses/2/quizzes/3/history?quiz_submission_id=9&session_token=eyJjcmVhdGVkX2F0IjoxNzA5NzM1Mjc1LCJwc2V1ZG9ueW1faWQiOjEwMDAwMDAwMDAwMDAxLCJjdXJyZW50X3VzZXJfaWQiOm51bGwsInVzZWRfcmVtZW1iZXJfbWVfdG9rZW4iOnRydWUsInNpZ25hdHVyZSI6eyJfYmluYXJ5IjoiTlRObU1UZzVNMlF6WXpobU9HUTBNMk5qT1RNeVl6WmtNRFE0TkdWaVltUXpNamMwTXpFeU9RPT1cbiJ9fQ
+ Quiz Question File: http://sdlstudentvm06.msoe.edu/api/v1/files/4


**TroubleShooting Endpoints**
Again, if there is an issue follow the steps below before panicking
+ Check to make sure authentication is included in the request (Bearer token)
+ Check to make sure the ids within the url are correct
+ Check if the URL has any typos
+ Check if you are connected to MSOE's network (use global Protect on your machine to connect if not on campus)
+ Check if the type of HTTP request is enable. i.e. (GET, POST, etc...)








































