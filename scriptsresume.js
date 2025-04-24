document.addEventListener('DOMContentLoaded', function() {
    // Add experience field
    const addExperienceBtn = document.getElementById('add-experience');
    const experienceContainer = document.getElementById('experience-container');
    
    if (addExperienceBtn && experienceContainer) {
        addExperienceBtn.addEventListener('click', function() {
            const experienceItem = document.createElement('div');
            experienceItem.className = 'experience-item';
            experienceItem.innerHTML = `
                <div class="form-row">
                    <div class="form-group">
                        <label>Компания*</label>
                        <input type="text" name="company[]" required>
                    </div>
                    <div class="form-group">
                        <label>Должность*</label>
                        <input type="text" name="job-title[]" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Период работы (с)*</label>
                        <input type="date" name="start-date[]" required>
                    </div>
                    <div class="form-group">
                        <label>Период работы (по)</label>
                        <input type="date" name="end-date[]">
                    </div>
                </div>
                <div class="form-group">
                    <label>Обязанности и достижения</label>
                    <textarea name="responsibilities[]" rows="3"></textarea>
                </div>
                <button type="button" class="btn btn-remove remove-experience">Удалить</button>
            `;
            
            experienceContainer.appendChild(experienceItem);
            
            // Add event listener to the new remove button
            const removeBtn = experienceItem.querySelector('.remove-experience');
            removeBtn.addEventListener('click', function() {
                experienceContainer.removeChild(experienceItem);
            });
        });
    }
    
    // Add education field
    const addEducationBtn = document.getElementById('add-education');
    const educationContainer = document.getElementById('education-container');
    
    if (addEducationBtn && educationContainer) {
        addEducationBtn.addEventListener('click', function() {
            const educationItem = document.createElement('div');
            educationItem.className = 'education-item';
            educationItem.innerHTML = `
                <div class="form-row">
                    <div class="form-group">
                        <label>Учебное заведение*</label>
                        <input type="text" name="institution[]" required>
                    </div>
                    <div class="form-group">
                        <label>Специальность*</label>
                        <input type="text" name="specialty[]" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Год окончания*</label>
                        <input type="number" name="graduation-year[]" required>
                    </div>
                    <div class="form-group">
                        <label>Степень</label>
                        <input type="text" name="degree[]">
                    </div>
                </div>
                <button type="button" class="btn btn-remove remove-education">Удалить</button>
            `;
            
            educationContainer.appendChild(educationItem);
            
            // Add event listener to the new remove button
            const removeBtn = educationItem.querySelector('.remove-education');
            removeBtn.addEventListener('click', function() {
                educationContainer.removeChild(educationItem);
            });
        });
    }
    
    // Save resume form data
    const resumeForm = document.getElementById('resume-form');
    if (resumeForm) {
        resumeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(this);
            const resumeData = {};
            
            for (let [key, value] of formData.entries()) {
                if (key.endsWith('[]')) {
                    const fieldName = key.replace('[]', '');
                    if (!resumeData[fieldName]) {
                        resumeData[fieldName] = [];
                    }
                    resumeData[fieldName].push(value);
                } else {
                    resumeData[key] = value;
                }
            }
            
            // Save to XML
            saveResumeToXML(resumeData);
            
            // Show success message
            alert('Резюме успешно сохранено!');
            
            // Redirect to profile page
            window.location.href = 'profile.html';
        });
    }
    
    // Preview resume
    const previewBtn = document.getElementById('preview-resume');
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            alert('Функция предпросмотра будет реализована в будущем');
        });
    }
    
    // Load resume data on profile page
    if (window.location.pathname.includes('profile.html')) {
        loadResumeFromXML();
    }
    
    // Print resume
    const printBtn = document.getElementById('print-resume');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }
});

