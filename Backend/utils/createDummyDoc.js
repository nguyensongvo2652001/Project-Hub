const dotenv = require("dotenv");
dotenv.config({ path: "../env/main.env" });

const User = require("../models/user");
const ProjectMember = require("../models/projectMember");

const { connectDB } = require("./db");
const Project = require("../models/project");
const Task = require("../models/task");
const Notification = require("../models/notification");

const deleteAllData = async () => {
  await Task.deleteMany();
  await Notification.deleteMany();
  await ProjectMember.deleteMany();
  console.log("Finished");
};

const createDummyUsers = async () => {
  const password = "someThing2605!";
  const names = [
    "John Doe",
    "Jane Smith",
    "Alice Johnson",
    "Bob Thompson",
    "Emily Davis",
    "David Wilson",
    "Lily Anderson",
    "Michael Brown",
    "Sophia Clark",
    "William Turner",
  ];
  const jobTitles = [
    "Software Engineer",
    "Data Analyst",
    "Product Manager",
    "Marketing Specialist",
    "Graphic Designer",
    "Sales Representative",
    "Human Resources Manager",
    "Financial Analyst",
    "Operations Coordinator",
    "Customer Service Representative",
  ];
  for (let i = 1; i <= 10; ++i) {
    const email = `user${i}@example.com`;
    await User.create({
      email,
      password,
      name: names[i - 1],
      jobTitle: jobTitles[i - 1],
    });
  }
  console.log("done");
};

const createDummyProjects = async () => {
  const projectTags = [
    "Security",
    "Software",
    "Website",
    "Data",
    "Software",
    "AI",
    "CloudComputing",
    "Software",
    "AI",
    "Other",
  ];
  const projectNames = [
    "SecureTech",
    "TechConnect",
    "CodeGenius",
    "DataSage",
    "TechForge",
    "RoboTech",
    "CloudScale",
    "InnoCode",
    "AIWizard",
    "QuantumLeap",
  ];
  const status = ["private", "public"];
  const descriptions = [
    "SecureTech is an advanced cybersecurity platform that offers comprehensive protection against data breaches and cyber threats. With its cutting-edge encryption algorithms and real-time threat monitoring, your sensitive data will remain secure and your digital assets protected. Stay one step ahead with SecureTech!",
    "TechConnect is a revolutionary technology integration platform that enables seamless communication and collaboration across all your devices. With its intuitive user interface and powerful features, you can effortlessly connect and sync your devices, making your digital life more streamlined and efficient. Experience the future of technology with TechConnect!",
    "CodeGenius is an innovative coding education platform that empowers aspiring developers to master the art of programming. Our interactive lessons, real-world projects, and personalized feedback will help you unlock your coding potential and become a coding genius. Start your coding journey with CodeGenius today!",
    "DataSage is a data analytics platform that empowers businesses to harness the power of data for intelligent decision-making. With its advanced data visualization tools, predictive analytics capabilities, and easy-to-use interface, you can uncover valuable insights and drive growth. Maximize your data potential with DataSage!",
    "TechForge is a leading-edge technology solutions provider that specializes in custom software development and digital transformation. Our team of experts combines cutting-edge technologies with industry best practices to deliver scalable and innovative solutions that drive business success. Trust TechForge for all your technology needs!",
    "RoboTech is a pioneering robotics and AI company that is pushing the boundaries of technological advancements. From humanoid robots to autonomous drones, our state-of-the-art solutions are revolutionizing industries and transforming the way we live and work. Join us on the forefront of robotics with RoboTech!",
    "CloudScale is a cloud-based technology platform that offers scalable and flexible solutions for businesses of all sizes. With its robust infrastructure, reliable performance, and extensive range of services, you can leverage the power of the cloud to drive efficiency, reduce costs, and accelerate growth. Scale your business with CloudScale!",
    "InnoCode is a tech innovation lab that combines creativity and coding expertise to build groundbreaking solutions. We work closely with clients to understand their unique challenges and develop custom software applications that disrupt industries and drive digital transformation. Join us in shaping the future with InnoCode!",
    "AIWizard is an artificial intelligence platform that harnesses the power of machine learning and deep learning algorithms to deliver intelligent and automated solutions. From natural language processing to computer vision, our AI-powered tools and services empower businesses to unlock new possibilities and achieve unparalleled success. Experience the magic of AI with AIWizard!",
    "QuantumLeap is a quantum computing company at the forefront of the quantum revolution. Our cutting-edge quantum computers and algorithms offer unparalleled processing power, enabling businesses to solve complex problems and tackle previously unsolvable challenges. Take a leap into the quantum realm with QuantumLeap!",
  ];

  for (let i = 0; i < 10; ++i) {
    const owner = await User.findOne({ email: `user${i + 1}@example.com` });
    await Project.create({
      name: projectNames[i],
      tag: projectTags[i],
      description: descriptions[i],
      status: status[i % 2],
      owner: owner._id,
    });
  }

  console.log("done");
};

