// Custom here yes
const cursor = document.getElementById("cursor");
document.addEventListener("mousemove", (e) => {
	const x = e.clientX;
	const y = e.clientY;
	cursor.style.left = `${x}px`;
	cursor.style.top = `${y}px`;
});

// Matrix  Rain Effect
const matrixBg = document.getElementById("matrix-bg");
const columns = Math.floor(window.innerWidth / 20);
for (let i = 0; i < columns; i++) {
	const column = document.createElement("div");
	column.classList.add("matrix-column");
	column.style.left = `${i * 20}px`;
	column.style.animationDelay = `${Math.random() * 5}s`;
	matrixBg.appendChild(column);
}

// Start Menu Toggle
const startButton = document.getElementById("start-button");
const startMenu = document.getElementById("start-menu");

startButton.addEventListener("click", () => {
	startMenu.style.display = startMenu.style.display === "block" ? "none" : "block";
});

// Close Start Menu when clicking elsewhere
document.addEventListener("click", (e) => {
	if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
		startMenu.style.display = "none";
	}
});

// Window Management
const windows = document.querySelectorAll(".window");
let activeWindow = null;
let zIndex = 100;

// Function to make a window active
function makeWindowActive(window) {
	if (activeWindow) {
		activeWindow.style.zIndex = "100";
	}
	window.style.zIndex = (++zIndex).toString();
	activeWindow = window;
}

// Initialize window positions
windows.forEach((window, index) => {
	window.style.top = `${100 + index * 30}px`;
	window.style.left = `${100 + index * 30}px`;
	window.style.width = "400px";
	window.style.height = "300px";
	
	// Make window active when clicked
	window.addEventListener("mousedown", () => {
		makeWindowActive(window);
	});
	
	// Window controls
	const closeBtn = window.querySelector(".window-close");
	const minimizeBtn = window.querySelector(".window-minimize");
	const maximizeBtn = window.querySelector(".window-maximize");
	
	closeBtn.addEventListener("click", () => {
		window.style.display = "none";
	});
	
	minimizeBtn.addEventListener("click", () => {
		window.style.display = "none";
	});
	
	maximizeBtn.addEventListener("click", () => {
		if (window.style.width === "100%") {
			window.style.width = "400px";
			window.style.height = "300px";
			window.style.top = `${100 + index * 30}px`;
			window.style.left = `${100 + index * 30}px`;
		} else {
			window.style.width = "100%";
			window.style.height = "calc(100% - 40px)";
			window.style.top = "0";
			window.style.left = "0";
		}
	});
	
	// Draggable windows
	const header = window.querySelector(".window-header");
	let isDragging = false;
	let offsetX, offsetY;
	
	header.addEventListener("mousedown", (e) => {
		if (e.target === header || header.contains(e.target)) {
			if (!e.target.classList.contains("window-close") && 
				!e.target.classList.contains("window-minimize") && 
				!e.target.classList.contains("window-maximize")) {
				isDragging = true;
				offsetX = e.clientX - window.getBoundingClientRect().left;
				offsetY = e.clientY - window.getBoundingClientRect().top;
				makeWindowActive(window);
			}
		}
	});
	
	document.addEventListener("mousemove", (e) => {
		if (isDragging) {
			window.style.left = `${e.clientX - offsetX}px`;
			window.style.top = `${e.clientY - offsetY}px`;
		}
	});
	
	document.addEventListener("mouseup", () => {
		isDragging = false;
	});
});

// Desktop Icons and Start Menu Items
const desktopIcons = document.querySelectorAll(".desktop-icon");
const startMenuItems = document.querySelectorAll(".start-menu-item");

// Function to open a window
function openWindow(windowId) {
	const window = document.getElementById(windowId);
	if (window) {
		// If it's the terminal, ensure it's initialized
		if (windowId === "terminal-window") {
			initTerminal(window);
		}
		window.style.display = "block";
		window.classList.add("active");
		makeWindowActive(window);
		startMenu.style.display = "none";
	}
}

