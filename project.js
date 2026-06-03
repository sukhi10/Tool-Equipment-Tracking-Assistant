let tools = JSON.parse(localStorage.getItem("tools")) || [];
let currentUser = localStorage.getItem("currentUser") || null;

const loginSection = document.getElementById("loginSection");
const dashboard = document.getElementById("dashboard");
const loginName = document.getElementById("loginName");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const toolName = document.getElementById("toolName");
const toolId = document.getElementById("toolId");
const toolSite = document.getElementById("toolSite");
const addToolBtn = document.getElementById("addToolBtn");

const assignToolSelect = document.getElementById("assignToolSelect");
const assignedTo = document.getElementById("assignedTo");
const assignedSite = document.getElementById("assignedSite");
const returnDate = document.getElementById("returnDate");
const assignToolBtn = document.getElementById("assignToolBtn");

const toolTableBody = document.getElementById("toolTableBody");

const totalTools = document.getElementById("totalTools");
const availableTools = document.getElementById("availableTools");
const inUseTools = document.getElementById("inUseTools");
const overdueTools = document.getElementById("overdueTools");

const reportDate = document.getElementById("reportDate");
const reportInUse = document.getElementById("reportInUse");
const reportOverdue = document.getElementById("reportOverdue");
const reportAvailable = document.getElementById("reportAvailable");

const importCsvBtn = document.getElementById("importCsvBtn");
const csvInput = document.getElementById("csvInput");
const exportCsvBtn = document.getElementById("exportCsvBtn");
const printReportBtn = document.getElementById("printReportBtn");

function saveTools() {
  localStorage.setItem("tools", JSON.stringify(tools));
}

function showDashboard() {
  if (currentUser) {
    loginSection.classList.add("hidden");
    dashboard.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
  } else {
    loginSection.classList.remove("hidden");
    dashboard.classList.add("hidden");
    logoutBtn.classList.add("hidden");
  }
}

function getTodayDateOnly() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function isToolOverdue(tool) {
  if (tool.status !== "In Use" || !tool.returnDate) {
    return false;
  }

  const today = getTodayDateOnly();
  const dueDate = new Date(tool.returnDate);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate < today;
}

function getDisplayStatus(tool) {
  if (isToolOverdue(tool)) {
    return "Overdue";
  }

  return tool.status;
}

function getStatusClass(tool) {
  const status = getDisplayStatus(tool);

  if (status === "Available") {
    return "available";
  }

  if (status === "In Use") {
    return "in-use";
  }

  if (status === "Overdue") {
    return "overdue";
  }

  return "";
}

