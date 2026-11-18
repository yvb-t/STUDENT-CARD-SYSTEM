Design: Student Card System
This document covers the visual design and the component design. It matches StudentCardSystem.jsx.

1. Design idea
The card should feel like a real laminated ID, not a web widget. Three details carry that:

Lanyard slot cut into the top edge, at the centre
Department band down the left edge in the department colour, with the department name running vertically
Semester strip on the front, eight cells that fill as the student progresses
Everything else stays quiet so those three details are what people remember.

2. Card anatomy
Ratio is 1.586:1 (standard CR80 card, 85.6 × 54 mm).

Front


┌──────────────────────────────────────┐
│ ▌            ( slot )                │
│ ▌  ┌──────┐  Name in bold           │
│ D  │avatar│  Programme              │
│ E  └──────┘                          │
│ P▌  Student ID          Valid until  │
│ T▌  24-CS-0417          Jun 2028     │
│ ▌  Semesters 5 of 8                  │
│ ▌  ■■■■■□□□                          │
└──────────────────────────────────────┘
Back


┌──────────────────────────────────────┐
│              ( slot )                │
│ ████████████ dark strip ████████████ │
│  Department                 [Active] │
│  ||| || ||||| | |||| barcode         │
│            24-CS-0417                │
│  Return notice text                  │
└──────────────────────────────────────┘
3. Colour
Token	Value	Use
Computing	
#2F5BFF	Department colour
Design	
#D6336C	Department colour
Biosciences	
#14935F	Department colour
Law	
#A8741A	Department colour
Card face	
#FAFAF7	Card background
Card ink	
#121826	Card text
Card muted	
#4a5366, 
#6b7487	Programme, labels
Expired	
#c0392b	Expired badge
Magnetic strip	
#1b2030	Back strip
App tokens (light / dark):

Token	Light	Dark
--bg	
#E6EAEE	
#10141A
--panel	
#FFFFFF	
#1A212B
--ink	
#121826	
#E8ECF1
--mute	
#5b6577	
#98a3b5
--line	
#d3d9e0	
#2c3644
--accent	
#2F5BFF	
#2F5BFF
The card face stays light in both themes so it looks the same on screen and on paper. The slot uses the page background colour so it reads as a hole through the card.

4. Typography
Family: system sans-serif stack. For a more distinctive look, swap in a single family such as Bricolage Grotesque.
Name: 6.4cqw, weight 800, tight line height, slight negative tracking.
Programme: 3.6cqw, regular.
Field values: 4cqw, weight 600, tabular numbers so IDs align.
Field labels: 2.8cqw, weight 600, muted.
Department band text: 4.2cqw, weight 800, rotated to read bottom to top.
cqw is one percent of the card width. All card sizes use it, so the card scales as one piece.

5. Layout
Page

Max width 1080 px, centred
Top: preview panel and form panel side by side, stacked below 760 px
Below: toolbar with title and search, then the roster grid
Roster grid: auto-fill columns, minimum 250 px, 16 px gap.

Card spacing (in cqw):

Band width 11
Body padding: top 9, sides 5, bottom 4.5
Avatar 25 × 25 with 3 corner radius
Card corner radius 4
6. Components
Component	Props	Responsibility
Avatar	student	Draws a 5 × 5 symmetric pattern from a hash of the ID, in the department colour
Field	label, value	Small label above a value
Strip	sem	Eight cells, the first sem filled
Barcode	id	Bars whose widths come from the ID characters
StudentCard	student, selected, onClick	Front and back faces, flip state, expired styling
StudentForm	student, onChange, onAdd, onRemove	Controlled inputs for every field
StudentCardSystem	none	Holds the list, selection and search text
State
All state lives in StudentCardSystem:



students : Student[]
sel      : number   // index of selected student
q        : string   // search text
Each StudentCard holds only its own flipped flag.

Data flow


Form input ──onChange──▶ students[sel] updated
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
      Preview StudentCard             Roster StudentCards
7. Interaction
Flip: click, or Enter / Space when focused. A 0.6 s rotation around the vertical axis. With reduced motion on, the card flips instantly.
Select: clicking a roster card selects it and flips it. The selected card gets a 3 px accent outline.
Edit: typing updates all cards immediately, with no save step.
Add: appends a student with default values and selects it.
Delete: removes the selected student. Selection moves to the nearest remaining card.
Search: filters on name or ID as you type.
8. States
State	Behaviour
Active	Back shows an Active badge in the department colour
Expired	Back shows a red Expired badge. Front name is struck through
Empty roster	Dashed box: "No students yet. Use Add student."
No search match	Dashed box: "No student matches that search."
No selection	Preview shows "No student selected." Form shows a hint
9. Copy
Buttons say what they do: "Add student", "Delete student".
Labels use sentence case.
Empty states say what to do next.
10. Accessibility
Each card is a focusable button with the label "Student card for {name}. Press to flip."
The avatar SVG has a text label.
The barcode is hidden from screen readers. The ID is printed below it as text.
All inputs have visible labels.
Focus outline is 3 px in the accent colour.
Flip animation is turned off for reduced motion.
11. Extending the system
New department: add a name and colour to DEPTS.
New card type (staff, visitor): create a new component that reuses Avatar, Field and Barcode, and change the band label and fields.
Real photo: replace Avatar with an image that falls back to the pattern.
Standard barcode: replace Barcode with a Code 128 or QR component. Its props stay the same.
12. Design risks
Long names or programme titles can wrap. Names beyond about 28 characters may need a smaller size or a two-line limit.
cqw units need modern browsers. Older browsers need a fixed-size fallback.
The generated avatar is a placeholder and can be mistaken for a real photo ID in security use.