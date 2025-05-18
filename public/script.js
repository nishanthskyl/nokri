document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const jobResults = document.getElementById('jobResults');
    const loading = document.getElementById('loading');
    const resultsTitle = document.getElementById('resultsTitle');
    
    searchButton.addEventListener('click', async function() {
        const skills = document.getElementById('skills').value.toLowerCase();
        const designation = document.getElementById('designation').value.toLowerCase();
        const companies = document.getElementById('companies').value.toLowerCase();
        const location = document.getElementById('location').value.toLowerCase();
        
        // Show loading spinner
        loading.style.display = 'block';
        jobResults.innerHTML = '';
        resultsTitle.style.display = 'none';
        
        try {
            // Call our Cloudflare Worker endpoint
            const response = await fetch('/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    skills,
                    designation,
                    companies,
                    location
                })
            });
            
            const data = await response.json();
            
            // Hide loading spinner
            loading.style.display = 'none';
            
            if (data.length === 0) {
                jobResults.innerHTML = '<div class="no-results">No jobs found matching your criteria.</div>';
                resultsTitle.style.display = 'block';
                return;
            }
            
            resultsTitle.style.display = 'block';
            
            // Display results
            data.forEach(job => {
                const jobCard = document.createElement('div');
                jobCard.className = 'job-card';
                
                jobCard.innerHTML = `
                    <h3 class="job-title">${job.designation}</h3>
                    <div class="company-name">${job.company}</div>
                    <div class="job-location">📍 ${job.location}</div>
                    <div class="job-skills">🛠️ ${job.skills.join(', ')}</div>
                    <div class="job-description">${job.description}</div>
                    <a href="${job.applyLink}" target="_blank" class="apply-button">Apply Now</a>
                `;
                
                jobResults.appendChild(jobCard);
            });
        } catch (error) {
            console.error('Error fetching jobs:', error);
            loading.style.display = 'none';
            jobResults.innerHTML = '<div class="no-results">Error fetching jobs. Please try again later.</div>';
        }
    });
});