function formatDate(dateString) {
  if (!dateString) {
    return "—";
  }

  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function clearAddToolForm() {
  toolName.value = "";
  toolId.value = "";
  toolSite.value = "";
}

function clearAssignForm() {
  assignedTo.value = "";
  assignedSite.value = "";
  returnDate.value = "";
}

function addTool() {
  const name = toolName.value.trim();
  const id = toolId.value.trim();
  const site = toolSite.value.trim();

  if (!name || !id) {
    alert("Please enter both tool name and tool ID.");
    return;
  }

  const existingTool = tools.find(tool => tool.id.toLowerCase() === id.toLowerCase());

  if (existingTool) {
    alert("A tool with this ID already exists.");
    return;
  }

  const newTool = {
    id: id,
    name: name,
    status: "Available",
    assignedTo: "",
    site: site || "",
    returnDate: ""
  };

  tools.push(newTool);
  saveTools();
  clearAddToolForm();
  renderApp();
}

function assignTool() {
  const selectedToolId = assignToolSelect.value;
  const person = assignedTo.value.trim();
  const site = assignedSite.value.trim();
  const dueDate = returnDate.value;

  if (!selectedToolId) {
    alert("Please select a tool.");
    return;
  }

  if (!person || !site || !dueDate) {
    alert("Please enter assigned person, site, and return date.");
    return;
  }

  const tool = tools.find(item => item.id === selectedToolId);

  if (!tool) {
    alert("Tool not found.");
    return;
  }

  tool.status = "In Use";
  tool.assignedTo = person;
  tool.site = site;
  tool.returnDate = dueDate;

  saveTools();
  clearAssignForm();
  renderApp();
}

function markAsReturned(toolId) {
  const tool = tools.find(item => item.id === toolId);

  if (!tool) {
    alert("Tool not found.");
    return;
  }

  tool.status = "Available";
  tool.assignedTo = "";
  tool.returnDate = "";

  saveTools();
  renderApp();
}

function deleteTool(toolId) {
  const confirmDelete = confirm("Are you sure you want to delete this tool?");

  if (!confirmDelete) {
    return;
  }

  tools = tools.filter(tool => tool.id !== toolId);
  saveTools();
  renderApp();
}

function renderStats() {
  const total = tools.length;
  const available = tools.filter(tool => tool.status === "Available").length;
  const inUse = tools.filter(tool => tool.status === "In Use" && !isToolOverdue(tool)).length;
  const overdue = tools.filter(tool => isToolOverdue(tool)).length;

  totalTools.textContent = total;
  availableTools.textContent = available;
  inUseTools.textContent = inUse;
  overdueTools.textContent = overdue;
}

function renderToolTable() {
  toolTableBody.innerHTML = "";

  if (tools.length === 0) {
    toolTableBody.innerHTML = `
      <tr>
        <td colspan="7">No tools added yet.</td>
      </tr>
    `;
    return;
  }

  tools.forEach(tool => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${tool.name}</td>
      <td>${tool.id}</td>
      <td>
        <span class="status ${getStatusClass(tool)}">
          ${getDisplayStatus(tool)}
        </span>
      </td>
      <td>${tool.assignedTo || "—"}</td>
      <td>${tool.site || "—"}</td>
      <td>${formatDate(tool.returnDate)}</td>
      <td>
        <div class="action-buttons">
          ${
            tool.status === "In Use"
              ? `<button class="success-btn" onclick="markAsReturned('${tool.id}')">Returned</button>`
              : ""
          }
          <button class="danger-btn" onclick="deleteTool('${tool.id}')">Delete</button>
        </div>
      </td>
    `;

    toolTableBody.appendChild(row);
  });
}

function renderAssignDropdown() {
  assignToolSelect.innerHTML = "";

  const availableToolsOnly = tools.filter(tool => tool.status === "Available");

  if (availableToolsOnly.length === 0) {
    assignToolSelect.innerHTML = `<option value="">No available tools</option>`;
    return;
  }

  assignToolSelect.innerHTML = `<option value="">Select a tool</option>`;

  availableToolsOnly.forEach(tool => {
    const option = document.createElement("option");
    option.value = tool.id;
    option.textContent = `${tool.name} (${tool.id})`;
    assignToolSelect.appendChild(option);
  });
}

function renderReport() {
  const today = new Date();

  reportDate.textContent = `Report generated on ${today.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })}`;

  reportInUse.innerHTML = "";
  reportOverdue.innerHTML = "";
  reportAvailable.innerHTML = "";

  const inUseList = tools.filter(tool => tool.status === "In Use" && !isToolOverdue(tool));
  const overdueList = tools.filter(tool => isToolOverdue(tool));
  const availableList = tools.filter(tool => tool.status === "Available");

  if (inUseList.length === 0) {
    reportInUse.innerHTML = `<li>No tools currently in use.</li>`;
  } else {
    inUseList.forEach(tool => {
      const li = document.createElement("li");
      li.textContent = `${tool.name} → ${tool.site} → ${tool.assignedTo} → Due: ${formatDate(tool.returnDate)}`;
      reportInUse.appendChild(li);
    });
  }

  if (overdueList.length === 0) {
    reportOverdue.innerHTML = `<li>No overdue tools.</li>`;
  } else {
    overdueList.forEach(tool => {
      const li = document.createElement("li");
      li.textContent = `${tool.name} → ${tool.site} → ${tool.assignedTo} → Due: ${formatDate(tool.returnDate)}`;
      reportOverdue.appendChild(li);
    });
  }

  if (availableList.length === 0) {
    reportAvailable.innerHTML = `<li>No available tools.</li>`;
  } else {
    availableList.forEach(tool => {
      const li = document.createElement("li");
      li.textContent = tool.name;
      reportAvailable.appendChild(li);
    });
  }
}

function renderApp() {
  renderStats();
  renderToolTable();
  renderAssignDropdown();
  renderReport();
}

function login() {
  const name = loginName.value.trim();

  if (!name) {
    alert("Please enter your name.");
    return;
  }

  currentUser = name;
  localStorage.setItem("currentUser", currentUser);

  showDashboard();
  renderApp();
}

function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");

  showDashboard();
}

function exportToCsv() {
  if (tools.length === 0) {
    alert("No tools to export.");
    return;
  }

  const headers = ["Tool Name", "Tool ID", "Status", "Assigned To", "Site", "Return Date"];

  const rows = tools.map(tool => [
    tool.name,
    tool.id,
    getDisplayStatus(tool),
    tool.assignedTo || "",
    tool.site || "",
    tool.returnDate || ""
  ]);

  let csvContent = headers.join(",") + "\n";

  rows.forEach(row => {
    const cleanedRow = row.map(value => `"${String(value).replace(/"/g, '""')}"`);
    csvContent += cleanedRow.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "tool_inventory.csv";
  link.click();

  URL.revokeObjectURL(url);
}

