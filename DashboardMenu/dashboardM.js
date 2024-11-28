const tabs = document.querySelectorAll('.sidebar ul li');
const mainSection = document.getElementById('main-section');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active class from all tabs
    tabs.forEach(t => t.classList.remove('active'));
    
    // Add active class to the clicked tab
    tab.classList.add('active');

    // Update the main content
    const tabName = tab.querySelector('span').textContent;
    if (tab.id === 'logout-tab') {
      mainSection.innerHTML = `<h2>Goodbye!</h2><p>You have successfully logged out.</p>`;
    } else {
      mainSection.innerHTML = `<h2>${tabName}</h2><p>Details about ${tabName} will appear here.</p>`;
    }
  });
});