// Add click event listeners to desktop icons
desktopIcons.forEach(icon => {
	icon.addEventListener("click", () => {
		const id = icon.id.replace("-icon", "").replace("-desktop", "");
		openWindow(`${id}-window`);
	});
});

// Add click event listeners to start menu items
startMenuItems.forEach(item => {
	item.addEventListener("click", () => {
		const id = item.id.replace("-menu-item", "");
		openWindow(`${id}-window`);
	});
});

// Add click event listeners to taskbar icons
const taskbarIcons = document.querySelectorAll(".taskbar-icon");
taskbarIcons.forEach(icon => {
	icon.addEventListener("click", () => {
		const id = icon.id.replace("-icon", "");
		openWindow(`${id}-window`);
	});
});

// Neural Network Canvas
function initNeuralNetworkCanvas() {
	const canvas = document.getElementById("neural-network-canvas");
	if (!canvas) return;
	
	const ctx = canvas.getContext("2d");
	canvas.width = canvas.parentElement.clientWidth;
	canvas.height = canvas.parentElement.clientHeight;
	
	const nodes = [];
	const connections = [];
	
	// Create random nodes
	for (let i = 0; i < 30; i++) {
		nodes.push({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			radius: 3,
			speedX: (Math.random() - 0.5) * 0.5,
			speedY: (Math.random() - 0.5) * 0.5
		});
	}
	
	// Create random connections between nodes
	for (let i = 0; i < nodes.length; i++) {
		for (let j = i + 1; j < nodes.length; j++) {
			if (Math.random() > 0.85) {
				connections.push([i, j]);
			}
		}
	}
	
	function animate() {
		requestAnimationFrame(animate);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		// Update node positions
		nodes.forEach(node => {
			node.x += node.speedX;
			node.y += node.speedY;
			
			// Bounce off edges
			if (node.x < 0 || node.x > canvas.width) node.speedX *= -1;
			if (node.y < 0 || node.y > canvas.height) node.speedY *= -1;
			
			// Draw node
			ctx.beginPath();
			ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
			ctx.fillStyle = "#00ff00";
			ctx.fill();
		});
		
		// Draw connections
		connections.forEach(conn => {
			const nodeA = nodes[conn[0]];
			const nodeB = nodes[conn[1]];
			const distance = Math.sqrt(
				Math.pow(nodeB.x - nodeA.x, 2) + Math.pow(nodeB.y - nodeA.y, 2)
			);
			
			// Only draw connections if nodes are close enough
			if (distance < 150) {
				ctx.beginPath();
				ctx.moveTo(nodeA.x, nodeA.y);
				ctx.lineTo(nodeB.x, nodeB.y);
				ctx.strokeStyle = `rgba(0, 255, 0, ${1 - distance / 150})`;
				ctx.lineWidth = 1;
				ctx.stroke();
			}
		});
	}
	
	animate();
}

// Initialize neural network canvas when window is opened
const neuralNetworkMenuItem = document.getElementById("neural-network-menu-item");
if (neuralNetworkMenuItem) {
	neuralNetworkMenuItem.addEventListener("click", () => {
		setTimeout(initNeuralNetworkCanvas, 100);
	});
}

const neuralNetworkIcon = document.getElementById("neural-network-icon");
if (neuralNetworkIcon) {
	neuralNetworkIcon.addEventListener("click", () => {
		setTimeout(initNeuralNetworkCanvas, 100);
	});
}

