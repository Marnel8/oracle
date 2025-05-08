// Create Chatbot Container and Chat Button
const chatContainer = document.createElement("div");
chatContainer.id = "oracle-container";

// Create the chat button with Oracle image and fallback
const chatButton = document.createElement("div");
chatButton.id = "oracle-chat-button";
chatButton.className = "position-right"; // Default position class
chatButton.innerHTML = `
  <div class="chat-button-content">
    <div class="chat-icon">
      <img src="chrome-extension://__MSG_@@extension_id__/icons/pagemate.png" alt="O" width="40" height="40" 
        class="icon-image">
      <span class="fallback-text">O</span>
    </div>
  </div>
  <div id="oracle-chatbox">
    <div id="chatbot-header">
      <div class="header-left">
        <div class="header-icon">
          <img src="chrome-extension://__MSG_@@extension_id__/icons/pagemate.png" alt="O" width="24" height="24" 
            class="icon-image">
          <span class="fallback-text">O</span>
        </div>
        <span class="header-title">Oracle</span>
      </div>
      <button id="minimize-btn">
        <svg width="14" height="2" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="14" height="2" rx="1" fill="white"/>
        </svg>
      </button>
    </div>
    <div id="chatbot-content"> 
      <div id="chatbot-messages">
        <!-- Messages will be added here dynamically -->
      </div>
      <div id="chatbot-input-container">
        <input type="text" id="user-input" placeholder="Ask Oracle...">
        <button id="send-btn">
          <!-- Send icon (default state) -->
          <svg id="send-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
          <!-- Sending icon (animated dots) - hidden by default -->
          <div id="sending-icon" style="display: none;">
            <span></span>
            <span></span>
            <span></span>
          </div>
          
          <!-- Sent icon (checkmark) - hidden by default -->
          <svg id="sent-icon" style="display: none;" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div id="chatbot-footer">
        <span class="footer-text">By Marnel Valentin</span>
      </div>
    </div>
  </div>
`;

// Set position based on saved preference
chrome.storage.sync.get(["button_position"], function (result) {
	const position = result.button_position || "right"; // Default to right
	setButtonPosition(position);
});

// Function to set button position
function setButtonPosition(position) {
	chatButton.className =
		position === "left" ? "position-left" : "position-right";
}

// Listen for position change messages from options page
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.action === "updatePosition") {
		setButtonPosition(message.position);
	}

	// Always return true to indicate async response
	return true;
});

// Append the button to body
document.body.appendChild(chatButton);

// Add welcome message
const addWelcomeMessage = () => {
	const messagesDiv = document.getElementById("chatbot-messages");
	if (messagesDiv) {
		// Add welcome message directly
		const aiMessage = document.createElement("div");
		aiMessage.className = "ai-message";
		aiMessage.textContent = getResponse("greetings");
		messagesDiv.appendChild(aiMessage);

		// Apply animation with slight delay
		setTimeout(() => {
			aiMessage.style.opacity = "1";
			aiMessage.style.transform = "translateY(0)";
		}, 100);
	}
};

// Default answers for different scenarios
const defaultAnswers = {
	error: [
		"I'm sorry, there was an error processing your request. Please try again later.",
		"Oops! Something went wrong. Please try asking a different question.",
		"I encountered a technical issue. Could you try rephrasing your question?",
	],
	noAnswer: [
		"I don't have a specific answer for that, but I can help you navigate this page. Try asking about specific elements or content you see.",
		"I'm not sure I understand your question. Could you be more specific about what you'd like to know?",
		"I don't have enough information to answer that question. Can you provide more details about what you're looking for?",
	],
	greetings: [
		"Hello! I'm Oracle, how can I assist you?",
		"Hi there! I'm ready to help you navigate this page. What would you like to know?",
		"Welcome! I'm Oracle, your page assistant. How can I help you today?",
	],
	thanks: ["You're welcome!", "Happy to help!", "Glad I could assist!"],
	goodbye: ["Goodbye!", "See you later!", "Have a great day!"],
	generalHelp:
		"I can help you navigate this page, find information, or answer questions about the content. What would you like to know?",
};

// Function to get a random response, but cycle through them to avoid repetition
const responseCounters = {
	error: 0,
	noAnswer: 0,
	greetings: 0,
};

const getResponse = (type) => {
	const responses = defaultAnswers[type];
	if (!Array.isArray(responses)) return responses;

	// Get current counter for this type
	const index = responseCounters[type] % responses.length;
	// Increment counter for next time
	responseCounters[type] = (responseCounters[type] + 1) % responses.length;

	return responses[index];
};

