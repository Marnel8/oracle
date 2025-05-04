// Show greeting when popup opens
document.addEventListener("DOMContentLoaded", function () {
	// Handle image error properly without using inline event handlers
	const iconImage = document.querySelector(".icon-image");
	if (iconImage) {
		// Add error handler programmatically
		iconImage.addEventListener("error", function () {
			this.style.display = "none";
			this.parentNode.classList.add("fallback-icon");
		});

		// Add load handler to ensure image is properly displayed
		iconImage.addEventListener("load", function () {
			this.style.display = "";
			this.parentNode.classList.remove("fallback-icon");
		});

		// Force reload the image
		const originalSrc = iconImage.src;
		iconImage.src = "";
		setTimeout(() => {
			iconImage.src = originalSrc;
		}, 10);
	}

	// Try to get greeting from localStorage
	try {
		const greeting = localStorage.getItem("oracleGreeting");
		if (greeting) {
			// Show greeting at the top of the popup
			const greetingElement = document.createElement("div");
			greetingElement.className = "greeting";
			greetingElement.textContent = greeting;

			// Insert it at the top of the body, before the header
			const header = document.querySelector(".header");
			document.body.insertBefore(greetingElement, header);
		}
	} catch (e) {
		console.log("Could not retrieve greeting");
	}
});

// Button click handler
document.getElementById("toggle-chatbot").addEventListener("click", () => {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		// Check if we can access this tab (not a chrome:// URL)
		if (
			tabs[0] &&
			!tabs[0].url.startsWith("chrome://") &&
			!tabs[0].url.startsWith("edge://") &&
			!tabs[0].url.startsWith("about:")
		) {
			// Execute script to toggle the chatbot
			chrome.scripting.executeScript({
				target: { tabId: tabs[0].id, allFrames: false },
				function: () => {
					const chatButton = document.getElementById("oracle-chat-button");

					// If element doesn't exist yet, don't do anything (content script will create it)
					if (!chatButton) return;

					// Toggle the expanded state
					if (chatButton.classList.contains("expanded")) {
						// Collapse the chatbot back to button
						chatButton.classList.remove("expanded");
					} else {
						// Expand the button to chatbot
						chatButton.classList.add("expanded");

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
							const inputField = document.getElementById("user-input");
							if (inputField) inputField.focus();
						}, 600);
					}
				},
			});
		} else {
			console.log("Cannot access this page due to browser restrictions");
		}
	});

	// Close the popup after clicking
	setTimeout(() => window.close(), 300);
});

// Open settings page when link is clicked
document
	.getElementById("open-settings")
	.addEventListener("click", function (e) {
		e.preventDefault();
		if (chrome.runtime.openOptionsPage) {
			chrome.runtime.openOptionsPage();
		} else {
			window.open(chrome.runtime.getURL("options.html"));
		}
	});
