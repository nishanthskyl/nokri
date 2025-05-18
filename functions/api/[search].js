export async function onRequestPost(context) {
    try {
        const { request } = context;
        const { skills, designation, companies, location } = await request.json();
        
        // Fetch the job data from the external API (hidden from client)
        const apiUrl = 'https://suraj-996.github.io/Naukri.com-API/api.json';
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const allJobs = await response.json();
        
        // Filter jobs based on user criteria
        const filteredJobs = allJobs.filter(job => {
            // Convert all search terms to lowercase for case-insensitive comparison
            const searchSkills = skills.toLowerCase();
            const searchDesignation = designation.toLowerCase();
            const searchCompanies = companies.toLowerCase();
            const searchLocation = location.toLowerCase();
            
            // Convert job data to lowercase
            const jobSkills = job.skills.map(s => s.toLowerCase());
            const jobDesignation = job.designation ? job.designation.toLowerCase() : '';
            const jobCompany = job.company ? job.company.toLowerCase() : '';
            const jobLocation = job.location ? job.location.toLowerCase() : '';
            
            // Check if job matches all provided criteria
            const matchesSkills = !skills || jobSkills.some(skill => 
                skill.includes(searchSkills) || searchSkills.split(',').some(s => skill.includes(s.trim()))
            );
            
            const matchesDesignation = !designation || 
                (jobDesignation && jobDesignation.includes(searchDesignation));
            
            const matchesCompanies = !companies || 
                (jobCompany && (jobCompany.includes(searchCompanies) || 
                searchCompanies.split(',').some(c => jobCompany.includes(c.trim())));
            
            const matchesLocation = !location || 
                (jobLocation && (jobLocation.includes(searchLocation) || 
                searchLocation.split(',').some(l => jobLocation.includes(l.trim())));
            
            return matchesSkills && matchesDesignation && matchesCompanies && matchesLocation;
        });
        
        // Return filtered results
        return new Response(JSON.stringify(filteredJobs), {
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
            }
        });
    } catch (error) {
        // Return error response
        return new Response(JSON.stringify({ 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}