// Function to select a random response from an array
const getRandomResponse = (responses) => {
	if (Array.isArray(responses)) {
		return responses[Math.floor(Math.random() * responses.length)];
	}
	return responses;
};

// Function to check if input is a greeting
const isGreeting = (input) => {
	const greetings = ["hi", "hello", "hey", "greetings", "howdy"];
	const lowerInput = input.toLowerCase();
	const result = greetings.some(
		(greeting) =>
			lowerInput === greeting || lowerInput.startsWith(greeting + " ")
	);
	console.log("isGreeting check:", lowerInput, "Result:", result);
	return result;
};

// Function to check if input is a thank you
const isThanks = (input) => {
	const thanks = ["thank", "thanks", "appreciate", "grateful"];
	const lowerInput = input.toLowerCase();
	const result = thanks.some(
		(term) =>
			lowerInput === term ||
			lowerInput.includes(" " + term + " ") ||
			lowerInput.startsWith(term + " ") ||
			lowerInput.endsWith(" " + term)
	);
	console.log("isThanks check:", lowerInput, "Result:", result);
	return result;
};

// Function to check if input is a goodbye
const isGoodbye = (input) => {
	const goodbyes = ["bye", "goodbye", "see you", "farewell"];
	const lowerInput = input.toLowerCase();
	const result = goodbyes.some(
		(term) =>
			lowerInput === term ||
			lowerInput.includes(" " + term + " ") ||
			lowerInput.startsWith(term + " ") ||
			lowerInput.endsWith(" " + term)
	);
	console.log("isGoodbye check:", lowerInput, "Result:", result);
	return result;
};

// Function to check if input is asking for help
const isHelpRequest = (input) => {
	const helpTerms = ["help", "assist", "how do", "what can", "?"];
	const lowerInput = input.toLowerCase();
	// Make the "?" check more specific - only trigger if question mark is part of a relevant phrase
	const hasQuestionMark =
		lowerInput.includes("?") &&
		(lowerInput.includes("how") ||
			lowerInput.includes("what") ||
			lowerInput.includes("where") ||
			lowerInput.includes("why") ||
			lowerInput.includes("who") ||
			lowerInput.includes("when"));

	const result = helpTerms.some((term) => {
		if (term === "?") return hasQuestionMark;
		return (
			lowerInput === term ||
			lowerInput.includes(" " + term + " ") ||
			lowerInput.startsWith(term + " ") ||
			lowerInput.endsWith(" " + term)
		);
	});

	console.log("isHelpRequest check:", lowerInput, "Result:", result);
	return result;
};

// Add error handlers to all extension images programmatically
const handleImageErrors = () => {
	const allExtensionImages = document.querySelectorAll(".icon-image");

	allExtensionImages.forEach((img) => {
		// Add error handler programmatically instead of inline
		img.addEventListener("error", function () {
			this.style.display = "none";
			this.parentNode.classList.add("fallback-icon");

			// Try using a different approach with blob URL
			tryFetchingImageAsBlob(this);
		});

		// Also add load handler to ensure image is visible
		img.addEventListener("load", function () {
			this.style.display = "";
			this.parentNode.classList.remove("fallback-icon");
		});
	});
};

// Try to fetch the image as a blob and use a blob URL instead
function tryFetchingImageAsBlob(imgElement) {
	try {
		// Parse the extension ID from the URL
		const extensionIdMatch = imgElement.src.match(
			/chrome-extension:\/\/([^\/]+)/
		);
		if (!extensionIdMatch || !extensionIdMatch[1]) return;

		const extensionId = extensionIdMatch[1];

		// Create a proper URL that doesn't use the placeholder
		const properUrl = imgElement.src.replace(
			"__MSG_@@extension_id__",
			extensionId
		);

		// Fetch the image as a blob
		fetch(properUrl)
			.then((response) => response.blob())
			.then((blob) => {
				// Create a blob URL and use it for the image
				const blobUrl = URL.createObjectURL(blob);
				imgElement.src = blobUrl;
				imgElement.style.display = "";
				imgElement.parentNode.classList.remove("fallback-icon");
			})
			.catch((err) => {
				console.log("Failed to load image as blob:", err);
			});
	} catch (e) {
		console.log("Error trying to use blob URL for image:", e);
	}
}

// Handle image errors
handleImageErrors();

