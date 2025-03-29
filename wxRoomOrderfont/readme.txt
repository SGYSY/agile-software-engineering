# Classroom reservation WeChat mini-program

## Project Introduction
This is a WeChat mini-program designed for a diicsu to book a classroom, users can register and log in through the '@dundee.ac.uk' email address, book a classroom and check the reservation status.

## Project features
1. **User Registration & Login**
- Sign up and log in with the '@dundee.ac.uk' email address.
- Forgot password function is supported.

2. **Classroom Reservation**
- View available classrooms and their status.
- Reserve a classroom and set a time to make an appointment.
- View appointment history and cancel appointments.

3. **Classroom Management**
- Administrators can add, edit, and delete classroom information.
- Admins can review and manage a user's appointment requests.

4. **Notification Function**
- Notification of successful or failed appointments.
- Reminder of appointment time.

## Install and run

### 1. Install WeChat Developer Tools
- Visit [WeChat Developer Tools Official Website](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) to download and install WeChat Developer Tools.
- Once the installation is complete, open the tool and log in with your WeChat account.

### 2. Create a new project
- In WeChat Developer Tools, click "New Project".
- Fill in the project name, AppID (if you already have a registered WeChat Mini Program account), and the project directory.
- Select the appropriate WeChat version and compilation mode (the latest stable version is recommended).
- Click the "Create" button.

### 3. Import the project code
- Clone or copy your project's code locally.
- In WeChat Developer Tools, select "Import Project" and then select the project directory you just created.
- Ensure that the project structure is consistent with the requirements of the WeChat Mini Program.

### 4. Install dependencies
- If npm dependencies are used in your project, you can run the following command in the root directory of your project to install the dependencies:
```bash
npm install