Product Requirements: Student Card System
Status: Draft v1
Owner: To be assigned
Last updated: 18 November 2026

1. Summary
A web tool that lets university staff create, edit and review student ID cards from one shared set of card components. Version 1 is a front-end only app with in-memory data. It proves the card design and the editing flow before any backend work.

2. Problem
Student cards are often made in separate tools for printing, for the portal and for security desks. The designs drift apart, data is retyped, and expired or incorrect cards are hard to spot.

3. Goals
Produce one consistent card design from a single student record.
Let staff edit a record and see the card change immediately.
Make card status (active or expired) obvious at a glance.
Build the card from reusable parts so new card types can be added cheaply.
4. Non-goals (version 1)
User login and roles
Database or API storage
Photo capture or upload
Printing, PDF export or NFC and magnetic encoding
Scannable barcodes or QR codes
Bulk import
5. Users
User	Need
Registrar staff	Create and correct cards quickly
Security and library desk	Read a card quickly and see if it is valid
Student (indirect)	A card that is accurate and easy to recognise
6. User stories
As a staff member, I can add a student so that a new card exists.
As a staff member, I can edit name, ID, department, programme, semesters completed and expiry date, and see the card update as I type.
As a staff member, I can delete a student record.
As a staff member, I can search the roster by name or ID.
As a desk worker, I can flip a card to see its barcode and whether it is active or expired.
As a keyboard user, I can reach and flip every card without a mouse.
7. Functional requirements
ID	Requirement	Priority
F1	Show a preview card for the selected student	Must
F2	Edit form with fields: name, student ID, department, programme, semesters completed (0 to 8), valid until	Must
F3	Changes in the form update the preview and roster cards immediately	Must
F4	Roster grid shows a card for every student	Must
F5	Clicking a roster card selects it and flips it	Must
F6	Search filters the roster by name or ID, case-insensitive	Must
F7	Add student creates a record with default values and selects it	Must
F8	Delete student removes the selected record and moves selection to a neighbour	Must
F9	Card front shows pattern avatar, name, programme, ID, valid-until month, semester strip, department band	Must
F10	Card back shows department, Active or Expired badge, barcode and return notice	Must
F11	Expired cards (valid-until date in the past) show an Expired badge and a struck-through name	Must
F12	Avatar pattern is generated from the student ID and is stable for the same ID	Should
F13	Empty states for no students and for no search matches	Must
F14	StudentCard is exported so it can be used outside the app	Should
8. Non-functional requirements
Accessibility: Cards are focusable buttons with labels. Visible focus outline. Respect reduced-motion. Text contrast meets WCAG AA on the card face.
Responsive: Usable from 360 px wide. Preview and form stack on narrow screens.
Performance: Editing a field re-renders a roster of 200 cards without visible lag.
Compatibility: Chrome 105+, Safari 16+, Firefox 110+ (container query units).
Theming: Follows the system light or dark preference. The card face stays light so printing and recognition are consistent.
9. Data model


Student {
  id:      string   // e.g. "24-CS-0417"
  name:    string
  program: string
  dept:    "Computing" | "Design" | "Biosciences" | "Law"
  sem:     number   // 0 to 8
  until:   string   // YYYY-MM-DD
}
10. Success metrics
A staff member can add and complete a card in under 60 seconds.
Zero cards render with overflowing or clipped text for names up to 40 characters.
All functional "Must" requirements pass manual testing on the three target browsers.
11. Open questions
How many departments exist, and who owns their colours?
Does the card need a real photo, and where do photos come from?
Should the barcode follow a standard (Code 128 or QR) so desks can scan it?
What is the ID format, and should the app validate it?
Should "semesters completed" be calculated from enrolment dates instead of typed in?
Where will data live (existing student information system or a new store)?
12. Roadmap
Phase	Scope
1 (this version)	Front-end only: editor, roster, flip card
2	Persistent storage, login, photo upload
3	Print sheet and PDF export, scannable codes
4	Bulk import, extra card types (staff, visitor, alumni)