// Try to load images if possible and fallback if not
setTimeout(() => {
	try {
		// Try to load the extension icon directly from the extension's directory
		const extensionImages = document.querySelectorAll(".icon-image");
		extensionImages.forEach((img) => {
			// Update the image src to use a more direct approach
			const originalSrc = img.src;

			// Force reload the image by setting src again
			img.src = "";
			img.src = originalSrc;
		});
	} catch (e) {
		console.log("Error trying to load extension images:", e);
	}
}, 500);

// Add attention animation class to button on page load
setTimeout(() => {
	const buttonContent = document.querySelector(".chat-button-content");
	if (buttonContent) {
		buttonContent.classList.add("attention-animation");
	}
}, 1000);

// Function to toggle attention animation
const toggleAttentionAnimation = () => {
	const buttonContent = document.querySelector(".chat-button-content");
	if (buttonContent && !chatButton.classList.contains("expanded")) {
		// First remove animation
		buttonContent.classList.remove("attention-animation");

		// Force reflow to restart animation
		void buttonContent.offsetWidth;

		// Add animation back
		buttonContent.classList.add("attention-animation");
	}
};

// Define greeting to show in popup
const popupGreeting = getResponse("greetings");

// Function to show greeting in the popup when it's first opened
function showInitialGreeting() {
	try {
		// Store a proper introduction greeting in localStorage
		const introGreeting =
			"Hello! I'm Oracle, your AI web assistant. I can help you navigate pages, find information, and answer questions about content.";
		localStorage.setItem("oracleGreeting", introGreeting);
	} catch (e) {
		console.log("Could not store greeting in localStorage");
	}
}

// Call this when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
	// Store greeting for popup
	showInitialGreeting();
});

// Set interval to toggle attention animation every 15 seconds
setInterval(toggleAttentionAnimation, 15000);

// Toggle chatbot when clicking the chat button
document
	.getElementById("oracle-chat-button")
	.addEventListener("click", function (e) {
		// Don't expand if clicking on the minimize button or if already expanded
		if (
			e.target.closest("#minimize-btn") ||
			this.classList.contains("expanded")
		) {
			return;
		}

		// Toggle expanded class to trigger the CSS transition
		this.classList.add("expanded");

		// Set up scrolling once the chat is expanded (with a small delay to allow DOM to update)
		setTimeout(setupChatScrolling, 100);

		// Add welcome greeting when the chatbox is opened
		const messagesDiv = document.getElementById("chatbot-messages");
		if (messagesDiv && messagesDiv.children.length === 0) {
			// Initial greeting message
			const introMessage = document.createElement("div");
			introMessage.className = "ai-message";
			introMessage.textContent =
				"Hello! I'm Oracle, your AI web assistant. I can help you navigate this page, find information, or answer questions about the content. How can I help you today?";
			messagesDiv.appendChild(introMessage);

			// Apply animation with slight delay
			setTimeout(() => {
				introMessage.style.opacity = "1";
				introMessage.style.transform = "translateY(0)";
			}, 600);
		}

		// Focus the input field after animation completes
		setTimeout(() => {
			document.getElementById("user-input").focus();
		}, 600);
	});

// Handle minimize button
document.getElementById("minimize-btn").addEventListener("click", () => {
	const chatButtonElement = document.getElementById("oracle-chat-button");

	// Remove expanded class to collapse back to button
	chatButtonElement.classList.remove("expanded");
});

// Handle User Queries
document.getElementById("send-btn").addEventListener("click", handleUserQuery);
document.getElementById("user-input").addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		handleUserQuery();
	}
});

