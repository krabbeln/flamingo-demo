// Black Flamingo - Multi-Step Form Wizard

(function() {
    'use strict';

    // ========================================
    // STATE MANAGEMENT
    // ========================================

    const state = {
        currentStep: 1,
        totalSteps: 4,
        formData: {
            photos: [],
            itemName: '',
            category: '',
            condition: '',
            priceDaily: '',
            priceWeekly: '',
            priceMonthly: '',
            minRental: '1',
            deposit: '',
            description: '',
            location: ''
        }
    };

    // ========================================
    // DOM ELEMENTS
    // ========================================

    const elements = {};

    function cacheElements() {
        elements.form = document.getElementById('addItemForm');
        elements.steps = document.querySelectorAll('.wizard-step');
        elements.progressSteps = document.querySelectorAll('.progress-step');
        elements.progressLines = document.querySelectorAll('.progress-line');
        elements.submitBtn = document.getElementById('submitBtn');
        elements.uploadZone = document.getElementById('uploadZone');
        elements.uploadInput = document.getElementById('photos');
        elements.imageGrid = document.getElementById('imagePreviewGrid');
        elements.categoryGrid = document.getElementById('categoryGrid');
        elements.conditionBtns = document.querySelectorAll('.condition-btn');
        elements.priceDaily = document.getElementById('priceDaily');
        elements.charCount = document.getElementById('charCount');
        elements.description = document.getElementById('description');
        elements.successOverlay = document.getElementById('successOverlay');
        // Preview elements
        elements.previewImage = document.getElementById('previewImage');
        elements.previewName = document.getElementById('previewName');
        elements.previewPrice = document.getElementById('previewPrice');
        elements.previewCategory = document.getElementById('previewCategory');
        elements.previewCondition = document.getElementById('previewCondition');
        elements.editListingBtn = document.getElementById('editListingBtn');
    }

    // ========================================
    // WIZARD NAVIGATION
    // ========================================

    function goToStep(stepNumber, skipValidation = true) {
        if (stepNumber < 1 || stepNumber > state.totalSteps) return;

        // Only validate if skipValidation is false (for form submission)
        if (!skipValidation && stepNumber > state.currentStep && !validateStep(state.currentStep)) {
            return;
        }

        // Update step visibility
        elements.steps.forEach((step, index) => {
            step.classList.remove('active');
            if (index + 1 === stepNumber) {
                step.classList.add('active');
            }
        });

        // Update progress indicator
        updateProgressIndicator(stepNumber);

        // Update submit button visibility
        updateSubmitButtonVisibility(stepNumber);

        // Update preview on last step
        if (stepNumber === state.totalSteps) {
            updateListingPreview();
        }

        state.currentStep = stepNumber;

        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function updateProgressIndicator(stepNumber) {
        elements.progressSteps.forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('active', 'completed');

            if (stepNum === stepNumber) {
                step.classList.add('active');
            } else if (stepNum < stepNumber) {
                step.classList.add('completed');
            }
        });

        elements.progressLines.forEach((line, index) => {
            if (index + 1 < stepNumber) {
                line.classList.add('completed');
            } else {
                line.classList.remove('completed');
            }
        });
    }

    function updateSubmitButtonVisibility(stepNumber) {
        // Show submit button only on step 4
        if (stepNumber === state.totalSteps) {
            elements.submitBtn.style.display = 'block';
        } else {
            elements.submitBtn.style.display = 'none';
        }
    }

    function initStepNavigation() {
        elements.progressSteps.forEach((step, index) => {
            const stepNumber = index + 1;

            step.addEventListener('click', () => {
                // Allow navigation to any step without validation
                goToStep(stepNumber);
            });
        });
    }

    // ========================================
    // FORM VALIDATION
    // ========================================

    function validateStep(stepNumber) {
        let isValid = true;

        switch (stepNumber) {
            case 1:
                // Photos - optional but recommended
                if (state.formData.photos.length === 0) {
                    elements.uploadZone.classList.add('has-error');
                    setTimeout(() => elements.uploadZone.classList.remove('has-error'), 2000);
                    // Allow proceeding without photos
                }
                isValid = true;
                break;

            case 2:
                // Item name
                const itemName = document.getElementById('itemName').value.trim();
                if (itemName.length < 3) {
                    showFieldError('itemName', 'Item name must be at least 3 characters');
                    isValid = false;
                } else {
                    clearFieldError('itemName');
                    state.formData.itemName = itemName;
                }

                // Category
                if (!state.formData.category) {
                    highlightCategoryError();
                    isValid = false;
                }

                // Condition
                if (!state.formData.condition) {
                    highlightConditionError();
                    isValid = false;
                }
                break;

            case 3:
                // Daily price
                const priceDaily = parseFloat(document.getElementById('priceDaily').value);
                if (!priceDaily || priceDaily < 1) {
                    showFieldError('priceDaily', 'Please enter a valid daily price');
                    isValid = false;
                } else {
                    clearFieldError('priceDaily');
                    state.formData.priceDaily = priceDaily;
                }

                // Sync optional fields
                state.formData.priceWeekly = document.getElementById('priceWeekly').value;
                state.formData.priceMonthly = document.getElementById('priceMonthly').value;
                state.formData.minRental = document.getElementById('minRental').value;
                state.formData.deposit = document.getElementById('deposit').value;
                break;

            case 4:
                // Description
                const description = document.getElementById('description').value.trim();
                if (description.length < 10) {
                    showFieldError('description', 'Description must be at least 10 characters');
                    isValid = false;
                } else {
                    clearFieldError('description');
                    state.formData.description = description;
                }

                // Location is optional
                state.formData.location = document.getElementById('location').value.trim();
                break;
        }

        return isValid;
    }

    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');

        formGroup.classList.add('error');
        formGroup.classList.remove('success');

        let errorEl = formGroup.querySelector('.error-message');
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            formGroup.appendChild(errorEl);
        }
        errorEl.textContent = message;

        // Focus the field
        field.focus();
    }

    function clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');

        formGroup.classList.remove('error');

        const errorEl = formGroup.querySelector('.error-message');
        if (errorEl) {
            errorEl.remove();
        }
    }

    function highlightCategoryError() {
        elements.categoryGrid.style.outline = '3px solid #FF4444';
        elements.categoryGrid.style.outlineOffset = '4px';
        setTimeout(() => {
            elements.categoryGrid.style.outline = 'none';
        }, 2000);
    }

    function highlightConditionError() {
        const conditionOptions = document.querySelector('.condition-options');
        conditionOptions.style.outline = '3px solid #FF4444';
        conditionOptions.style.outlineOffset = '4px';
        setTimeout(() => {
            conditionOptions.style.outline = 'none';
        }, 2000);
    }

    // ========================================
    // IMAGE UPLOAD & DRAG-DROP
    // ========================================

    function initImageUpload() {
        if (!elements.uploadZone) return;

        // Prevent defaults for drag events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            elements.uploadZone.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        // Highlight on drag
        ['dragenter', 'dragover'].forEach(eventName => {
            elements.uploadZone.addEventListener(eventName, () => {
                elements.uploadZone.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            elements.uploadZone.addEventListener(eventName, () => {
                elements.uploadZone.classList.remove('drag-over');
            });
        });

        // Handle drop
        elements.uploadZone.addEventListener('drop', handleDrop);

        // Handle file input change
        elements.uploadInput.addEventListener('change', handleFileSelect);
    }

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleDrop(e) {
        const files = e.dataTransfer.files;
        handleFiles(files);
    }

    function handleFileSelect(e) {
        const files = e.target.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        const maxFiles = 8;
        const currentCount = state.formData.photos.length;
        const remaining = maxFiles - currentCount;

        if (remaining <= 0) {
            alert('Maximum 8 images allowed');
            return;
        }

        [...files].slice(0, remaining).forEach(file => {
            if (file.type.startsWith('image/')) {
                processImage(file);
            }
        });
    }

    function processImage(file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const imageData = {
                id: Date.now() + Math.random(),
                file: file,
                dataUrl: e.target.result,
                isPrimary: state.formData.photos.length === 0
            };

            state.formData.photos.push(imageData);
            renderImagePreviews();
        };

        reader.readAsDataURL(file);
    }

    function renderImagePreviews() {
        if (!elements.imageGrid) return;

        elements.imageGrid.innerHTML = '';

        state.formData.photos.forEach((photo, index) => {
            const item = document.createElement('div');
            item.className = 'image-preview-item' + (photo.isPrimary ? ' primary' : '');
            item.dataset.index = index;

            item.innerHTML = `
                <img src="${photo.dataUrl}" alt="Preview ${index + 1}">
                <button type="button" class="image-delete-btn" data-index="${index}">×</button>
            `;

            // Click to set as primary
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('image-delete-btn')) {
                    setPrimaryImage(index);
                }
            });

            // Delete button
            item.querySelector('.image-delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteImage(index);
            });

            elements.imageGrid.appendChild(item);
        });

        // Clear upload zone error state if photos exist
        if (state.formData.photos.length > 0) {
            elements.uploadZone.classList.remove('has-error');
        }
    }

    function setPrimaryImage(index) {
        state.formData.photos.forEach((photo, i) => {
            photo.isPrimary = i === index;
        });
        renderImagePreviews();
    }

    function deleteImage(index) {
        const wasPrimary = state.formData.photos[index].isPrimary;
        state.formData.photos.splice(index, 1);

        // If deleted image was primary, make first image primary
        if (wasPrimary && state.formData.photos.length > 0) {
            state.formData.photos[0].isPrimary = true;
        }

        renderImagePreviews();
    }

    // ========================================
    // CATEGORY SELECTION
    // ========================================

    function initCategorySelection() {
        if (!elements.categoryGrid) return;

        const options = elements.categoryGrid.querySelectorAll('.category-option');

        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                state.formData.category = option.dataset.value;
                document.getElementById('category').value = option.dataset.value;

                // Clear error highlight
                elements.categoryGrid.style.outline = 'none';
            });
        });
    }

    // ========================================
    // CONDITION SELECTION
    // ========================================

    function initConditionSelection() {
        elements.conditionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                elements.conditionBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                state.formData.condition = btn.dataset.value;
                document.getElementById('condition').value = btn.dataset.value;

                // Clear error highlight
                const conditionOptions = document.querySelector('.condition-options');
                conditionOptions.style.outline = 'none';
            });
        });
    }

    // ========================================
    // PRICING SUGGESTIONS
    // ========================================

    function initPricingSuggestions() {
        if (!elements.priceDaily) return;

        elements.priceDaily.addEventListener('input', (e) => {
            const daily = parseFloat(e.target.value) || 0;
            state.formData.priceDaily = daily;

            // Suggest weekly (15% discount)
            const suggestedWeekly = Math.round(daily * 7 * 0.85);
            const weeklyHint = document.getElementById('suggestedWeekly');
            if (weeklyHint && daily > 0) {
                weeklyHint.textContent = `Suggested: €${suggestedWeekly} (15% off)`;
            } else if (weeklyHint) {
                weeklyHint.textContent = '';
            }

            // Suggest monthly (25% discount)
            const suggestedMonthly = Math.round(daily * 30 * 0.75);
            const monthlyHint = document.getElementById('suggestedMonthly');
            if (monthlyHint && daily > 0) {
                monthlyHint.textContent = `Suggested: €${suggestedMonthly} (25% off)`;
            } else if (monthlyHint) {
                monthlyHint.textContent = '';
            }
        });
    }

    // ========================================
    // ITEM NAME SYNC
    // ========================================

    function initItemNameSync() {
        const itemNameInput = document.getElementById('itemName');
        if (!itemNameInput) return;

        itemNameInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            state.formData.itemName = value;
            if (elements.previewName) {
                elements.previewName.textContent = value || 'Your Item Name';
            }
        });
    }

    // ========================================
    // CHARACTER COUNT
    // ========================================

    function initCharacterCount() {
        if (!elements.description || !elements.charCount) return;

        elements.description.addEventListener('input', (e) => {
            const count = e.target.value.length;
            elements.charCount.textContent = count;
            state.formData.description = e.target.value;

            // Visual feedback for length
            const charCountParent = elements.charCount.parentElement;
            if (count > 500) {
                charCountParent.classList.add('warning');
            } else {
                charCountParent.classList.remove('warning');
            }
        });
    }

    // ========================================
    // LISTING PREVIEW
    // ========================================

    function updateListingPreview() {
        // Update preview image
        const primaryPhoto = state.formData.photos.find(p => p.isPrimary) || state.formData.photos[0];
        if (primaryPhoto && elements.previewImage) {
            elements.previewImage.innerHTML = `<img src="${primaryPhoto.dataUrl}" alt="Preview">`;
        } else if (elements.previewImage) {
            elements.previewImage.innerHTML = '<span class="preview-placeholder">No image</span>';
        }

        // Update preview text
        if (elements.previewName) {
            elements.previewName.textContent = state.formData.itemName || 'Your Item Name';
        }

        if (elements.previewPrice) {
            elements.previewPrice.textContent = state.formData.priceDaily
                ? `€${state.formData.priceDaily}/day`
                : '€0/day';
        }

        if (elements.previewCategory) {
            elements.previewCategory.textContent = state.formData.category
                ? state.formData.category.toUpperCase()
                : 'Category';
        }

        if (elements.previewCondition) {
            elements.previewCondition.textContent = state.formData.condition
                ? `Condition: ${state.formData.condition.charAt(0).toUpperCase() + state.formData.condition.slice(1)}`
                : '';
        }
    }

    // ========================================
    // EDIT BUTTON (from preview)
    // ========================================

    function initEditButton() {
        if (elements.editListingBtn) {
            elements.editListingBtn.addEventListener('click', () => {
                goToStep(1);
            });
        }
    }

    // ========================================
    // FORM SUBMISSION
    // ========================================

    function handleSubmit(e) {
        e.preventDefault();

        // Validate ALL steps before submission
        for (let i = 1; i <= state.totalSteps; i++) {
            if (!validateStep(i)) {
                // Navigate to first invalid step
                goToStep(i);
                return;
            }
        }

        // Collect all form data
        const submitData = {
            ...state.formData,
            photos: state.formData.photos.map(p => p.file)
        };

        console.log('Submitting listing:', submitData);

        // Show success modal
        showSuccessModal();
    }

    function showSuccessModal() {
        if (elements.successOverlay) {
            elements.successOverlay.style.display = 'flex';
        }
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    function init() {
        cacheElements();

        if (!elements.form) return;

        // Initialize all modules
        initImageUpload();
        initCategorySelection();
        initConditionSelection();
        initPricingSuggestions();
        initCharacterCount();
        initItemNameSync();
        initEditButton();
        initStepNavigation();

        // Form submission
        elements.form.addEventListener('submit', handleSubmit);

        // Initialize first step
        updateSubmitButtonVisibility(1);

        console.log('Black Flamingo form wizard initialized');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