function saveResumeToXML(resumeData) {
    // Create XML structure
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<resume>
    <basic>
        <fullname>${escapeXML(resumeData.fullname)}</fullname>
        <birthdate>${escapeXML(resumeData.birthdate)}</birthdate>
        <gender>${escapeXML(resumeData.gender)}</gender>
        <phone>${escapeXML(resumeData.phone)}</phone>
        <email>${escapeXML(resumeData.email)}</email>
        <city>${escapeXML(resumeData.city)}</city>
    </basic>
    <position>
        <desired-position>${escapeXML(resumeData.position)}</desired-position>
        <desired-salary>${escapeXML(resumeData.salary)}</desired-salary>
        <employment-type>${escapeXML(resumeData['employment-type'])}</employment-type>
    </position>
    <experience>`;
    
    // Add experience items
    if (resumeData.company && resumeData.company.length > 0) {
        for (let i = 0; i < resumeData.company.length; i++) {
            xml += `
        <item>
            <company>${escapeXML(resumeData.company[i])}</company>
            <job-title>${escapeXML(resumeData['job-title'][i])}</job-title>
            <start-date>${escapeXML(resumeData['start-date'][i])}</start-date>
            <end-date>${escapeXML(resumeData['end-date'][i])}</end-date>
            <responsibilities>${escapeXML(resumeData.responsibilities[i])}</responsibilities>
        </item>`;
        }
    }
    
    xml += `
    </experience>
    <education>`;
    
    // Add education items
    if (resumeData.institution && resumeData.institution.length > 0) {
        for (let i = 0; i < resumeData.institution.length; i++) {
            xml += `
        <item>
            <institution>${escapeXML(resumeData.institution[i])}</institution>
            <specialty>${escapeXML(resumeData.specialty[i])}</specialty>
            <graduation-year>${escapeXML(resumeData['graduation-year'][i])}</graduation-year>
            <degree>${escapeXML(resumeData.degree[i])}</degree>
        </item>`;
        }
    }
    
    xml += `
    </education>
    <skills>
        <skill-list>${escapeXML(resumeData.skills)}</skill-list>
    </skills>
    <additional>
        <about>${escapeXML(resumeData.about)}</about>
        <languages>${escapeXML(resumeData.languages)}</languages>
    </additional>
</resume>`;
    
    // Save to localStorage (for demo purposes)
    localStorage.setItem('resumeData', xml);
    
    // In a real app, you would send this XML to a server
    console.log('Resume XML:', xml);
}

function loadResumeFromXML() {
    // For demo purposes, we'll use localStorage
    const xmlString = localStorage.getItem('resumeData');
    if (!xmlString) return;
    
    // Parse XML (simplified for demo)
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    // Basic info
    document.getElementById('profile-name').textContent = xmlDoc.querySelector('basic fullname').textContent;
    document.getElementById('resume-fullname').textContent = xmlDoc.querySelector('basic fullname').textContent;
    document.getElementById('resume-birthdate').textContent = formatDate(xmlDoc.querySelector('basic birthdate').textContent);
    document.getElementById('resume-phone').textContent = xmlDoc.querySelector('basic phone').textContent;
    document.getElementById('resume-email').textContent = xmlDoc.querySelector('basic email').textContent;
    document.getElementById('resume-city').textContent = xmlDoc.querySelector('basic city').textContent;
    
    // Position
    document.getElementById('profile-position').textContent = xmlDoc.querySelector('position desired-position').textContent;
    document.getElementById('resume-position').textContent = xmlDoc.querySelector('position desired-position').textContent;
    document.getElementById('resume-salary').textContent = xmlDoc.querySelector('position desired-salary').textContent ? 
        xmlDoc.querySelector('position desired-salary').textContent + ' руб.' : 'Не указана';
    document.getElementById('resume-employment').textContent = getEmploymentType(xmlDoc.querySelector('position employment-type').textContent);
    
    // Experience
    const experienceContainer = document.getElementById('resume-experience');
    experienceContainer.innerHTML = '';
    
    const experienceItems = xmlDoc.querySelectorAll('experience item');
    experienceItems.forEach(item => {
        const experienceElement = document.createElement('div');
        experienceElement.className = 'experience-item';
        
        const company = item.querySelector('company').textContent;
        const jobTitle = item.querySelector('job-title').textContent;
        const startDate = formatDate(item.querySelector('start-date').textContent);
        const endDate = item.querySelector('end-date').textContent ? formatDate(item.querySelector('end-date').textContent) : 'настоящее время';
        const responsibilities = item.querySelector('responsibilities').textContent;
        
        experienceElement.innerHTML = `
            <h4>${company}</h4>
            <p class="experience-period">${startDate} — ${endDate}</p>
            <p class="experience-position">${jobTitle}</p>
            <p class="experience-description">${responsibilities}</p>
        `;
        
        experienceContainer.appendChild(experienceElement);
    });
    
    // Education
    const educationContainer = document.getElementById('resume-education');
    educationContainer.innerHTML = '';
    
    const educationItems = xmlDoc.querySelectorAll('education item');
    educationItems.forEach(item => {
        const educationElement = document.createElement('div');
        educationElement.className = 'education-item';
        
        const institution = item.querySelector('institution').textContent;
        const specialty = item.querySelector('specialty').textContent;
        const graduationYear = item.querySelector('graduation-year').textContent;
        const degree = item.querySelector('degree').textContent;
        
        educationElement.innerHTML = `
            <h4>${institution}</h4>
            <p class="education-period">${graduationYear}</p>
            <p class="education-specialty">${specialty}${degree ? ', ' + degree : ''}</p>
        `;
        
        educationContainer.appendChild(educationElement);
    });
    
    // Skills
    const skillsContainer = document.getElementById('resume-skills');
    skillsContainer.innerHTML = '';
    
    const skills = xmlDoc.querySelector('skills skill-list').textContent.split(',').map(skill => skill.trim());
    skills.forEach(skill => {
        if (skill) {
            const skillElement = document.createElement('span');
            skillElement.className = 'skill-tag';
            skillElement.textContent = skill;
            skillsContainer.appendChild(skillElement);
        }
    });
    
    // Additional info
    document.getElementById('resume-about').textContent = xmlDoc.querySelector('additional about').textContent || 'Не указано';
    document.getElementById('resume-languages').textContent = xmlDoc.querySelector('additional languages').textContent || 'Не указано';
}

function escapeXML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&apos;');
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU');
}

function getEmploymentType(type) {
    const types = {
        'full': 'Полная занятость',
        'part': 'Частичная занятость',
        'remote': 'Удаленная работа',
        'project': 'Проектная работа'
    };
    return types[type] || type;
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