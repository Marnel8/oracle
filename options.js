// Save and restore the API key and position
document.addEventListener("DOMContentLoaded", function () {
	// Load saved API key
	chrome.storage.sync.get(
		["openai_api_key", "button_position"],
		function (result) {
			if (result.openai_api_key) {
				document.getElementById("openai-api-key").value = result.openai_api_key;
			}

			// Set position radio button based on saved preference
			if (result.button_position === "left") {
				document.getElementById("position-left").checked = true;
			} else {
				// Default to right if not set or is set to "right"
				document.getElementById("position-right").checked = true;
			}
		}
	);

	// Save button click handler
	document.getElementById("save-button").addEventListener("click", function () {
		const apiKey = document.getElementById("openai-api-key").value.trim();

		// Get selected position
		const positionRadios = document.getElementsByName("position");
		let selectedPosition = "right"; // default

		for (const radio of positionRadios) {
			if (radio.checked) {
				selectedPosition = radio.value;
				break;
			}
		}

		// Save to chrome storage
		chrome.storage.sync.set(
			{
				openai_api_key: apiKey,
				button_position: selectedPosition,
			},
			function () {
				// Show success message
				const successMessage = document.getElementById("success-message");
				successMessage.style.display = "block";

				// Hide success message after 3 seconds
				setTimeout(function () {
					successMessage.style.display = "none";
				}, 3000);

				// Notify content scripts about the position change
				chrome.tabs.query({}, function (tabs) {
					for (let tab of tabs) {
						chrome.tabs
							.sendMessage(tab.id, {
								action: "updatePosition",
								position: selectedPosition,
							})
							.catch(() => {}); // Ignore errors (not all tabs will have content script)
					}
				});
			}
		);
	});
});