// Bitcoin Miner Functionality
function initBitcoinMiner() {
	const hashRateEl = document.getElementById("hash-rate");
	const blocksMinedEl = document.getElementById("blocks-mined");
	const btcEarnedEl = document.getElementById("btc-earned");
	const miningProgressEl = document.getElementById("mining-progress");
	
	if (!hashRateEl || !blocksMinedEl || !btcEarnedEl || !miningProgressEl) return;
	
	let hashRate = 0;
	let blocksMined = 0;
	let btcEarned = 0;
	let progress = 0;
	
	function updateMiningStats() {
		// Simulate mining activity
		hashRate = Math.floor(Math.random() * 100) + 50;
		progress += Math.random() * 5;
		
		if (progress >= 100) {
			blocksMined++;
			btcEarned += 6.25 / (2 ** Math.floor(blocksMined / 210000));
			progress = 0;
		}
		
		hashRateEl.textContent = hashRate;
		blocksMinedEl.textContent = blocksMined;
		btcEarnedEl.textContent = btcEarned.toFixed(8);
		miningProgressEl.style.width = `${progress}%`;
		
		setTimeout(updateMiningStats, 1000);
	}
	
	updateMiningStats();
}

// Password Cracker Functionality
function initPasswordCracker() {
	const passwordAttemptsEl = document.getElementById("password-attempts");
	if (!passwordAttemptsEl) return;
	
	const commonPasswords = [
		"123456", "password", "123456789", "12345678", "12345", 
		"qwerty", "1234567", "111111", "1234567890", "123123",
		"admin", "letmein", "welcome", "monkey", "login", "abc123",
		"starwars", "123qwe", "dragon", "passw0rd", "master", "hello",
		"freedom", "whatever", "qazwsx", "trustno1", "654321"
	];
	
	let attemptIndex = 3; // Start after the initial 3 attempts shown in HTML
	
	function tryPassword() {
		if (attemptIndex >= commonPasswords.length) {
			// Cycle back to beginning when we reach the end
			attemptIndex = 0;
		}
		
		const password = commonPasswords[attemptIndex];
		const newAttempt = document.createElement("p");
		newAttempt.textContent = `Trying: ${password}... Failed`;
		passwordAttemptsEl.appendChild(newAttempt);
		passwordAttemptsEl.scrollTop = passwordAttemptsEl.scrollHeight;
		
		attemptIndex++;
		setTimeout(tryPassword, Math.random() * 1000 + 500);
	}
	
	tryPassword();
}

// Remote Connection Functionality
function initRemoteConnection() {
	const connectionLogEl = document.getElementById("connection-log");
	const statusEl = document.querySelector(".status-connecting");
	if (!connectionLogEl || !statusEl) return;
	
	const connectionSteps = [
		"Identifying target system...",
		"Port 22 is open. SSH service detected.",
		"Attempting to bypass firewall...",
		"Firewall bypassed successfully.",
		"Trying common credentials...",
		"Access denied. Switching to brute force approach.",
		"Testing SSH vulnerabilities...",
		"Vulnerability CVE-2021-3156 found!",
		"Exploiting vulnerability...",
		"Gaining elevated privileges...",
		"Creating backdoor access...",
		"Connection established!"
	];
	
	let stepIndex = 3; // Start after the initial 3 steps shown in HTML
	
	function progressConnection() {
		if (stepIndex < connectionSteps.length) {
			const newStep = document.createElement("p");
			newStep.textContent = connectionSteps[stepIndex];
			connectionLogEl.appendChild(newStep);
			connectionLogEl.scrollTop = connectionLogEl.scrollHeight;
			
			stepIndex++;
			
			if (stepIndex === connectionSteps.length) {
				statusEl.textContent = "Connected";
				statusEl.className = "";
				statusEl.style.color = "#00ff00";
			}
			
			setTimeout(progressConnection, Math.random() * 2000 + 1000);
		}
	}
	
	progressConnection();
}

