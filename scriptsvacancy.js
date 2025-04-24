document.addEventListener('DOMContentLoaded', function() {
    // Save vacancy form data
    const vacancyForm = document.getElementById('vacancy-form');
    if (vacancyForm) {
        vacancyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(this);
            const vacancyData = {};
            
            for (let [key, value] of formData.entries()) {
                vacancyData[key] = value;
            }
            
            // Save to XML
            saveVacancyToXML(vacancyData);
            
            // Show success message
            alert('Вакансия успешно сохранена!');
            
            // Redirect to jobs page
            window.location.href = 'jobs.html';
        });
    }
    
    // Preview vacancy
    const previewBtn = document.getElementById('preview-vacancy');
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            alert('Функция предпросмотра будет реализована в будущем');
        });
    }
    
    // Load vacancies on jobs page
    if (window.location.pathname.includes('jobs.html')) {
        loadVacanciesFromXML();
    }
    
    // Search functionality
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchInput = document.querySelector('.search-input input');
            const industrySelect = document.getElementById('industry');
            const experienceSelect = document.getElementById('experience');
            const salarySelect = document.getElementById('salary');
            
            const searchTerm = searchInput.value.trim();
            const industry = industrySelect.value;
            const experience = experienceSelect.value;
            const salary = salarySelect.value;
            
            filterVacancies(searchTerm, industry, experience, salary);
        });
    }
    
    // Sort functionality
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortVacancies(this.value);
        });
    }
});

function saveVacancyToXML(vacancyData) {
    // Create XML structure
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<vacancy>
    <company>
        <name>${escapeXML(vacancyData['company-name'])}</name>
        <description>${escapeXML(vacancyData['company-description'])}</description>
        <website>${escapeXML(vacancyData['company-website'])}</website>
    </company>
    <position>
        <title>${escapeXML(vacancyData['vacancy-title'])}</title>
        <description>${escapeXML(vacancyData['vacancy-description'])}</description>
        <city>${escapeXML(vacancyData['vacancy-city'])}</city>
        <address>${escapeXML(vacancyData['vacancy-address'])}</address>
    </position>
    <requirements>
        <experience>${escapeXML(vacancyData['experience-required'])}</experience>
        <employment-type>${escapeXML(vacancyData['employment-type'])}</employment-type>
        <salary>
            <from>${escapeXML(vacancyData['salary-from'])}</from>
            <to>${escapeXML(vacancyData['salary-to'])}</to>
            <type>${escapeXML(vacancyData['salary-type'])}</type>
        </salary>
        <skills>${escapeXML(vacancyData['skills-required'])}</skills>
    </requirements>
    <contacts>
        <person>${escapeXML(vacancyData['contact-person'])}</person>
        <email>${escapeXML(vacancyData['contact-email'])}</email>
        <phone>${escapeXML(vacancyData['contact-phone'])}</phone>
    </contacts>
    <meta>
        <posted>${new Date().toISOString()}</posted>
    </meta>
</vacancy>`;
    
    // Save to localStorage (for demo purposes)
    let vacancies = JSON.parse(localStorage.getItem('vacancies') || '[]');
    vacancies.push(xml);
    localStorage.setItem('vacancies', JSON.stringify(vacancies));
    
    // In a real app, you would send this XML to a server
    console.log('Vacancy XML:', xml);
}

function loadVacanciesFromXML() {
    // For demo purposes, we'll use localStorage
    const vacancies = JSON.parse(localStorage.getItem('vacancies') || []);
    
    const jobsContainer = document.getElementById('jobs-container');
    const jobsCount = document.getElementById('jobs-count');
    
    jobsContainer.innerHTML = '';
    jobsCount.textContent = vacancies.length;
    
    if (vacancies.length === 0) {
        jobsContainer.innerHTML = `
            <div class="no-jobs">
                <p>Пока нет доступных вакансий</p>
                <a href="create-vacancy.html" class="btn btn-primary">Разместить вакансию</a>
            </div>
        `;
        return;
    }
    
    vacancies.forEach((xmlString, index) => {
        // Parse XML (simplified for demo)
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        
        const company = xmlDoc.querySelector('company name').textContent;
        const title = xmlDoc.querySelector('position title').textContent;
        const description = xmlDoc.querySelector('position description').textContent;
        const city = xmlDoc.querySelector('position city').textContent;
        const experience = xmlDoc.querySelector('requirements experience').textContent;
        const salaryFrom = xmlDoc.querySelector('salary from').textContent;
        const salaryTo = xmlDoc.querySelector('salary to').textContent;
        const skills = xmlDoc.querySelector('requirements skills').textContent;
        const postedDate = new Date(xmlDoc.querySelector('meta posted').textContent);
        
        const salary = salaryFrom || salaryTo ? 
            (salaryFrom ? `от ${salaryFrom}` : '') + 
            (salaryTo ? ` до ${salaryTo}` : '') + ' руб.' : 
            'По договоренности';
        
        const jobElement = document.createElement('div');
        jobElement.className = 'job-card';
        jobElement.innerHTML = `
            <div class="job-header">
                <div>
                    <h3 class="job-title">${title}</h3>
                    <p class="job-company">${company}</p>
                </div>
                <div class="job-salary">${salary}</div>
            </div>
            <div class="job-info">
                <div class="job-info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${city}</span>
                </div>
                <div class="job-info-item">
                    <i class="fas fa-briefcase"></i>
                    <span>${getExperienceText(experience)}</span>
                </div>
                <div class="job-info-item">
                    <i class="fas fa-clock"></i>
                    <span>${postedDate.toLocaleDateString('ru-RU')}</span>
                </div>
            </div>
            <div class="job-description">${description}</div>
            <div class="job-skills">
                ${skills.split(',').map(skill => `<span class="skill-tag">${skill.trim()}</span>`).join('')}
            </div>
            <div class="job-actions">
                <button class="btn btn-primary">Откликнуться</button>
                <button class="btn btn-secondary">Сохранить</button>
            </div>
        `;
        
        jobsContainer.appendChild(jobElement);
    });
}

function filterVacancies(searchTerm, industry, experience, salary) {
    // In a real app, this would filter the actual data
    // For demo, we'll just show an alert
    alert(`Поиск: ${searchTerm}\nОтрасль: ${industry}\nОпыт: ${experience}\nЗарплата: ${salary}`);
    
    // Then reload the vacancies with filters applied
    loadVacanciesFromXML();
}

function sortVacancies(sortBy) {
    // In a real app, this would sort the actual data
    // For demo, we'll just show an alert
    alert(`Сортировка по: ${sortBy}`);
    
    // Then reload the vacancies with sorting applied
    loadVacanciesFromXML();
}

function escapeXML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&apos;');
}

function getExperienceText(experience) {
    const experiences = {
        'no': 'Без опыта',
        '1-3': '1-3 года',
        '3-5': '3-5 лет',
        '5+': 'Более 5 лет'
    };
    return experiences[experience] || experience;
}
// Бургер-меню
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.getElementById('mainNav');

if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.innerHTML = nav.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Закрытие меню при клике на ссылку
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Закрытие меню при клике вне его области
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && e.target !== mobileMenuBtn) {
            nav.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}