// Function to handle user queries
async function handleUserQuery() {
	console.log("handleUserQuery started");
	const userInput = document.getElementById("user-input").value;
	if (!userInput) return;

	console.log("Processing user input:", userInput);

	// Clear Input Field and focus it
	document.getElementById("user-input").value = "";
	document.getElementById("user-input").focus();

	// Show sending state
	const sendButton = document.getElementById("send-btn");
	sendButton.classList.add("sending");

	// Display User Message
	const messagesDiv = document.getElementById("chatbot-messages");
	const userMessage = document.createElement("div");
	userMessage.className = "user-message";
	userMessage.textContent = userInput;
	messagesDiv.appendChild(userMessage);

	// Apply animation
	setTimeout(() => {
		userMessage.style.opacity = "1";
		userMessage.style.transform = "translateY(0)";
	}, 10);

	// Scroll to latest message
	messagesDiv.scrollTop = messagesDiv.scrollHeight;

	// Show loading indicator
	const loadingMessage = document.createElement("div");
	loadingMessage.className = "ai-message loading";
	loadingMessage.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
	messagesDiv.appendChild(loadingMessage);
	loadingMessage.style.opacity = "1";

	try {
		// Get response from Ollama
		const response = await sendMessageToOllama(userInput);

		// Remove loading indicator
		if (messagesDiv.contains(loadingMessage)) {
			messagesDiv.removeChild(loadingMessage);
		}

		// Add AI response
		const aiMessage = document.createElement("div");
		aiMessage.className = "ai-message";
		aiMessage.textContent = response;
		messagesDiv.appendChild(aiMessage);

		// Apply animation
		setTimeout(() => {
			aiMessage.style.opacity = "1";
			aiMessage.style.transform = "translateY(0)";
		}, 10);

		// Change to sent state
		sendButton.classList.remove("sending");
		sendButton.classList.add("sent");

		// Wait 1 second before switching back to normal state
		setTimeout(() => {
			sendButton.classList.remove("sent");
		}, 1000);

		// Scroll to latest message
		messagesDiv.scrollTop = messagesDiv.scrollHeight;
	} catch (error) {
		console.error("Error generating response:", error);

		// Reset button state
		sendButton.classList.remove("sending");

		// Remove loading indicator if it exists
		if (messagesDiv.contains(loadingMessage)) {
			messagesDiv.removeChild(loadingMessage);
		}

		// Show error message
		const errorMessage = document.createElement("div");
		errorMessage.className = "ai-message error";
		errorMessage.textContent =
			"I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.";
		messagesDiv.appendChild(errorMessage);

		// Apply animation
		setTimeout(() => {
			errorMessage.style.opacity = "1";
			errorMessage.style.transform = "translateY(0)";
		}, 10);

		// Scroll to latest message
		messagesDiv.scrollTop = messagesDiv.scrollHeight;
	}
}

// Function to get visible text and website structure
function getVisibleText() {
	// Get website structure information
	const websiteInfo = {
		title: document.title,
		url: window.location.href,
		description:
			document.querySelector('meta[name="description"]')?.content || "",
		keywords: document.querySelector('meta[name="keywords"]')?.content || "",
		headings: [],
		links: [],
		mainContent: "",
		navigation: [],
	};

	// Get all headings
	const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
	headings.forEach((heading) => {
		if (isElementVisible(heading)) {
			websiteInfo.headings.push({
				level: heading.tagName.toLowerCase(),
				text: heading.textContent.trim(),
			});
		}
	});

	// Get navigation links
	const navElements = document.querySelectorAll(
		'nav, header, [role="navigation"]'
	);
	navElements.forEach((nav) => {
		const links = nav.querySelectorAll("a");
		links.forEach((link) => {
			if (isElementVisible(link)) {
				websiteInfo.navigation.push({
					text: link.textContent.trim(),
					href: link.href,
				});
			}
		});
	});

	// Get main content
	const mainContent = document.querySelector(
		'main, [role="main"], #main, .main, article'
	);
	if (mainContent) {
		websiteInfo.mainContent = getElementText(mainContent);
	}

	// Get all visible links
	const links = document.querySelectorAll("a");
	links.forEach((link) => {
		if (isElementVisible(link)) {
			websiteInfo.links.push({
				text: link.textContent.trim(),
				href: link.href,
			});
		}
	});

	// Format the website information
	let context = `Website Information:
Title: ${websiteInfo.title}
URL: ${websiteInfo.url}
Description: ${websiteInfo.description}
Keywords: ${websiteInfo.keywords}

Structure:
${websiteInfo.headings.map((h) => `${h.level}: ${h.text}`).join("\n")}

Navigation:
${websiteInfo.navigation.map((n) => `- ${n.text} (${n.href})`).join("\n")}

Main Content:
${websiteInfo.mainContent}

Available Links:
${websiteInfo.links.map((l) => `- ${l.text} (${l.href})`).join("\n")}`;

	return context;
}

// Helper function to check if an element is visible
function isElementVisible(element) {
	const style = window.getComputedStyle(element);
	return (
		style.display !== "none" &&
		style.visibility !== "hidden" &&
		style.opacity !== "0" &&
		element.offsetWidth > 0 &&
		element.offsetHeight > 0
	);
}

// Helper function to get text content from an element
function getElementText(element) {
	const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
		acceptNode: function (node) {
			return isElementVisible(node.parentElement)
				? NodeFilter.FILTER_ACCEPT
				: NodeFilter.FILTER_REJECT;
		},
	});

	let text = "";
	let node;
	while ((node = walker.nextNode()) && text.length < 3000) {
		text += node.textContent.trim() + " ";
	}

	return text.trim();
}

