import { loadHeaderFooter } from "./utils.mjs";
import { alertMessage, getLocalStorage, setLocalStorage } from "./utils.mjs";
import Alert from "./Alert.js";  // <-- import Alert

loadHeaderFooter();

// Initialize alerts
new Alert();

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newsletter-form");
  const emailInput = document.getElementById("newsletter-email");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();

      if (validateEmail(email)) {
        const subscribers = getLocalStorage("subscribers") || [];

        if (!subscribers.includes(email)) {
          subscribers.push(email);
          setLocalStorage("subscribers", subscribers);
          alertMessage("Thank you for subscribing!", true, 3000);
          form.reset();
        } else {
          alertMessage("You're already subscribed.", true, 3000);
        }

      } else {
        alertMessage("Please enter a valid email address.", true, 3000);
      }
    });
  }
});

function validateEmail(email) {
  // Simple email regex
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}