// Nuclear Plant Functionality
function initNuclearPlant() {
	const coreTempEl = document.getElementById("core-temp");
	const coolingRestartBtn = document.getElementById("cooling-restart");
	const reactorShutdownBtn = document.getElementById("reactor-shutdown");
	const reactorStatusEl = document.querySelector(".status-warning");
	const coolingStatusEl = document.querySelector(".status-offline");
	
	if (!coreTempEl || !coolingRestartBtn || !reactorShutdownBtn || !reactorStatusEl || !coolingStatusEl) return;
	
	let coreTemp = 2700;
	let coolingOnline = false;
	let shutdownInitiated = false;
	
	function updateReactor() {
		if (shutdownInitiated) {
			coreTemp = Math.max(1000, coreTemp - 100);
			if (coreTemp <= 1000) {
				reactorStatusEl.textContent = "OFFLINE";
				reactorStatusEl.className = "status-offline";
				return;
			}
		} else if (coolingOnline) {
			coreTemp = Math.max(1500, coreTemp - 50);
			if (coreTemp <= 2000) {
				reactorStatusEl.textContent = "STABLE";
				reactorStatusEl.className = "";
				reactorStatusEl.style.color = "#00ff00";
			}
		} else {
			coreTemp = Math.min(3000, coreTemp + 20);
			if (coreTemp >= 2800) {
				reactorStatusEl.textContent = "CRITICAL";
				reactorStatusEl.className = "status-offline";
			}
		}
		
		coreTempEl.textContent = coreTemp;
		setTimeout(updateReactor, 1000);
	}
	
	coolingRestartBtn.addEventListener("click", () => {
		coolingStatusEl.textContent = "RESTARTING...";
		coolingStatusEl.className = "status-connecting";
		
		setTimeout(() => {
			coolingOnline = true;
			coolingStatusEl.textContent = "ONLINE";
			coolingStatusEl.className = "";
			coolingStatusEl.style.color = "#00ff00";
		}, 3000);
	});
	
	reactorShutdownBtn.addEventListener("click", () => {
		shutdownInitiated = true;
		reactorStatusEl.textContent = "SHUTTING DOWN";
		reactorStatusEl.className = "status-connecting";
	});
	
	updateReactor();
}

// Compiler Functionality
function initCompiler() {
	const compileBtn = document.getElementById("compile-btn");
	const runBtn = document.getElementById("run-btn");
	const outputEl = document.getElementById("compiler-output");
	const codeEditor = document.querySelector(".code-editor");
	
	if (!compileBtn || !runBtn || !outputEl || !codeEditor) return;
	
	compileBtn.addEventListener("click", () => {
		outputEl.innerHTML = "<p>Compiling...</p>";
		
		setTimeout(() => {
			outputEl.innerHTML = "<p>Compilation successful. Ready to run.</p>";
		}, 1500);
	});
	
	runBtn.addEventListener("click", () => {
		outputEl.innerHTML = "<p>Running program...</p>";
		
		setTimeout(() => {
			outputEl.innerHTML = "<p>Output:</p><p>Hello, Cyber World!</p>";
		}, 1000);
	});
}

