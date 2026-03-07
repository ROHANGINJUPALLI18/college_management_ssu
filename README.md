# college-management
You are a senior full-stack engineer helping build a production-style web application.

Build a **Student Result Management System** using the following stack:

Tech Stack

* Next.js (App Router)
* Firebase (Firestore + Authentication)
* Cloudinary (for image storage like student ID photos)
* Tailwind CSS
* Shadcn UI components (for professional UI) & ui should be simple and clean
* React Hook Form (for forms)
* Zod (for validation)
* for state management use the redux , redux toolkit and rtk query

The application should look **clean, minimal, and professional**, similar to university portals.
Avoid bright colors and excessive UI effects. The design should look **human-designed**, simple and structured.

Use **purple and gold theme inspired by Sikkim Skill University**.

Primary Color: #2F0A5E
Accent Color: #F6B100
Background: White / Light Gray

Do not over-engineer. Implement only the features described below.

---

PROJECT OVERVIEW

Build a web application where:

1. Students log in using Roll Number + Date of Birth.
2. Students can view and download their results.
3. Admin can add students.
4. Admin can post or update results.
5. Clicking a student card determines whether to add or update results.

---

APPLICATION STRUCTURE

Pages:

Public

* Landing Page

Student

* Student Login
* Student Dashboard
* Result Details Page

Admin

* Admin Login
* Admin Dashboard
* Student Admission Page
* Student List
* Add Result Page
* Update Result Page


---
keep the names of the functions very clear and if anyone read the function name or file name they should understand what does the funtion is doing or what does the file is doing . this is very important , function name can be more larger and while i read it , it should be understandable
---

---



FOLDER STRUCTURE

Create the project with the following structure(u don't need to use the similar structure use can use it any way like you want but follow the naming of the function and files name strictly):

src
app
page.tsx
student-login/page.tsx
admin-login/page.tsx
student-dashboard/page.tsx
result/[rollNo]/page.tsx
admin-dashboard/page.tsx
admin/students/page.tsx
admin/add-result/[rollNo]/page.tsx
admin/update-result/[rollNo]/page.tsx

components
navbar.tsx
student-card.tsx
result-table.tsx
sidebar.tsx
student-id-card.tsx

lib
firebase.ts
cloudinary.ts

services
studentService.ts
resultService.ts

types
student.ts
result.ts

---



FIREBASE SETUP

Use Firebase Firestore as the database.

Collections:

students

Document structure:

rollNo (string)
name (string)
dob (string)
course (string)
photoUrl (string)
resultPosted (boolean)
createdAt (timestamp)

Example:

{
rollNo: "22BCS001",
name: "Rahul Kumar",
dob: "2003-06-14",
course: "BCA",
photoUrl: "cloudinary-url",
resultPosted: false
}

results

Document structure:

rollNo (string)
subjects (array)

subjects example:

[
{ name: "Mathematics", marks: 85 },
{ name: "Physics", marks: 78 },
{ name: "Computer Science", marks: 91 },
{ name: "English", marks: 74 }
]

---

AUTHENTICATION

Student Login

Fields:

* Roll Number
* Date of Birth

Logic:

1. Student enters roll number and DOB.
2. Query Firestore "students" collection.
3. If rollNo + dob match, allow login.
4. Store student session in local storage.

Admin Login

Hardcode admin credentials for simplicity:

email: [admin@university.com](mailto:admin@university.com)
password: admin123

---

LANDING PAGE

Create a professional university landing page.

Sections:

* Navbar
* Hero Section
* Announcement bar
* Login buttons

Navbar menu items:

About
Programmes
Admissions
Student Zone
Placements
Login

Hero Section:

Left side text:

"Welcome to
Student Result Portal"

Right side:

University building image.

Use purple hero background.

---

ADMIN DASHBOARD

Layout:

Sidebar (left)
Main content area (right)

Sidebar menu:

* Student Admission
* Student List
* Logout

---

STUDENT ADMISSION PAGE

Form fields:

Name
Roll Number
Date of Birth
Course
Student Photo

Photo upload should use Cloudinary.

After submission:

1. Upload image to Cloudinary
2. Save student document in Firestore
3. resultPosted should be false

---

STUDENT LIST PAGE

Fetch all students from Firestore.

Display as clickable cards.

Card content:

Student Name
Roll Number
Course

Each card should be clickable.

---

IMPORTANT RESULT POSTING LOGIC

When admin clicks a student card:

Check field:

resultPosted

If resultPosted = false

Navigate to:

/admin/add-result/[rollNo]

If resultPosted = true

Navigate to:

/admin/update-result/[rollNo]

---

ADD RESULT PAGE

Form fields:

Subject 1 + Marks
Subject 2 + Marks
Subject 3 + Marks
Subject 4 + Marks
Subject 5 + Marks

Submit button: "Post Result"

On submit:

1. Save result document in "results" collection
2. Update student.resultPosted = true
3. Redirect to student list

---

UPDATE RESULT PAGE

Fetch existing result.

Show marks in editable form.

Button: "Update Result"

On submit:

Update result document.

---

STUDENT DASHBOARD

After login show:

Student ID Card

Fields:

Photo
Name
Roll Number
Course

Below that show:

Semester Results

Button:

View Result

---

RESULT PAGE

Display results in table format.

Columns:

Subject
Marks

Also show:

Total Marks
Average

Add button:

Download Result

Use html2pdf or jspdf to generate PDF.

---

UI GUIDELINES

Use Shadcn UI components.

Design rules:

* Clean spacing
* Professional typography
* Avoid flashy colors
* Use subtle borders
* Card based layouts
* Sidebar admin panel
* Responsive design

---

COMPONENTS TO CREATE

Navbar
Sidebar
StudentCard
ResultTable
StudentIDCard

---

SERVICES

studentService.ts

Functions:

getStudents()
getStudentByRollNo()
createStudent()
updateStudent()

resultService.ts

Functions:

createResult()
getResultByRollNo()
updateResult()

---

FINAL REQUIREMENTS

The application must:

* Be clean and maintainable
* Use modular components
* Follow Next.js best practices
* Use Tailwind and Shadcn UI
* Use Firebase Firestore
* Use Cloudinary for image uploads
* Implement the result posting logic correctly

Do not add unnecessary features.

Focus only on:

* Student login
* Admin student admission
* Result posting
* Result updating
* Student result viewing
* Result download

The final UI should look like a real university portal and not like an AI-generated demo.
