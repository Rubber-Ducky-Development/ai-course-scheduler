document.addEventListener('DOMContentLoaded', function() {
    // Step navigation
    const steps = document.querySelectorAll('.step');
    const stepContents = document.querySelectorAll('.step-content');
    const nextToPreferencesBtn = document.getElementById('next-to-preferences');
    const backToCoursesBtn = document.getElementById('back-to-courses');
    const generateBtn = document.getElementById('generate-btn');
    const resultSection = document.getElementById('result-section');
    const scheduleResult = document.getElementById('schedule-result');
    
    // Course and instructor input
    const courseInput = document.getElementById('course-input');
    const instructorInput = document.getElementById('instructor-input');
    const courseTagsContainer = document.getElementById('course-tags-container');
    const instructorTagsContainer = document.getElementById('instructor-tags-container');
    
    // Busyness sliders
    const busynessSliders = document.querySelectorAll('.busyness-slider');
    
    // Initialize tag arrays
    let courseTags = [];
    let instructorTags = [];
    
    // Step navigation functions
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            if (index === stepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        stepContents.forEach((content, index) => {
            if (index === stepIndex) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }
    
    nextToPreferencesBtn.addEventListener('click', function() {
        // Validate courses input
        if (courseTags.length === 0) {
            showNotification('Please enter at least one course', 'error');
            return;
        }
        
        showStep(1); // Show preferences step
    });
    
    backToCoursesBtn.addEventListener('click', function() {
        showStep(0); // Show courses step
    });
    
    // Tag input functionality
    function addTag(text, container, tagsArray) {
        const trimmedText = text.trim();
        
        if (trimmedText === '') return false;
        
        if (tagsArray.includes(trimmedText)) {
            showNotification(`${trimmedText} is already added`, 'error');
            return false;
        }
        
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `
            <span>${trimmedText}</span>
            <span class="tag-close">&times;</span>
        `;
        
        const closeBtn = tag.querySelector('.tag-close');
        closeBtn.addEventListener('click', function() {
            const index = tagsArray.indexOf(trimmedText);
            if (index > -1) {
                tagsArray.splice(index, 1);
                tag.remove();
            }
        });
        
        container.appendChild(tag);
        tagsArray.push(trimmedText);
        
        return true;
    }
    
    function handleTagInput(e, input, container, tagsArray) {
        const key = e.key;
        
        if (key === ',' || key === 'Enter') {
            e.preventDefault();
            
            const text = input.value.replace(/,/g, '').trim();
            const added = addTag(text, container, tagsArray);
            
            if (added) {
                input.value = '';
            }
        }
    }
    
    // Add event listeners for tag inputs
    courseInput.addEventListener('keydown', function(e) {
        handleTagInput(e, courseInput, courseTagsContainer, courseTags);
    });
    
    instructorInput.addEventListener('keydown', function(e) {
        handleTagInput(e, instructorInput, instructorTagsContainer, instructorTags);
    });
    
    // Handle busyness sliders
    const busynessValues = ['Very Light', 'Light', 'Medium', 'Heavy', 'Very Heavy'];
    
    busynessSliders.forEach(slider => {
        const valueDisplay = document.getElementById(`${slider.id}-value`);
        
        // Set initial value
        valueDisplay.textContent = busynessValues[slider.value - 1];
        
        // Update value on change
        slider.addEventListener('input', function() {
            valueDisplay.textContent = busynessValues[this.value - 1];
        });
    });
    
    // Generate schedule
    generateBtn.addEventListener('click', function() {
        // Validate input
        if (courseTags.length === 0) {
            showNotification('Please enter at least one course', 'error');
            return;
        }
          // Collect data
        const generalTimePreferences = {
            morning: document.getElementById('morning-preference').checked,
            afternoon: document.getElementById('afternoon-preference').checked,
            evening: document.getElementById('evening-preference').checked
        };
        
        const dayBusyness = {
            monday: parseInt(document.getElementById('monday-busyness').value),
            tuesday: parseInt(document.getElementById('tuesday-busyness').value),
            wednesday: parseInt(document.getElementById('wednesday-busyness').value),
            thursday: parseInt(document.getElementById('thursday-busyness').value),
            friday: parseInt(document.getElementById('friday-busyness').value)
        };
        
        // Collect day-specific time preferences
        const dayTimePreferences = {
            monday: {
                morning: document.getElementById('monday-morning').checked,
                afternoon: document.getElementById('monday-afternoon').checked,
                evening: document.getElementById('monday-evening').checked
            },
            tuesday: {
                morning: document.getElementById('tuesday-morning').checked,
                afternoon: document.getElementById('tuesday-afternoon').checked,
                evening: document.getElementById('tuesday-evening').checked
            },
            wednesday: {
                morning: document.getElementById('wednesday-morning').checked,
                afternoon: document.getElementById('wednesday-afternoon').checked,
                evening: document.getElementById('wednesday-evening').checked
            },
            thursday: {
                morning: document.getElementById('thursday-morning').checked,
                afternoon: document.getElementById('thursday-afternoon').checked,
                evening: document.getElementById('thursday-evening').checked
            },
            friday: {
                morning: document.getElementById('friday-morning').checked,
                afternoon: document.getElementById('friday-afternoon').checked,
                evening: document.getElementById('friday-evening').checked
            }
        };
        
        const scheduleData = {
            courses: courseTags,
            instructors: instructorTags,
            generalTimePreferences: generalTimePreferences,
            dayTimePreferences: dayTimePreferences,
            dayBusyness: dayBusyness
        };
        
        // Show loading state
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        
        // Send data to backend
        fetch('/generate_schedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(scheduleData)
        })
        .then(response => response.json())
        .then(data => {
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Schedule';
            
            if (data.success) {
                showResults();
                steps[2].classList.add('active'); // Mark the schedule step as active
            } else {
                showNotification('Error generating schedule: ' + data.message, 'error');
            }
        })
        .catch(error => {
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Schedule';
            showNotification('Server error. Please try again later.', 'error');
            console.error('Error:', error);
        });
    });
      // Display results section with animation
    function showResults() {
        resultSection.style.display = 'block';
        setTimeout(() => {
            resultSection.style.opacity = '1';
        }, 10);
        
        // Smooth scroll to results
        resultSection.scrollIntoView({ behavior: 'smooth' });
          // For now, just show placeholder result
        const dayTimeSummary = `
            <div class="day-preferences-summary">
                <h4>Day Specific Preferences:</h4>
                <div class="day-summary">
                    <p><strong>Monday:</strong> 
                        Busyness: ${busynessValues[parseInt(document.getElementById('monday-busyness').value) - 1]}, 
                        Times: ${document.getElementById('monday-morning').checked ? 'Morning ' : ''}
                        ${document.getElementById('monday-afternoon').checked ? 'Afternoon ' : ''}
                        ${document.getElementById('monday-evening').checked ? 'Evening' : ''}
                    </p>
                    
                    <p><strong>Tuesday:</strong> 
                        Busyness: ${busynessValues[parseInt(document.getElementById('tuesday-busyness').value) - 1]}, 
                        Times: ${document.getElementById('tuesday-morning').checked ? 'Morning ' : ''}
                        ${document.getElementById('tuesday-afternoon').checked ? 'Afternoon ' : ''}
                        ${document.getElementById('tuesday-evening').checked ? 'Evening' : ''}
                    </p>
                    
                    <p><strong>Wednesday:</strong> 
                        Busyness: ${busynessValues[parseInt(document.getElementById('wednesday-busyness').value) - 1]}, 
                        Times: ${document.getElementById('wednesday-morning').checked ? 'Morning ' : ''}
                        ${document.getElementById('wednesday-afternoon').checked ? 'Afternoon ' : ''}
                        ${document.getElementById('wednesday-evening').checked ? 'Evening' : ''}
                    </p>
                    
                    <p><strong>Thursday:</strong> 
                        Busyness: ${busynessValues[parseInt(document.getElementById('thursday-busyness').value) - 1]}, 
                        Times: ${document.getElementById('thursday-morning').checked ? 'Morning ' : ''}
                        ${document.getElementById('thursday-afternoon').checked ? 'Afternoon ' : ''}
                        ${document.getElementById('thursday-evening').checked ? 'Evening' : ''}
                    </p>
                    
                    <p><strong>Friday:</strong> 
                        Busyness: ${busynessValues[parseInt(document.getElementById('friday-busyness').value) - 1]}, 
                        Times: ${document.getElementById('friday-morning').checked ? 'Morning ' : ''}
                        ${document.getElementById('friday-afternoon').checked ? 'Afternoon ' : ''}
                        ${document.getElementById('friday-evening').checked ? 'Evening' : ''}
                    </p>
                </div>
            </div>
        `;
        
        scheduleResult.innerHTML = `
            <p>Your schedule has been successfully generated! The backend would generate the actual schedule data.</p>
            <p>You've requested the following courses:</p>
            <ul class="course-summary">
                ${courseTags.map(course => `<li>${course}</li>`).join('')}
            </ul>
            ${instructorTags.length > 0 ? `
                <p>With preferred instructors:</p>
                <ul class="instructor-summary">
                    ${instructorTags.map(instructor => `<li>${instructor}</li>`).join('')}
                </ul>
            ` : ''}
            <p>General time preferences: 
               ${document.getElementById('morning-preference').checked ? 'Morning, ' : ''}
               ${document.getElementById('afternoon-preference').checked ? 'Afternoon, ' : ''}
               ${document.getElementById('evening-preference').checked ? 'Evening' : ''}
            </p>
            
            ${dayTimeSummary}
            
            <p class="schedule-placeholder">Your schedule would appear here...</p>
        `;
    }
    
    // Show notification
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `<p>${message}</p>`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Add these styles for notifications
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: rgba(39, 174, 96, 0.9);
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            transform: translateX(110%);
            transition: transform 0.3s ease;
            z-index: 1000;
            max-width: 300px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.error {
            background-color: rgba(231, 76, 60, 0.9);
        }
        
        .error {
            border-color: #e74c3c !important;
            animation: shake 0.5s;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .course-summary li, .instructor-summary li {
            margin-bottom: 5px;
        }
    `;
    document.head.appendChild(style);
});
