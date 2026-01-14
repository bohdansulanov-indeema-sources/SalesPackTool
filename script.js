const surveyData = [
    {
        "id": "problem_clarity",
        "question": "How clear is the problem you want to solve?",
        "options": [
            { "label": "Very clear and fully defined", "score": 1 },
            { "label": "Partially defined", "score": 2 },
            { "label": "Not clearly defined yet", "score": 3 }
        ]
    },
    {
        "id": "requirements_ready",
        "question": "Do you already have documented requirements or flows?",
        "options": [
            { "label": "Yes, detailed", "score": 1 },
            { "label": "Partially", "score": 2 },
            { "label": "No", "score": 3 }
        ]
    },
    {
        "id": "user_roles",
        "question": "How many user roles are involved?",
        "options": [
            { "label": "One role", "score": 1 },
            { "label": "Two to three roles", "score": 2 },
            { "label": "More than three roles", "score": 3 }
        ]
    },
    {
        "id": "user_flows",
        "question": "How many core user flows are expected?",
        "options": [
            { "label": "One main flow", "score": 1 },
            { "label": "Two to three flows", "score": 2 },
            { "label": "Multiple or end-to-end journey", "score": 3 }
        ]
    },
    {
        "id": "solution_confidence",
        "question": "How confident are you that the first solution will be correct?",
        "options": [
            { "label": "Very confident", "score": 1 },
            { "label": "Some uncertainty", "score": 2 },
            { "label": "High uncertainty", "score": 3 }
        ]
    },
    {
        "id": "risk_level",
        "question": "What happens if the design decision is wrong?",
        "options": [
            { "label": "Minor inconvenience", "score": 1 },
            { "label": "Rework required", "score": 2 },
            { "label": "Business or product risk", "score": 3 }
        ]
    },
    {
        "id": "design_system_usage",
        "question": "How will the design system be used?",
        "options": [
            { "label": "Use existing system as-is", "score": 1 },
            { "label": "Extend or adapt it", "score": 2 },
            { "label": "Create or significantly evolve it", "score": 3 }
        ]
    },
    {
        "id": "ui_complexity",
        "question": "What level of UI complexity is expected?",
        "options": [
            { "label": "Standard UI", "score": 1 },
            { "label": "Custom UI in some areas", "score": 2 },
            { "label": "Advanced or exploratory UI", "score": 3 }
        ]
    },
    {
        "id": "research_needed",
        "question": "Is user research or validation required?",
        "options": [
            { "label": "No", "score": 1 },
            { "label": "Light validation", "score": 2 },
            { "label": "Research and testing required", "score": 3 }
        ]
    },
    {
        "id": "open_questions",
        "question": "Are there open UX or product questions?",
        "options": [
            { "label": "No open questions", "score": 1 },
            { "label": "Some open questions", "score": 2 },
            { "label": "Many or core unresolved questions", "score": 3 }
        ]
    },
    {
        "id": "business_impact",
        "question": "How critical is design to business or sales?",
        "options": [
            { "label": "Low impact", "score": 1 },
            { "label": "Medium impact", "score": 2 },
            { "label": "High or critical impact", "score": 3 }
        ]
    },
    {
        "id": "design_lifespan",
        "question": "How long should the design solution live?",
        "options": [
            { "label": "Short-term", "score": 1 },
            { "label": "Mid-term", "score": 2 },
            { "label": "Long-term and scalable", "score": 3 }
        ]
    }
];

let currentStep = 0;
const answers = {};
// Store answers as: { questionId: score }

