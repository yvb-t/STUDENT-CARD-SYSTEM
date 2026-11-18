Student Card System
A small React app for creating, editing and browsing student ID cards. Every card is built from the same reusable parts, so the preview and the roster always match.

Features
Flippable card with a front (photo pattern, name, programme, ID, validity, semester strip) and a back (barcode, status, return notice)
Live editing: changes appear on the card as you type
Roster grid with search by name or ID
Add and delete students
Department colour coding
Expired cards show an Expired badge and a struck-through name
Keyboard accessible (Tab to a card, Enter or Space to flip)
Light and dark mode, reduced-motion support
Quick start
The app is a single file, StudentCardSystem.jsx, with no dependencies beyond React 18 or later.



bash
# 1. Create a project (Vite shown here)
npm create vite@latest student-cards -- --template react
cd student-cards

# 2. Copy the component in
cp /path/to/StudentCardSystem.jsx src/StudentCardSystem.jsx

# 3. Use it in src/App.jsx


jsx
import StudentCardSystem from "./StudentCardSystem";

export default function App() {
  return <StudentCardSystem />;
}


bash
npm install
npm run dev
Using the card on its own
StudentCard is exported separately, so you can use it anywhere.



jsx
import { StudentCard } from "./StudentCardSystem";

<StudentCard
  student={{
    id: "24-CS-0417",
    name: "Ananya Raghavan",
    program: "BSc Computer Science",
    dept: "Computing",
    sem: 5,
    until: "2028-06-30",
  }}
/>
The card fills the width of its parent and keeps a credit-card ratio (1.586:1). Set the width on the parent element.

Props
Prop	Type	Description
student	object	Student data (see below)
selected	boolean	Draws a highlight outline
onClick	function	Called when the card is clicked or flipped
Student object
Field	Type	Example
id	string	"24-CS-0417"
name	string	"Ananya Raghavan"
program	string	"BSc Computer Science"
dept	string, one of the keys in DEPTS	"Computing"
sem	number, 0 to 8	5
until	string, YYYY-MM-DD	"2028-06-30"
Customising
Departments and colours: edit the DEPTS object at the top of the file.
Sample data: edit INITIAL.
Card look: edit the CSS string at the bottom. Sizes use cqw units, so one change scales the whole card.
University name and return notice: the notice is in the back face of StudentCard.
Project structure


StudentCardSystem.jsx
├─ Avatar          generated pattern from the ID
├─ Field           label and value pair
├─ Strip           8 semester cells
├─ Barcode         bars drawn from the ID
├─ StudentCard     flippable front and back (exported)
├─ StudentForm     edit form
└─ StudentCardSystem   app shell (default export)
Known limits
Data is held in memory and resets on reload.
The photo is a generated pattern. Real photo upload is not included.
The barcode is decorative. It is not a scannable standard such as Code 128.
Expiry is checked against the device clock.
Browser support
Needs container query units (cqw): Chrome 105+, Safari 16+, Firefox 110+.