function importCsv(event) {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e) {
    const text = e.target.result;
    const lines = text.split("\n").filter(line => line.trim() !== "");

    if (lines.length < 2) {
      alert("CSV file is empty or invalid.");
      return;
    }

    const importedTools = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);

      const name = values[0]?.trim();
      const id = values[1]?.trim();
      const status = values[2]?.trim() || "Available";
      const assignedToValue = values[3]?.trim() || "";
      const site = values[4]?.trim() || "";
      const returnDateValue = values[5]?.trim() || "";

      if (name && id) {
        const duplicateInExisting = tools.some(tool => tool.id.toLowerCase() === id.toLowerCase());
        const duplicateInImport = importedTools.some(tool => tool.id.toLowerCase() === id.toLowerCase());

        if (!duplicateInExisting && !duplicateInImport) {
          importedTools.push({
            name: name,
            id: id,
            status: status === "In Use" ? "In Use" : "Available",
            assignedTo: assignedToValue,
            site: site,
            returnDate: returnDateValue
          });
        }
      }
    }

    tools = [...tools, ...importedTools];
    saveTools();
    renderApp();

    alert(`${importedTools.length} tools imported successfully.`);
    csvInput.value = "";
  };

  reader.readAsText(file);
}

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function printReport() {
  renderReport();
  window.print();
}

function loadExampleData() {
  if (tools.length > 0) {
    return;
  }

  tools = [
    {
      name: "Hilti TE 30",
      id: "T001",
      status: "In Use",
      assignedTo: "Ali",
      site: "Site A",
      returnDate: "2026-10-04"
    },
    {
      name: "Grinder",
      id: "T002",
      status: "Available",
      assignedTo: "",
      site: "",
      returnDate: ""
    },
    {
      name: "Concrete Mixer",
      id: "T003",
      status: "In Use",
      assignedTo: "Store Team",
      site: "Site B",
      returnDate: "2026-10-10"
    }
  ];

  saveTools();
}

loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);
addToolBtn.addEventListener("click", addTool);
assignToolBtn.addEventListener("click", assignTool);

importCsvBtn.addEventListener("click", function() {
  csvInput.click();
});

csvInput.addEventListener("change", importCsv);
exportCsvBtn.addEventListener("click", exportToCsv);
printReportBtn.addEventListener("click", printReport);

loginName.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    login();
  }
});

loadExampleData();
showDashboard();
renderApp();