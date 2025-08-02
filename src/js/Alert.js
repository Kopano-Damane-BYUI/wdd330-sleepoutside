export default class Alert {
  constructor(jsonPath = '../public/json/alerts.json') {
    this.jsonPath = jsonPath;
    this.mainElement = document.querySelector('main');
    if (this.mainElement) {
      this.loadAlerts();
    } else {
      console.error('Main element not found!');
    }
  }

  async loadAlerts() {
    try {
      const response = await fetch(this.jsonPath);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const alerts = await response.json();
      if (alerts.length > 0) {
        this.displayAlerts(alerts);
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  }

  displayAlerts(alerts) {
    const section = document.createElement('section');
    section.classList.add('alert-list');

    alerts.forEach(({ message, background, color }) => {
      const alertItem = document.createElement('p');
      alertItem.textContent = message;
      alertItem.style.backgroundColor = background;
      alertItem.style.color = color;
      alertItem.style.padding = '10px';
      alertItem.style.margin = '0';
      alertItem.style.fontWeight = 'bold';
      section.appendChild(alertItem);
    });

    this.mainElement.prepend(section);
  }
}