// Terminal Functionality
function initTerminal(terminalWindow) {
	// Accept the window element as an argument
	const terminalContent = document.getElementById("main-terminal-content");
	if (!terminalContent) return;

	const fileSystem = {
		"~": {
			type: "dir",
			children: {
				"about.txt": {
					type: "file",
					content: "Hello! I’m Krishna Baviskar, a passionate and versatile engineering student with a strong foundation in Mechanical Engineering and a keen interest in Computer Engineering.",
				},
				"skills.txt": {
					type: "file",
					content: "Top Skills:\n- Reinforcement Learning\n- React.js\n- JavaScript\n- Cybersecurity\n- Database Management",
				},
				projects: {
					type: "dir",
					children: {
						"secure-login.info": {
							type: "file",
							content: "A robust authentication system with multi-factor support.",
						},
						"ai-chatbot.info": {
							type: "file",
							content: "A sleek, responsive frontend for an AI-powered chatbot.",
						},
					},
				},
			},
		},
	};

	let currentDir = fileSystem["~"];
	let currentPath = "~";
	let commandHistory = [];
	let historyIndex = -1;
	let currentInput = "";

	function resetTerminal() {
		terminalContent.innerHTML =
			"<p>Welcome to CyberOS v3.1.4</p><p>Type 'help' to see available commands.</p><br>";
		currentInput = "";
		commandHistory = [];
		historyIndex = -1;
		currentDir = fileSystem["~"];
		currentPath = "~";
		createCommandLine();
	}

	function createCommandLine() {
		const line = document.createElement("p");
		line.innerHTML = `<span>root@cyber:${currentPath}$ </span><span class="terminal-input">${currentInput}</span><span class='caret'>█</span>`;
		line.className = "command-line";
		terminalContent.appendChild(line);
		terminalContent.scrollTop = terminalContent.scrollHeight;
		return line;
	}

	function handleKeyDown(e) {
		if (!terminalWindow.classList.contains("active")) return;

		e.preventDefault();
		let currentLineEl = terminalContent.querySelector(".command-line:last-child");

		if (e.key === "Enter") {
			const command = currentInput.trim();
			currentLineEl.innerHTML = `<span>root@cyber:${currentPath}$ </span><span class="terminal-input">${command}</span>`;

			if (command) {
				if (commandHistory[commandHistory.length - 1] !== command) {
					commandHistory.push(command);
				}
				historyIndex = commandHistory.length;
			}

			processCommand(command);
			currentInput = "";
			createCommandLine();
		} else if (e.key === "ArrowUp") {
			if (historyIndex > 0) {
				historyIndex--;
				currentInput = commandHistory[historyIndex];
				currentLineEl.innerHTML = `<span>root@cyber:${currentPath}$ </span><span class="terminal-input">${currentInput}</span><span class='caret'>█</span>`;
			}
		} else if (e.key === "ArrowDown") {
			if (historyIndex < commandHistory.length - 1) {
				historyIndex++;
				currentInput = commandHistory[historyIndex];
			} else {
				currentInput = "";
			}
			currentLineEl.innerHTML = `<span>root@cyber:${currentPath}$ </span><span class="terminal-input">${currentInput}</span><span class='caret'>█</span>`;
		} else if (e.key === "Backspace") {
			currentInput = currentInput.slice(0, -1);
			currentLineEl.querySelector(".terminal-input").textContent = currentInput;
		} else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
			currentInput += e.key;
			currentLineEl.querySelector(".terminal-input").textContent = currentInput;
		}
	}

	function processCommand(command) {
		const output = document.createElement("div");
		output.className = "terminal-output";
		const [cmd, ...args] = command.toLowerCase().split(" ").filter(Boolean);

		switch (cmd) {
			case "help":
				output.innerHTML =
					"<p>Available commands:</p>" +
					"<ul>" +
					"<li><b>help</b>: Show this help message</li>" +
					"<li><b>ls</b>: List files and directories</li>" +
					"<li><b>cat [file]</b>: Display file content</li>" +
					"<li><b>whoami</b>: Display the current user</li>" +
					"<li><b>date</b>: Display the current date</li>" +
					"<li><b>clear</b>: Clear the terminal screen</li>" +
					"<li><b>exit</b>: Close the terminal</li>" +
					"</ul>";
				break;
			case "ls":
				let content = Object.keys(currentDir.children);
				if (content.length === 0) {
					output.innerHTML = "<p>Directory is empty.</p>";
				} else {
					output.innerHTML = content
						.map((item) => {
							const type = currentDir.children[item].type;
							return `<span class="ls-${type}">${item}${type === "dir" ? "/" : ""}</span>`;
						})
						.join(" ");
				}
				break;
			case "whoami":
				output.innerHTML = "<p>root</p>";
				break;
			case "date":
				output.innerHTML = `<p>${new Date().toString()}</p>`;
				break;
			case "clear":
				terminalContent.innerHTML = "";
				return;
			case "exit":
				terminalWindow.classList.remove("active");
				terminalWindow.style.display = "none";
				return;
			case "cat":
				const fileName = args[0];
				if (!fileName) {
					output.innerHTML = "<p>Usage: cat [file]</p>";
				} else if (
					currentDir.children[fileName] &&
					currentDir.children[fileName].type === "file"
				) {
					output.innerHTML = `<pre>${currentDir.children[fileName].content}</pre>`;
				} else {
					output.innerHTML = `<p>cat: ${fileName}: No such file or not a file</p>`;
				}
				break;
			default:
				output.innerHTML = `<p>Command not found: ${command}. Type 'help' for a list of commands.</p>`;
		}

		terminalContent.appendChild(output);
	}

	// Only run once
	if (!terminalWindow.dataset.initialized) {
		terminalWindow.dataset.initialized = "true";

		document.addEventListener("keydown", handleKeyDown);
		// Reset the terminal right after its first initialization
		resetTerminal();
	}
}

