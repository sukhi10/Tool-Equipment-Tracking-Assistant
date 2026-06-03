 Tool & Equipment Tracking Assistant

A simple web-based tool tracking system for small contractors. This app helps users track tools across job sites, assign equipment to workers, monitor return dates, identify overdue tools, and generate basic reports.

 Problem

Small contractors often lose track of tools across multiple job sites. They may forget who has which tool, where equipment is located, or when it needs to be returned. Many small businesses cannot afford expensive ERP or asset management systems, so they rely on WhatsApp messages, Excel sheets, or memory.

This project solves that problem by creating a simple dashboard that keeps tool information organized in one place.

 Features

* User login using a simple name entry
* Add tools manually
* Assign tools to workers or teams
* Assign tools to specific job sites
* Set return dates
* Automatically mark tools as overdue when the return date passes
* Mark tools as returned
* Delete tools from inventory
* View real-time tool status
* Import tool data using CSV
* Export inventory as CSV
* Generate a weekly tool usage report
* Print the report as a PDF using the browser print option
* Data is saved using localStorage

 User Flow

1. User logs into the dashboard.
2. User adds tools such as drills, grinders, mixers, or generators.
3. User assigns a tool to a worker, team, or job site.
4. The system updates the tool status to “In Use.”
5. If the return date passes, the system shows the tool as “Overdue.”
6. When the tool is returned, the user marks it as returned.
7. The system updates the tool status to “Available.”
8. The user can export data or print a weekly report.

 Tech Stack

* HTML
* CSS
* JavaScript
* Browser localStorage
* CSV import and export
* Browser print for PDF reports

 Project Structure


tool-tracker
├── index.html
├── project.css
└── script.js


 How to Run the Project

1. Download or clone the project folder.
2. Make sure the files are named exactly:

   * `index.html`
   * `project.css`
   * `script.js`
3. Open `index.html` in your browser.
4. Enter your name to log in.
5. Start adding and assigning tools.

No installation is required because this project runs directly in the browser.

 CSV Import Format

To import tools, use a CSV file with this format:


Tool Name,Tool ID,Status,Assigned To,Site,Return Date
Hilti TE 30,T001,In Use,Ali,Site A,2026-10-04
Grinder,T002,Available,,,
Concrete Mixer,T003,In Use,Store Team,Site B,2026-10-10


 Example Tool Data

| Tool Name      | Tool ID | Status    | Assigned To | Site   | Return Date |
| -------------- | ------- | --------- | ----------- | ------ | ----------- |
| Hilti TE 30    | T001    | In Use    | Ali         | Site A | 2026-10-04  |
| Grinder        | T002    | Available |             |        |             |
| Concrete Mixer | T003    | In Use    | Store Team  | Site B | 2026-10-10  |

 Example Report Output


 Future Improvements

* Add real user authentication
* Add admin and employee roles
* Add email or WhatsApp reminders
* Add QR code scanning for tools
* Add cloud database support using Firebase or Supabase
* Add mobile app version
* Add AI-generated weekly summaries
* Add search and filter options
* Add tool condition tracking
* Add repair and maintenance history

 Purpose

The purpose of this project is to provide small contractors with an affordable and easy-to-use tool management system. It reduces confusion, prevents delays, and helps teams know exactly where each tool is located.