function getRandomNumbersExcluding(i) {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const excludedNumbers = [i];

  // Remove the excluded number from the array
  const availableNumbers = numbers.filter(
    (num) => !excludedNumbers.includes(num)
  );

  // Shuffle the available numbers
  const shuffledNumbers = availableNumbers.sort(() => Math.random() - 0.5);

  // Take the first 3 numbers from the shuffled array
  const randomNumbers = shuffledNumbers.slice(0, 3);

  return randomNumbers;
}

function getRandomIntegers(k, i) {
  const integers = [];

  while (integers.length < k) {
    const randomInt = Math.floor(Math.random() * (i + 1));
    if (!integers.includes(randomInt)) {
      integers.push(randomInt);
    }
  }

  return integers;
}

const createProjectMemberAndNotifications = async () => {
  const projectNames = [
    "SecureTech",
    "TechConnect",
    "CodeGenius",
    "DataSage",
    "TechForge",
    "RoboTech",
    "CloudScale",
    "InnoCode",
    "AIWizard",
    "QuantumLeap",
  ];

  for (let i = 0; i < 10; ++i) {
    const project = await Project.findOne({ name: projectNames[i] });
    const randomNumbers = getRandomNumbersExcluding(i);
    const invitedUserEmails = [
      `user${randomNumbers[0] + 1}@example.com`,
      `user${randomNumbers[1] + 1}@example.com`,
      `user${randomNumbers[2] + 1}@example.com`,
    ];
    for (let j = 0; j < 3; ++j) {
      const invitedUser = await User.findOne({ email: invitedUserEmails[j] });
      await Notification.create({
        initiator: project.owner,
        type: process.env.NOTIFICATION_PROJECT_INVITATION_TYPE,
        scope: "personal",
        receiver: invitedUser._id,
        detail: project,
      });

      await Notification.create({
        initiator: invitedUser._id,
        type: process.env.NOTIFICATION_PROJECT_INVITATION_CONFIRM_TYPE,
        scope: "project",
        receiver: project._id,
      });

      await ProjectMember.create({
        projectId: project._id,
        memberId: invitedUser._id,
      });
    }
  }

  console.log("done");
};

function getRandomDay(startDate, endDate) {
  const startTimestamp = startDate.getTime();
  const endTimestamp = endDate.getTime();
  const randomTimestamp = Math.floor(
    startTimestamp + Math.random() * (endTimestamp - startTimestamp + 1)
  );
  const randomDate = new Date(randomTimestamp);
  return randomDate;
}

