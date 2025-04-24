// This file contains functions for working with XML storage
// In a real application, these would interact with a server or local storage

/**
 * Saves data to XML file
 * @param {string} filename - Name of the XML file
 * @param {string} xmlData - XML data to save
 */
function saveToXMLFile(filename, xmlData) {
    // In a real app, this would save to a file or send to a server
    console.log(`Saving to ${filename}:`, xmlData);
    
    // For demo purposes, we'll use localStorage
    if (filename === 'resumes.xml') {
        localStorage.setItem('resumeData', xmlData);
    } else if (filename === 'vacancies.xml') {
        let vacancies = JSON.parse(localStorage.getItem('vacancies') || '[]');
        vacancies.push(xmlData);
        localStorage.setItem('vacancies', JSON.stringify(vacancies));
    }
}

/**
 * Loads data from XML file
 * @param {string} filename - Name of the XML file to load
 * @returns {string} XML data
 */
function loadFromXMLFile(filename) {
    // In a real app, this would load from a file or request from a server
    console.log(`Loading from ${filename}`);
    
    // For demo purposes, we'll use localStorage
    if (filename === 'resumes.xml') {
        return localStorage.getItem('resumeData') || '';
    } else if (filename === 'vacancies.xml') {
        return JSON.parse(localStorage.getItem('vacancies') || '[]').join('\n');
    }
    
    return '';
}

/**
 * Parses XML string into DOM object
 * @param {string} xmlString - XML string to parse
 * @returns {Document} XML DOM document
 */
function parseXML(xmlString) {
    const parser = new DOMParser();
    return parser.parseFromString(xmlString, "text/xml");
}

/**
 * Converts DOM object to XML string
 * @param {Document} xmlDoc - XML DOM document
 * @returns {string} XML string
 */
function serializeXML(xmlDoc) {
    const serializer = new XMLSerializer();
    return serializer.serializeToString(xmlDoc);
}

/**
 * Escapes special characters for XML
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeXML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&apos;');
}

/**
 * Unescapes special characters from XML
 * @param {string} str - String to unescape
 * @returns {string} Unescaped string
 */
function unescapeXML(str) {
    if (!str) return '';
    return str.replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&apos;/g, "'");
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        saveToXMLFile,
        loadFromXMLFile,
        parseXML,
        serializeXML,
        escapeXML,
        unescapeXML
    };
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