// DOM Elements
const progressBar = document.getElementById('progressBar');
const stepIndicator = document.getElementById('stepIndicator');
const questionContainer = document.getElementById('questionContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const surveyForm = document.getElementById('surveyForm');

function init() {
    renderQuestion(currentStep);
    updateProgress();
}

function updateProgress() {
    const progress = ((currentStep) / surveyData.length) * 100;
    progressBar.style.width = `${progress}%`;
    stepIndicator.textContent = `Question ${currentStep + 1} of ${surveyData.length}`;

    prevBtn.disabled = currentStep === 0;
    const nextSpan = nextBtn.querySelector('span');
    if (nextSpan) {
        nextSpan.textContent = currentStep === surveyData.length - 1 ? 'Calculate Recommendation' : 'Next';
    } else {
        // Fallback if span is missing
        nextBtn.textContent = currentStep === surveyData.length - 1 ? 'Calculate Recommendation' : 'Next';
    }
}

function renderQuestion(index) {
    // Fade out
    questionContainer.classList.add('fade-exit');
    questionContainer.classList.add('fade-exit-active');

    setTimeout(() => {
        const question = surveyData[index];
        questionContainer.innerHTML = ''; // Clear

        const title = document.createElement('h2');
        title.textContent = question.question;

        // No description in this dataset, but we'll leave logic if we add it separately? 
        // Or if 'question' is just the text. 
        // The dataset doesn't have 'description'. We'll skip creating the 'p' element if missing.

        questionContainer.appendChild(title);

        const group = document.createElement('div');
        group.className = 'options-group';

        question.options.forEach(opt => {
            const item = document.createElement('div');
            item.className = 'option-item';

            const input = document.createElement('input');
            input.type = 'radio'; // Always radio for this set
            input.name = question.id;
            input.value = opt.score; // We store score as value
            input.id = `${question.id}_${opt.score}`;

            // Pre-fill answer
            if (answers[question.id] === opt.score) {
                input.checked = true;
            }

            input.addEventListener('change', () => handleInput(question.id, opt.score));

            const label = document.createElement('label');
            label.className = 'option-label';
            label.htmlFor = `${question.id}_${opt.score}`;
            label.textContent = opt.label;

            item.appendChild(input);
            item.appendChild(label);
            group.appendChild(item);
        });
        questionContainer.appendChild(group);

        // Fade in
        questionContainer.classList.remove('fade-exit', 'fade-exit-active');
        questionContainer.classList.add('fade-enter');
        requestAnimationFrame(() => {
            questionContainer.classList.add('fade-enter-active');
            setTimeout(() => {
                questionContainer.classList.remove('fade-enter', 'fade-enter-active');
            }, 300);
        });

    }, 200); // Wait for fade out
}

function handleInput(questionId, score) {
    answers[questionId] = score; // Store the score directly
}

function validateStep() {
    const question = surveyData[currentStep];
    if (!answers[question.id]) {
        alert('Please select an option to proceed.');
        return false;
    }
    return true;
}

nextBtn.addEventListener('click', () => {
    if (!validateStep()) return;

    if (currentStep < surveyData.length - 1) {
        currentStep++;
        updateProgress();
        renderQuestion(currentStep);
    } else {
        showResults();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        updateProgress();
        renderQuestion(currentStep);
    }
});

function calculatePackage() {
    let totalScore = 0;
    for (const key in answers) {
        totalScore += answers[key];
    }

    let recommendedPackage = '';
    if (totalScore <= 18) {
        recommendedPackage = 'EASY';
    } else if (totalScore <= 26) {
        recommendedPackage = 'MIDDLE';
    } else {
        recommendedPackage = 'MAX';
    }

    return { totalScore, recommendedPackage };
}

function showResults() {
    // Hide navigation
    document.querySelector('.navigation-buttons').style.display = 'none';
    document.querySelector('.survey-header').style.display = 'none';

    const { totalScore, recommendedPackage } = calculatePackage();

    let description = '';
    if (recommendedPackage === 'EASY') description = 'A straightforward, streamlined design engagement for clear scopes.';
    if (recommendedPackage === 'MIDDLE') description = 'A balanced approach for projects with moderate complexity and some unknowns.';
    if (recommendedPackage === 'MAX') description = 'Comprehensive support for complex, critical, or highly uncertain projects.';

    questionContainer.innerHTML = `
        <div class="success-message">
            <div class="success-icon">★</div>
            <h2>Recommendation</h2>
            <p>Based on your project profile (Score: ${totalScore})</p>
            
            <div class="recommendation-card">
                <p>We recommend the</p>
                <div class="package-name">${recommendedPackage}</div>
                <p>${description}</p>
            </div>
            
            <p style="margin-top: 24px; color: #6b7280; font-size: 0.9em;">Minimum: 12 | Maximum: 36</p>
        </div>
    `;
    console.log('Final Score:', totalScore, 'Package:', recommendedPackage, 'Answers:', answers);
}

// Start
init();