const createTaskAndNotifications = async () => {
  // Each project shoula have 10 tasks with all possible status
  // Each task should be created by a random user in that project
  // Create notification for that
  const projectNames = [
    "SecureTech",
    "TechConnect",
    "CodeGenius",
    "DataSage",
    "TechForge",
    "RoboTech",
    "CloudScale",
    "InnoCode",
    "AIWizard",
    "QuantumLeap",
  ];

  const taskNames = [
    "Implement user authentication",
    "Fix bug in data validation",
    "Write unit tests for API endpoints",
    "Refactor code for better performance",
    "Document API documentation",
    "Perform database migration",
    "Design responsive UI for mobile devices",
    "Optimize database queries",
    "Create automated deployment pipeline",
    "Implement search functionality",
    "Fix compatibility issues with Internet Explorer",
    "Write technical documentation",
    "Optimize front-end loading speed",
    "Upgrade third-party libraries",
    "Develop RESTful API endpoints",
    "Fix cross-browser styling issues",
    "Implement data caching mechanism",
    "Conduct security vulnerability assessment",
    "Create user onboarding flow",
    "Integrate payment gateway",
  ];

  const taskTypes = [
    "feature",
    "bug",
    "test",
    "refactor",
    "document",
    "maintenance",
    "design",
    "maintenance",
    "feature",
    "feature",
    "bug",
    "document",
    "maintenance",
    "maintenance",
    "feature",
    "bug",
    "feature",
    "maintenance",
    "feature",
    "feature",
  ];

  const taskDescriptions = [
    "Securely implement user authentication functionality to ensure only authorized users can access the system.",
    "Address a bug in the data validation process to prevent incorrect or invalid data from being accepted.",
    "Develop comprehensive unit tests to verify the functionality and reliability of API endpoints.",
    "Optimize the existing codebase to improve performance and enhance overall system efficiency.",
    "Create detailed documentation for the API, including usage instructions and example requests and responses.",
    "Migrate the database to a new version or structure while ensuring data integrity and minimal downtime.",
    "Design and develop a user interface that adapts seamlessly to different screen sizes and devices.",
    "Optimize database queries to reduce response times and improve overall database performance.",
    "Implement an automated deployment pipeline to streamline the deployment process and ensure consistent and efficient releases.",
    "Integrate search functionality to enable users to easily search and retrieve specific information from the system.",
    "Resolve compatibility issues and ensure proper functioning of the system on Internet Explorer browser.",
    "Create comprehensive technical documentation that provides insights into the system architecture, components, and implementation details.",
    "Improve front-end loading speed by optimizing asset sizes, leveraging caching techniques, and employing performance best practices.",
    "Update and upgrade third-party libraries and dependencies to leverage new features, bug fixes, and security enhancements.",
    "Design and implement RESTful API endpoints to enable seamless communication and data exchange with other systems.",
    "Address styling inconsistencies and ensure consistent visual appearance across different web browsers.",
    "Implement a data caching mechanism to improve response times and reduce the load on the underlying data storage.",
    "Perform a thorough security assessment to identify and address potential vulnerabilities in the system.",
    "Design and develop a user-friendly onboarding flow to guide new users through the registration and setup process.",
    "Integrate a secure and reliable payment gateway to facilitate online payment processing and transactions.",
  ];

  const taskStatusOptions = ["open", "doing", "testing", "overdue", "closed"];
  for (let i = 0; i < 10; ++i) {
    console.log("Project", i);
    const project = await Project.findOne({ name: projectNames[i] });
    const memberships = await ProjectMember.find({ projectId: project._id });

    for (let j = 0; j < 10; ++j) {
      const randomNameIndex = Math.floor(Math.random() * 20);
      const randomTaskStatusIndex = Math.floor(Math.random() * 5);
      const randomCreatorIndex = Math.floor(Math.random() * 3);
      const numberOfDevelopers = Math.floor(Math.random() * 3);

      const taskName = taskNames[randomNameIndex];
      const taskType = taskTypes[randomNameIndex];
      const taskDescription = taskDescriptions[randomCreatorIndex];
      const taskStatus = taskStatusOptions[randomTaskStatusIndex];
      const creator = memberships[randomCreatorIndex].memberId;
      const randomDevelopersIndex = getRandomIntegers(numberOfDevelopers, 2);
      const developers = [];
      for (let j = 0; j < numberOfDevelopers; ++j) {
        const developerIndex = randomDevelopersIndex[j];
        const membership = memberships[developerIndex];
        developers.push(membership.memberId);
      }
      let task;
      if (taskStatus === "overdue") {
        const randomCreatedDate = getRandomDay(
          new Date(2022, 9, 1),
          new Date(2023, 2, 1)
        );
        const randomStartDate = getRandomDay(
          randomCreatedDate,
          new Date(2023, 2, 1)
        );
        const randomDeadline = getRandomDay(
          randomCreatedDate,
          new Date(2023, 2, 1)
        );

        task = await Task.create({
          projectId: project._id,
          creator,
          dateCreated: randomCreatedDate,
          startDate: randomStartDate,
          deadline: randomDeadline,
          developers,
          name: taskName,
          status: taskStatus,
          type: taskType,
          description: taskDescription,
        });
      } else if (taskStatus === "closed") {
        const randomCreatedDate = getRandomDay(
          new Date(2022, 9, 1),
          new Date(2023, 4, 1)
        );
        const randomStartDate = getRandomDay(
          randomCreatedDate,
          new Date(2023, 4, 1)
        );
        const randomDeadline = getRandomDay(
          randomCreatedDate,
          new Date(2023, 4, 1)
        );

        const randomFinishDate = getRandomDay(randomStartDate, randomDeadline);

        task = await Task.create({
          projectId: project._id,
          creator,
          dateCreated: randomCreatedDate,
          startDate: randomStartDate,
          deadline: randomDeadline,
          finishDate: randomFinishDate,
          developers,
          name: taskName,
          status: taskStatus,
          type: taskType,
          description: taskDescription,
        });
      } else {
        const randomCreatedDate = getRandomDay(
          new Date(2022, 9, 1),
          new Date(2023, 4, 1)
        );
        const randomStartDate = getRandomDay(
          randomCreatedDate,
          new Date(2023, 4, 1)
        );
        const randomDeadline = new Date(2025, 7, 1);

        task = await Task.create({
          projectId: project._id,
          creator,
          dateCreated: randomCreatedDate,
          startDate: randomStartDate,
          deadline: randomDeadline,
          developers,
          name: taskName,
          status: taskStatus,
          type: taskType,
          description: taskDescription,
        });
      }

      await Notification.create({
        initiator: creator,
        type: process.env.NOTIFICATION_NEW_TASK_TYPE,
        scope: "project",
        receiver: project._id,
        detail: task,
      });

      console.log("finish create task", j);
    }
  }

  console.log("done");
};

(async () => {
  let uri = process.env.DB_STRING;
  uri = uri.replace(/<password>/, process.env.DB_PASSWORD);
  uri = uri.replace(/<databaseName>/, process.env.DB_NAME);
  await connectDB(uri);
  await deleteAllData();
  await createProjectMemberAndNotifications();
  await createTaskAndNotifications();
})();