// Function to send message to Ollama backend
async function sendMessageToOllama(message) {
	try {
		// Get comprehensive website context
		const websiteContext = getVisibleText();

		const response = await fetch("http://localhost:3000/api/chat", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				message,
				pageContext: websiteContext,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || "Failed to get response from server");
		}

		const data = await response.json();
		return data.response;
	} catch (error) {
		console.error("Error:", error);

		// Return specific error messages based on the error
		if (error.message.includes("Ollama server is not running")) {
			return "I'm having trouble connecting to my brain. Please make sure Ollama is running by executing 'ollama serve' in your terminal.";
		} else if (error.message.includes("Llama 3.2 model not found")) {
			return "I need to download my brain first. Please run 'ollama pull llama3.2' in your terminal.";
		} else if (error.message.includes("Failed to get response from server")) {
			return "I'm having trouble connecting to my server. Please make sure the backend server is running.";
		} else {
			return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.";
		}
	}
}

// Add some micro-interactions
document.addEventListener("mousemove", (e) => {
	const chatButton = document.getElementById("oracle-chat-button");

	// Only apply if chatbot is not expanded
	if (!chatButton.classList.contains("expanded")) {
		// Get button position
		const buttonRect = chatButton.getBoundingClientRect();
		const buttonCenterX = buttonRect.left + buttonRect.width / 2;
		const buttonCenterY = buttonRect.top + buttonRect.height / 2;

		// Calculate distance from mouse to button center (max 100px effect radius)
		const distX = (e.clientX - buttonCenterX) / 30;
		const distY = (e.clientY - buttonCenterY) / 30;

		// Apply subtle tilt effect based on mouse position if within 100px
		const distance = Math.sqrt(
			Math.pow(e.clientX - buttonCenterX, 2) +
				Math.pow(e.clientY - buttonCenterY, 2)
		);
		if (distance < 200) {
			chatButton.style.transform = `translate(${distX / 10}px, ${
				distY / 10
			}px) rotate(${distX / 5}deg)`;
		} else {
			chatButton.style.transform = "";
		}
	}
});

// Ensure the chat container has proper scrolling
function setupChatScrolling() {
	// Find the chat messages container
	const messagesDiv = document.getElementById("chatbot-messages");
	if (messagesDiv) {
		// Calculate available height based on the chat container
		const chatbox = document.getElementById("oracle-chatbox");
		const header = document.getElementById("chatbot-header");
		const inputContainer = document.getElementById("chatbot-input-container");
		const footer = document.getElementById("chatbot-footer");

		if (chatbox && header && inputContainer && footer) {
			// Get heights of the different elements
			const chatboxHeight = chatbox.offsetHeight;
			const headerHeight = header.offsetHeight || 48; // Use 48px as fallback
			const inputHeight = inputContainer.offsetHeight || 52; // Use 52px as fallback
			const footerHeight = footer.offsetHeight || 23; // Use 23px as fallback

			// Calculate the maximum height for the messages area
			// Leave a small buffer (10px) for any padding/margins
			const maxHeight =
				chatboxHeight - headerHeight - inputHeight - footerHeight - 10;

			console.log("Setting up chat scrolling with max height:", maxHeight);
			console.log("Available space breakdown:", {
				chatboxHeight,
				headerHeight,
				inputHeight,
				footerHeight,
			});

			// Make sure it has the correct styles for scrolling
			messagesDiv.style.maxHeight = maxHeight + "px"; // Dynamic max height
			messagesDiv.style.height = maxHeight + "px"; // Set a fixed height too
			messagesDiv.style.overflowY = "auto"; // Enable vertical scrolling
			messagesDiv.style.scrollBehavior = "smooth"; // Smooth scrolling
			messagesDiv.style.width = "100%"; // Full width
			messagesDiv.style.boxSizing = "border-box"; // Include padding in width/height
		} else {
			// Fallback to a reasonable default if we can't calculate
			messagesDiv.style.maxHeight = "320px";
			messagesDiv.style.height = "320px";
			messagesDiv.style.overflowY = "auto";
			messagesDiv.style.scrollBehavior = "smooth";
			messagesDiv.style.width = "100%";
			messagesDiv.style.boxSizing = "border-box";
		}

		// Add a MutationObserver to scroll to bottom when new messages are added
		const observer = new MutationObserver(() => {
			messagesDiv.scrollTop = messagesDiv.scrollHeight;
		});

		// Start observing the messages container for added nodes
		observer.observe(messagesDiv, { childList: true });
	}
}
