const modeSwitch = document.getElementById("modeSwitch");
const userInput = document.getElementById("userInput");
const messagesContainer = document.getElementById("messages"); // Add this line

const GEMINI_API_KEY = "AIzaSyBrfMrVIX95_vLrLEoqdb_fkP9erMiy9_8";
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
  GEMINI_API_KEY;

async function sendMessage() {
  const userText = userInput.value.trim();
  if (!userText) return;

  addMessage(userText, "user");
  userInput.value = "";
  showTypingIndicator();

  const isRude = modeSwitch.checked;
  const personality = isRude
    ? "You're a rude, sarcastic chatbot. Be blunt, snarky, and act annoyed."
    : "You're a helpful, friendly chatbot. Be polite, clear, and supportive.";

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: personality + " " + userText }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API Error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    const botReply = data.candidates[0].content.parts[0].text;
    removeTypingIndicator();
    addMessage(botReply, "bot");
  } catch (error) {
    console.error(error);
    removeTypingIndicator();
    addMessage(
      "Error: Couldn't get a response from Gemini. Check your API key or internet.",
      "bot"
    );
  }
}

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.textContent = text;
  messagesContainer.appendChild(msg);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
function showTypingIndicator() {
  const indicator = document.createElement("div");
  indicator.className = "typing-indicator message bot";
  indicator.id = "typing-indicator";
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div");
    dot.className = "typing-dot";
    indicator.appendChild(dot);
  }
  messagesContainer.appendChild(indicator);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
function removeTypingIndicator() {
  const indicator = document.getElementById("typing-indicator");
  if (indicator) indicator.remove();
}
userInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") sendMessage();
});