function initOtherWindows() {
	initNeuralNetworkCanvas();
	initBitcoinMiner();
	initPasswordCracker();
	initRemoteConnection();
	initNuclearPlant();
	initCompiler();
}

// Call init functions when windows are opened
document.querySelectorAll(".start-menu-item, .desktop-icon, .taskbar-icon").forEach(item => {
	item.addEventListener("click", () => {
		// Don't re-initialize the terminal here
		const id = item.id.replace("-icon", "").replace("-desktop", "").replace("-menu-item", "").replace("-taskbar", "");
		if (id !== "terminal") {
			setTimeout(initOtherWindows, 100);
		}
	});
});

// Portfolio Section Navigation
function scrollToSection(sectionId) {
	const section = document.getElementById(sectionId);
	if (section) {
		// Close the start menu if it's open
		document.getElementById("start-menu").style.display = "none";
		
		// Hide all windows
		document.querySelectorAll(".window").forEach(window => {
			window.style.display = "none";
		});
		
		// Scroll to the section
		section.scrollIntoView({ behavior: "smooth" });
	}
}

// Add event listeners for portfolio section navigation
const portfolioSections = [
	{ id: "about", menuId: "about-menu-item", iconId: "about-icon", taskbarId: "about-taskbar-icon" },
	{ id: "skills", menuId: "skills-menu-item", iconId: "skills-icon", taskbarId: "skills-taskbar-icon" },
	{ id: "projects", menuId: "projects-menu-item", iconId: "projects-icon", taskbarId: "projects-taskbar-icon" },
	{ id: "contact", menuId: "contact-menu-item", iconId: "contact-icon", taskbarId: "contact-taskbar-icon" }
];

portfolioSections.forEach(section => {
	const menuItem = document.getElementById(section.menuId);
	const icon = document.getElementById(section.iconId);
	const taskbarIcon = document.getElementById(section.taskbarId);
	
	if (menuItem) {
		menuItem.addEventListener("click", () => {
			scrollToSection(section.id);
		});
	}
	
	if (icon) {
		icon.addEventListener("click", () => {
			scrollToSection(section.id);
		});
	}
	
	if (taskbarIcon) {
		taskbarIcon.addEventListener("click", () => {
			scrollToSection(section.id);
		});
	}
});

// Hack Button Animation
function initializeHack() {
	const hackButton = document.querySelector(".hack-button");
	hackButton.innerHTML = "ACCESS GRANTED";
	hackButton.style.background = "#00ff00";
	hackButton.style.color = "#000";
	hackButton.style.boxShadow = "0 0 30px #00ff00";
	setTimeout(() => {
		window.location.href = "#about";
	}, 2000);
}

