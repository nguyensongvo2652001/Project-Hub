**NAME**: ProjectHub

**DESCRIPTION**: A fullstack project that allows you to manage projects, tasks, members, changes and metrics.

## Screenshots

Below are some screenshots that I took from this project
![Grafana for monitoring](/media/grafana_screenshot.jpg)
![Project hub personal stat page 1](/media/projectHub_personal_stat.jpg)
![Project hub personal stat page 2](/media/projectHub_personal_stat_2.jpg)
![Project hub project dashboard page](/media/projectHub_project_dashboard_screenshot.jpg)
![Project hub members page](/media/projectHub_project_members_screenshot.jpg)
![ProjectHub project notifications page](/media/projectHub_project_notifications_screenshot.jpg)
![ProjectHub search result page](/media/projectHub_search_result.jpg)
![ProjectHub login page](/media/projectHub_login.jpg)
![ProjectHub not found page](/media/projectHub_404.jpg)
![ProjectHub forbidden page](/media/projectHub_403.jpg)

**TECHNOLOGIES USED**:

1. NodeJS (For backend)
2. MongoDB (For database)
3. Jest (For unit testing)
4. React, HTML, CSS (For frontend)
5. Prometheus and Grafana (For monitoring)
6. Redis (For caching)
7. BackblazeB2 (For storing images)
8. Render.com (For deployment)
9. CronJob (For task scheduling)
10. SendGrid (for sending email)

**MAIN FUNCTIONALITIES AND FEATURES**:

1. Authentication (Login, Signup, Reset password)
2. Create / update / delete / join a project
3. Create / update / delete task
4. Invite and manage members in project
5. View changes in project
6. Visualize and get metric about project (like completion rate, number of newly finished tasks ...)
7. Visualize and get metric about current user.
8. Upload and store images (mostly for user's avatar and background)
9. Search functionality
10. Monitoring (use Grafana and Prometheus)
11. Caching (with Redis)
12. Sending email

**WEBSITE**
Link: project-hub.onrender.com
Email: user1@example.com  
Pass: someThing2605!
**Warning**: Unfortunately SendGrid now requires you to have a business email in order to send emails which I don't have right now so there will be two features that will be affected (reset password and invite new member to project)

## PROJECT STRUCTURE

### Backend

**server.js**: This is where you config environment variables, start cron jobs, connecting to database and start the server
**app.js**: This is where you define all the routes
**models/**: As the name suggest this is the folder to store and the models
**routes/**: This is the folder to store all the routes
**tests/**: The folder that stores and the unit tests
**controllers/**: This folder will maintain all the controllers that are responsible for the "last" task and send the response back to clients. For tasks like validation or authorization, we will put it in middlewares
**middlewares/**: Basically for tasks that are not "directly" related to the main task (for example we need to validate that the user making the request is the owner of a project before letting them delete the project), we will put it in middlewares.
**utils/**: To store useful functions that are not directly related to server, for example: sending email

### frontend

**assets/**: These are some images that will be used either for testing or for visualization purpose.
**components/**: Store all the components that will be used in this project
**contexts/**: Store all the contexts and context providers that will used in this project
**hooks/**: Custom hook for repetitive tasks like useSendRequest for sending request, useIntersectionObserver for infinitiy scroll
**pages/**: Basically pages will be the final component that will be served by React.
**utils/**: Repetitive tasks like capitalizing the first letter of a string
