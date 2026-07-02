# Mahek Vaghera — Interactive API Portfolio

Welcome to a developer portfolio designed as an interactive, fully functional API playground. Inspired by Postman, this platform allows visitors to query professional details, achievements, and projects through structured API requests.

---

## How the Portfolio Works

Unlike traditional static developer websites, this portfolio operates as an API client interface. It exposes a set of endpoints that visitors "send requests" to in order to fetch information. 

### The Core Loop
1. **Browse Endpoints:** Use the sidebar on the left to select different categories (About Me, Education, Experience, Skills, Achievements, Hobbies & Spoken Languages, and Contact/Feedback).
2. **Configure Parameters:** Modify path parameters, query parameters, or the JSON request body within the Request Panel.
3. **Send Request:** Click the **Send** button. 
4. **Inspect Response:** View the returned payload in the Response Panel, complete with standard HTTP status codes, headers, response sizes, execution times, and JSON-formatted data.

---

## Detailed Features & Workspace Panels

### 1. Sidebar Workspaces
* **Resume View:** The default view listing available API endpoints categorized by resume sections. Selecting any endpoint loads it into the request builder.
* **Projects View:** A dedicated panel to explore projects. Selecting a project opens a detailed dashboard showcasing features, key metrics, and links.
* **Journey (Flows) View:** A step-by-step interactive walk-through highlighting key career and development milestones.
* **History View:** A running log of all requests sent during the active session. Visitors can review past actions, save favorite queries, or clear the history.

### 2. Request & Response Sandbox
* **Environment Switcher:** Toggle the base URL between **Production** and **Local Dev** environments to see how endpoint paths resolve.
* **Method Pills:** Color-coded badges indicating the HTTP verb (`GET`, `POST`, `DELETE`) associated with each action.
* **Dynamic Parameters:** Auto-generated form fields let you edit query filters (such as admin credentials) or path IDs to request specific items.
* **Live JSON Body Editor:** Modify request payloads directly in a syntax-highlighted editor before submitting data.

### 3. Contact & Feedback Services
* **Send a Message (`POST /api/contact`):** An interactive endpoint that validates details and sends a direct email notification to the owner.
* **Submit Feedback (`POST /api/feedback`):** Allows visitors to leave public reviews or ratings.
* **List Feedback (`GET /api/feedback`):** Fetches feedback submitted by other users with their email addresses securely masked for privacy.
* **Manage Feedback (`DELETE /api/feedback`):** Enables authenticated entry removal using query parameters.

### 4. Interactive Tour
* First-time visitors are welcomed by a guided step-by-step onboarding walkthrough explaining how to construct their first request, send it, and view the response.