// Contact Form Submission
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", function (e) {
	e.preventDefault();
	const formData = new FormData(contactForm);
	const formStatus = document.getElementById("formStatus");
	formStatus.innerHTML = "Sending...";
	fetch("https://formspree.io/f/mwkajnlg", {
		method: "POST",
		body: formData,
		headers: {
			Accept: "application/json",
		},
	})
		.then((response) => {
			if (response.ok) {
				formStatus.innerHTML = "Message sent successfully!";
				contactForm.reset();
			} else {
				formStatus.innerHTML = "Error sending message. Please try again.";
			}
		})
		.catch((error) => {
			formStatus.innerHTML = "Error sending message. Please try again.";
		});
});

document
	.getElementById("contactForm")
	.addEventListener("submit", function (e) {
		e.preventDefault();
		document.getElementById("formStatus").innerHTML =
			"<span style='color:#00ff00;'>Thank you! Your message has been received.</span>";
		this.reset();
	});

// Typing effect for terminal prompt
const promptLines = [
	"Initializing cyber_developer.exe...",
	"Bypassing firewalls...",
	"Accessing portfolio mainframe...",
	"Welcome, user.",
];
let promptIndex = 0;
let charIndex = 0;
function typePrompt() {
	const typedText = document.getElementById("typed-text");
	if (!typedText) return;
	if (charIndex < promptLines[promptIndex].length) {
		typedText.textContent += promptLines[promptIndex][charIndex];
		charIndex++;
		setTimeout(typePrompt, 50);
	} else {
		setTimeout(() => {
			typedText.textContent = "";
			charIndex = 0;
			promptIndex = (promptIndex + 1) % promptLines.length;
			typePrompt();
		}, 1200);
	}
}
typePrompt();

// Animated hacker code background in hero section
const hackerBgCode = document.getElementById("hacker-bg-code");
const hackerLines = [
	"root@cyber:~$ nmap -A 192.168.1.1",
	"Starting Nmap 7.91 ( https://nmap.org )",
	"PORT     STATE SERVICE VERSION",
	"22/tcp   open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3",
	"80/tcp   open  http    Apache httpd 2.4.29",
	"443/tcp  open  ssl/https",
	"root@cyber:~$ ssh krishna@192.168.1.1",
	"krishna@192.168.1.1's password: ********",
	"Access granted. Welcome, Krishna.",
	"root@cyber:~$ ./run_portfolio.sh",
	"Loading portfolio...",
	"Fetching latest projects...",
	"Connecting to database...",
	"Portfolio loaded successfully.",
	"root@cyber:~$ echo 'Welcome to my portfolio!'",
	"Welcome to my portfolio!",
	"root@cyber:~$ ls -la",
	"total 48",
	"drwxr-xr-x  6 krishna krishna 4096 Oct 10 12:00 .",
	"drwxr-xr-x  3 root    root    4096 Oct 10 11:59 ..",
	"-rw-r--r--  1 krishna krishna  123 Oct 10 12:00 index.html",
	"-rw-r--r--  1 krishna krishna  456 Oct 10 12:00 styles.css",
	"-rw-r--r--  1 krishna krishna  789 Oct 10 12:00 script.js",
	"-rw-r--r--  1 krishna krishna 1011 Oct 10 12:00 portfolio.json",
	"root@cyber:~$ cat portfolio.json",
	"{",
	"  \"name\": \"Krishna Somnath Baviskar\",",
	"  \"role\": \"Full Stack Developer\",",
	"  \"skills\": [",
	"    \"HTML5/CSS3\",",
	"    \"JavaScript/TypeScript\",",
	"    \"React/Vue.js\",",
	"    \"Node.js\",",
	"    \"Cybersecurity\",",
	"    \"Database Management\",",
	"    \"Cloud Computing\"",
	"  ],",
];
let codeLine = 0;
function animateHackerCode() {
	if (!hackerBgCode) return;
	hackerBgCode.textContent = hackerLines
		.slice(0, codeLine + 1)
		.join("\n");
	codeLine = (codeLine + 1) % hackerLines.length;
	setTimeout(animateHackerCode, 700);
}
animateHackerCode();
