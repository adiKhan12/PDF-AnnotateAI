/**
 * UI Module for handling UI components and event handlers
 */

// UI element references
let penButton, highlighterButton, textButton, eraserButton;
let penColorPicker, highlighterColorPicker, textColorPicker;
let sizeSlider, sizeControlPanel, sizePreviewDot, sizeValue;
let saveButton, zoomInButton, zoomOutButton, fitToWidthButton;
let prevPageButton, nextPageButton, clearAnnotationsButton;
let helpButton, toolbarToggle, toolbar;
let openPdfButton, fileInput;

// Text annotation elements
let textModal, closeModal, textInput, fontSizeSelect, fontFamilySelect, addTextBtn;

// Shortcuts modal elements
let shortcutsModal, closeButtons;

// Quality modal elements
let saveQualityModal, saveWithQualityButton, cancelSaveButton, qualityOptions;

// AI panel elements
let translateButton, summarizeButton, extractButton, aiPanel, closeAiPanel;
let sourceText, targetLanguage, translateTextButton, translatePageButton, translationResult;
let summarizeText, summaryLength, summarizeTextButton, summarizePageButton, summaryResult;
let extractText, extractionQuery, extractInfoButton, extractFromPageButton, extractionResult;

// Model selection elements
let apiKeyInput, modelSearchInput, modelDropdown, modelList, selectedModelInput;

// State variables
let uiTool = 'pen';

// Initialize the UI module
function initUIModule() {
    // Get all UI elements
    getUIElements();
    
    // Add event listeners
    addEventListeners();
    
    // Initialize UI state
    initializeUI();
}

// Get references to all UI elements
function getUIElements() {
    // Toolbar buttons
    penButton = document.getElementById('pen');
    highlighterButton = document.getElementById('highlighter');
    textButton = document.getElementById('text');
    eraserButton = document.getElementById('eraser');
    
    // Color pickers
    penColorPicker = document.getElementById('pen-color');
    highlighterColorPicker = document.getElementById('highlighter-color');
    textColorPicker = document.getElementById('text-color');
    
    // Size controls
    sizeSlider = document.getElementById('size-slider');
    sizeControlPanel = document.getElementById('size-control-panel');
    sizePreviewDot = document.getElementById('size-preview-dot');
    sizeValue = document.getElementById('size-value');
    
    // Action buttons
    saveButton = document.getElementById('save');
    zoomInButton = document.getElementById('zoom-in');
    zoomOutButton = document.getElementById('zoom-out');
    fitToWidthButton = document.getElementById('fit-to-width');
    prevPageButton = document.getElementById('prev-page');
    nextPageButton = document.getElementById('next-page');
    clearAnnotationsButton = document.getElementById('clear-annotations');
    helpButton = document.getElementById('help-button');
    toolbarToggle = document.getElementById('toolbar-toggle');
    toolbar = document.getElementById('toolbar');
    openPdfButton = document.getElementById('open-pdf');
    
    // File input
    fileInput = document.getElementById('file-input');
    
    // Text annotation elements
    textModal = document.getElementById('text-modal');
    closeModal = document.querySelector('.close-modal');
    textInput = document.getElementById('text-input');
    fontSizeSelect = document.getElementById('font-size');
    fontFamilySelect = document.getElementById('font-family');
    addTextBtn = document.getElementById('add-text-btn');
    
    // Shortcuts modal elements
    shortcutsModal = document.getElementById('shortcuts-modal');
    closeButtons = document.querySelectorAll('.close-modal');
    
    // Quality modal elements
    saveQualityModal = document.getElementById('save-quality-modal');
    saveWithQualityButton = document.getElementById('save-with-quality');
    cancelSaveButton = document.getElementById('cancel-save');
    qualityOptions = document.getElementsByName('quality');
    
    // AI panel elements
    translateButton = document.getElementById('translate-button');
    summarizeButton = document.getElementById('summarize-button');
    extractButton = document.getElementById('extract-button');
    aiPanel = document.getElementById('ai-panel');
    closeAiPanel = document.getElementById('close-ai-panel');
    
    // Translation section elements
    sourceText = document.getElementById('source-text');
    targetLanguage = document.getElementById('target-language');
    translateTextButton = document.getElementById('translate-text-button');
    translatePageButton = document.getElementById('translate-page-button');
    translationResult = document.getElementById('translation-result');
    
    // Summarization section elements
    summarizeText = document.getElementById('summarize-text');
    summaryLength = document.getElementById('summary-length');
    summarizeTextButton = document.getElementById('summarize-text-button');
    summarizePageButton = document.getElementById('summarize-page-button');
    summaryResult = document.getElementById('summary-result');
    
    // Information extraction section elements
    extractText = document.getElementById('extract-text');
    extractionQuery = document.getElementById('extraction-query');
    extractInfoButton = document.getElementById('extract-info-button');
    extractFromPageButton = document.getElementById('extract-from-page-button');
    extractionResult = document.getElementById('extraction-result');
    
    // Model selection elements
    apiKeyInput = document.getElementById('api-key');
    modelSearchInput = document.getElementById('model-search');
    modelDropdown = document.getElementById('model-dropdown');
    modelList = document.getElementById('model-list');
    selectedModelInput = document.getElementById('selected-model');
}

// Add event listeners to UI elements
function addEventListeners() {
    // Open PDF button
    if (openPdfButton) {
        openPdfButton.addEventListener('click', () => {
            if (fileInput) fileInput.click();
        });
    }
    
    // File input
    if (fileInput) {
        fileInput.addEventListener('change', handleFileInputChange);
    }
    
    // Zoom buttons
    if (zoomInButton) {
        zoomInButton.addEventListener('click', handleZoomIn);
    }
    
    if (zoomOutButton) {
        zoomOutButton.addEventListener('click', handleZoomOut);
    }
    
    // Page navigation buttons
    if (prevPageButton) {
        prevPageButton.addEventListener('click', handlePrevPage);
    }
    
    if (nextPageButton) {
        nextPageButton.addEventListener('click', handleNextPage);
    }
    
    // Tool buttons
    if (penButton) {
        penButton.addEventListener('click', () => handleToolSelect('pen', penButton));
    }
    
    if (highlighterButton) {
        highlighterButton.addEventListener('click', () => handleToolSelect('highlighter', highlighterButton));
    }
    
    if (textButton) {
        textButton.addEventListener('click', () => handleToolSelect('text', textButton));
    }
    
    if (eraserButton) {
        eraserButton.addEventListener('click', () => handleToolSelect('eraser', eraserButton));
    }
    
    // Color pickers
    if (penColorPicker) {
        penColorPicker.addEventListener('input', handlePenColorChange);
    }
    
    if (highlighterColorPicker) {
        highlighterColorPicker.addEventListener('input', handleHighlighterColorChange);
    }
    
    if (textColorPicker) {
        textColorPicker.addEventListener('input', handleTextColorChange);
    }
    
    // Clear annotations button
    if (clearAnnotationsButton) {
        clearAnnotationsButton.addEventListener('click', handleClearAnnotations);
    }
    
    // Size slider
    if (sizeSlider) {
        sizeSlider.addEventListener('input', handleSizeChange);
    }
    
    // Save button
    if (saveButton) {
        saveButton.addEventListener('click', handleSave);
    }
    
    // Save quality modal buttons
    if (saveWithQualityButton) {
        saveWithQualityButton.addEventListener('click', handleSaveWithQuality);
    }
    
    if (cancelSaveButton) {
        cancelSaveButton.addEventListener('click', handleCancelSave);
    }
    
    // Close buttons for modals
    if (closeButtons) {
        closeButtons.forEach(button => {
            button.addEventListener('click', handleCloseModal);
        });
    }
    
    // Text annotation buttons
    if (addTextBtn) {
        addTextBtn.addEventListener('click', handleAddText);
    }
    
    // Help button
    if (helpButton) {
        helpButton.addEventListener('click', handleHelp);
    }
    
    // Toolbar toggle
    if (toolbarToggle) {
        toolbarToggle.addEventListener('click', handleToolbarToggle);
    }
    
    // Fit to width button
    if (fitToWidthButton) {
        fitToWidthButton.addEventListener('click', handleFitToWidth);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyDown);
    
    // Close modals when clicking outside
    window.addEventListener('click', handleCloseModalOutside);
    
    // Scroll indicator
    const CanvasWrapper = document.getElementById('canvas-wrapper');
    if (CanvasWrapper) {
        CanvasWrapper.addEventListener('scroll', handleCanvasScroll);
    }
    
    // Listen for custom events from PDF module
    window.addEventListener('openTextModal', handleOpenTextModal);
    window.addEventListener('getTextSettings', handleGetTextSettings);
    window.addEventListener('getSelectedDPI', handleGetSelectedDPI);
    window.addEventListener('showLoadingMessage', handleShowLoadingMessage);
    window.addEventListener('hideLoadingMessage', handleHideLoadingMessage);
    window.addEventListener('clearAIPanelFields', handleClearAIPanelFields);
    
    // Model selection event listeners
    if (apiKeyInput) {
        apiKeyInput.addEventListener('input', handleApiKeyChange);
    }
    
    if (modelSearchInput) {
        modelSearchInput.addEventListener('input', handleModelSearch);
        modelSearchInput.addEventListener('focus', handleModelSearchFocus);
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', handleDocumentClick);
}

// Initialize UI state
function initializeUI() {
    // Set initial tool
    setActiveTool(penButton);
    
    // Update zoom level display
    window.dispatchEvent(new CustomEvent('updateZoomLevel'));
    
    // Add shortcut tooltips
    addShortcutTooltips();
    
    // Initialize the size control panel
    if (uiTool === 'pen' || uiTool === 'highlighter' || uiTool === 'eraser') {
        showSizeControlPanel();
    } else {
        hideSizeControlPanel();
    }
    updateSizePreview();
    
    // Initialize toolbar toggle
    initToolbarToggle();
    
    // Initialize AI panel
    initAIPanel();
    
    // Initialize model selection
    initModelSelection();
}

// Handle file input change
async function handleFileInputChange(e) {
    const file = e.target.files[0];
    if (file.type !== 'application/pdf') {
        alert('Please select a PDF file.');
        return;
    }

    // Clear AI panel fields when loading a new PDF
    clearAIPanelFields();

    const noPdfMessage = document.getElementById('no-pdf-message');
    if (noPdfMessage) {
        noPdfMessage.style.display = 'none';
    }
    
    // Show the canvas wrapper immediately to ensure it has dimensions
    const CanvasWrapper = document.getElementById('canvas-wrapper');
    if (CanvasWrapper) {
        CanvasWrapper.style.display = 'block';
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        const typedArray = new Uint8Array(e.target.result);
        try {
            const pdfDoc = await pdfjsLib.getDocument({ data: typedArray }).promise;
            
            // Store PDF document in PDF module
            window.PDFModule.setPdfDoc(pdfDoc);
            window.PDFModule.setTotalPages(pdfDoc.numPages);
            window.PDFModule.setPageNum(1);
            window.PDFModule.updatePageCounter();

            // Store the original dimensions for each page
            const originalPageDimensions = {};
            for (let i = 1; i <= pdfDoc.numPages; i++) {
                const page = await pdfDoc.getPage(i);
                const viewport = page.getViewport({ scale: 1 });
                originalPageDimensions[i] = { width: viewport.width, height: viewport.height };
            }
            window.PDFModule.setOriginalPageDimensions(originalPageDimensions);

            // Render the PDF first with default scale
            await window.PDFModule.renderPDF(pdfDoc);
            
            // Then fit to width after a delay to ensure everything is properly rendered
            setTimeout(() => {
                window.PDFModule.fitToWidth();
            }, 300);
        } catch (error) {
            console.error('Error loading PDF:', error);
            alert('Error loading PDF. Please try another file.');
        }
    };
    reader.readAsArrayBuffer(file);
}

// Handle zoom in
function handleZoomIn() {
    let scale = window.PDFModule.getScale();
    scale += 0.25;
    window.PDFModule.setScale(scale);
    
    const fitToWidthButton = document.getElementById('fit-to-width');
    if (fitToWidthButton) {
        fitToWidthButton.classList.remove('active');
    }
    
    window.PDFModule.updateZoomLevel();
    window.PDFModule.renderPDF(window.PDFModule.getPdfDoc());
}

// Handle zoom out
function handleZoomOut() {
    let scale = window.PDFModule.getScale();
    scale = Math.max(0.5, scale - 0.25);
    window.PDFModule.setScale(scale);
    
    const fitToWidthButton = document.getElementById('fit-to-width');
    if (fitToWidthButton) {
        fitToWidthButton.classList.remove('active');
    }
    
    window.PDFModule.updateZoomLevel();
    window.PDFModule.renderPDF(window.PDFModule.getPdfDoc());
}

// Handle previous page
function handlePrevPage() {
    let pageNum = window.PDFModule.getPageNum();
    if (pageNum <= 1) return; // Prevent going below the first page
    
    window.PDFModule.setPageNum(pageNum - 1);
    window.PDFModule.updatePageCounter();
    window.PDFModule.renderPDF(window.PDFModule.getPdfDoc());
    clearAIPanelFields();
}

// Handle next page
function handleNextPage() {
    const pdfDoc = window.PDFModule.getPdfDoc();
    let pageNum = window.PDFModule.getPageNum();
    
    if (pageNum >= pdfDoc.numPages) return; // Prevent going beyond the last page
    
    window.PDFModule.setPageNum(pageNum + 1);
    window.PDFModule.updatePageCounter();
    window.PDFModule.renderPDF(pdfDoc);
    clearAIPanelFields();
}

// Handle tool selection
function handleToolSelect(selectedTool, button) {
    uiTool = selectedTool;
    window.PDFModule.setTool(selectedTool);
    setActiveTool(button);
    
    if (selectedTool === 'text') {
        hideSizeControlPanel();
        changeCursorStyle('text');
    } else {
        showSizeControlPanel();
        updateSizePreview();
        changeCursorStyle('crosshair');
    }
}

// Set active tool button
function setActiveTool(activeButton) {
    // For zoom buttons, we handle them separately
    const fitToWidthButton = document.getElementById('fit-to-width');
    if (activeButton === fitToWidthButton) {
        if (fitToWidthButton) fitToWidthButton.classList.add('active');
        return;
    }
    
    // Remove active class from fit-to-width button
    if (fitToWidthButton) {
        fitToWidthButton.classList.remove('active');
    }
    
    // Remove active class from all tool buttons
    const toolButtons = document.querySelectorAll('.tool-button');
    toolButtons.forEach(button => button.classList.remove('active'));
    
    // Add active class to the selected button
    activeButton.classList.add('active');
}

// Handle pen color change
function handlePenColorChange(e) {
    const color = e.target.value;
    window.PDFModule.setPenColor(color);
    
    if (uiTool === 'pen') {
        updateSizePreview();
    }
}

// Handle highlighter color change
function handleHighlighterColorChange(e) {
    const color = e.target.value;
    window.PDFModule.setHighlighterColor(color);
    
    if (uiTool === 'highlighter') {
        updateSizePreview();
    }
}

// Handle text color change
function handleTextColorChange(e) {
    const color = e.target.value;
    window.PDFModule.setTextColor(color);
}

// Handle clear annotations
function handleClearAnnotations() {
    if (confirm('Are you sure you want to clear all annotations on this page?')) {
        const pageNum = window.PDFModule.getPageNum();
        const annotations = window.PDFModule.getAnnotations();
        const textAnnotations = window.PDFModule.getTextAnnotations();
        
        if (annotations[pageNum]) {
            annotations[pageNum] = [];
            if (textAnnotations[pageNum]) {
                textAnnotations[pageNum] = [];
            }
            
            window.PDFModule.setAnnotations(annotations);
            window.PDFModule.setTextAnnotations(textAnnotations);
            
            window.PDFModule.renderAnnotations();
            window.PDFModule.renderTextAnnotations();
        }
    }
}

// Handle size change
function handleSizeChange() {
    const size = sizeSlider.value;
    window.PDFModule.setPenSize(size);
    updateSizePreview();
}

// Handle save
function handleSave() {
    window.PDFModule.savePDF();
}

// Handle save with quality
function handleSaveWithQuality() {
    // This is handled by the PDF module now
    window.PDFModule.savePDF();
}

// Handle cancel save
function handleCancelSave() {
    if (saveQualityModal) {
        saveQualityModal.style.display = 'none';
    }
}

// Handle close modal
function handleCloseModal(e) {
    // Find the parent modal and close it
    const modal = e.target.closest('.modal');
    if (modal) {
        modal.style.display = 'none';
        
        // Clear text input if it's the text modal
        if (modal === textModal && textInput) {
            textInput.value = '';
        }
    }
}

// Handle add text
function handleAddText() {
    const text = textInput.value.trim();
    if (text) {
        // Get text position from PDF module
        // This will be set when the text modal is opened
        window.PDFModule.addTextAnnotation(text, 0, 0); // Position will be handled by PDF module
        if (textModal) textModal.style.display = 'none';
        if (textInput) textInput.value = '';
    }
}

// Handle help
function handleHelp() {
    if (shortcutsModal) {
        shortcutsModal.style.display = 'block';
    }
}

// Handle toolbar toggle
function handleToolbarToggle() {
    toggleToolbar();
}

// Handle fit to width
function handleFitToWidth() {
    window.PDFModule.fitToWidth();
}

// Handle keyboard shortcuts
function handleKeyDown(e) {
    // Only process shortcuts if a PDF is loaded
    const pdfDoc = window.PDFModule.getPdfDoc();
    if (!pdfDoc) return;
    
    // Don't process shortcuts if user is typing in a text field
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
    
    switch (e.key) {
        // Tool shortcuts
        case 'p': // Pen tool
            uiTool = 'pen';
            window.PDFModule.setTool('pen');
            setActiveTool(penButton);
            showSizeControlPanel();
            updateSizePreview();
            changeCursorStyle('crosshair');
            break;
        case 'h': // Highlighter tool
            uiTool = 'highlighter';
            window.PDFModule.setTool('highlighter');
            setActiveTool(highlighterButton);
            showSizeControlPanel();
            updateSizePreview();
            changeCursorStyle('crosshair');
            break;
        case 't': // Text tool
            uiTool = 'text';
            window.PDFModule.setTool('text');
            setActiveTool(textButton);
            hideSizeControlPanel();
            changeCursorStyle('text');
            break;
        case 'e': // Eraser tool
            uiTool = 'eraser';
            window.PDFModule.setTool('eraser');
            setActiveTool(eraserButton);
            showSizeControlPanel();
            updateSizePreview();
            changeCursorStyle('crosshair');
            break;
            
        // Navigation shortcuts
        case 'ArrowLeft': // Previous page
            let pageNum = window.PDFModule.getPageNum();
            if (pageNum > 1) {
                window.PDFModule.setPageNum(pageNum - 1);
                window.PDFModule.updatePageCounter();
                window.PDFModule.renderPDF(pdfDoc);
                clearAIPanelFields();
            }
            break;
        case 'ArrowRight': // Next page
            pageNum = window.PDFModule.getPageNum();
            if (pageNum < pdfDoc.numPages) {
                window.PDFModule.setPageNum(pageNum + 1);
                window.PDFModule.updatePageCounter();
                window.PDFModule.renderPDF(pdfDoc);
                clearAIPanelFields();
            }
            break;
            
        // Zoom shortcuts
        case '+': // Zoom in
        case '=': // Also zoom in (= is the unshifted + key)
            let scale = window.PDFModule.getScale();
            scale += 0.25;
            window.PDFModule.setScale(scale);
            
            const fitToWidthButton = document.getElementById('fit-to-width');
            if (fitToWidthButton) {
                fitToWidthButton.classList.remove('active');
            }
            
            window.PDFModule.updateZoomLevel();
            window.PDFModule.renderPDF(pdfDoc);
            break;
        case '-': // Zoom out
            scale = window.PDFModule.getScale();
            scale = Math.max(0.5, scale - 0.25);
            window.PDFModule.setScale(scale);
            
            if (fitToWidthButton) {
                fitToWidthButton.classList.remove('active');
            }
            
            window.PDFModule.updateZoomLevel();
            window.PDFModule.renderPDF(pdfDoc);
            break;
        case 'w': // Fit to width
            window.PDFModule.fitToWidth();
            break;
            
        // Save shortcut
        case 's': // Save if Ctrl/Cmd is pressed
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault(); // Prevent browser's save dialog
                window.PDFModule.savePDF();
            }
            break;
            
        // Toggle toolbar
        case 'f': // Toggle toolbar
            toggleToolbar();
            break;
            
        // Toggle AI panel
        case 'l': // Toggle AI panel
            toggleAIPanel();
            break;
            
        default:
            return; // Exit for unhandled keys
    }
}

// Handle close modal when clicking outside
function handleCloseModalOutside(e) {
    if (e.target === textModal) {
        textModal.style.display = 'none';
        if (textInput) textInput.value = '';
    } else if (e.target === shortcutsModal) {
        shortcutsModal.style.display = 'none';
    } else if (e.target === saveQualityModal) {
        saveQualityModal.style.display = 'none';
    }
}

// Handle canvas scroll
function handleCanvasScroll() {
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.classList.remove('visible');
    }
}

// Show size control panel
function showSizeControlPanel() {
    if (sizeControlPanel) {
        sizeControlPanel.classList.add('visible');
        const penSize = window.PDFModule.getPenSize();
        if (sizeSlider) sizeSlider.value = penSize;
        updateSizePreview();
    }
}

// Hide size control panel
function hideSizeControlPanel() {
    if (sizeControlPanel) {
        sizeControlPanel.classList.remove('visible');
    }
}

// Update size preview
function updateSizePreview() {
    const penSize = window.PDFModule.getPenSize();
    const tool = window.PDFModule.getTool();
    const penColor = window.PDFModule.getPenColor();
    const highlighterColor = window.PDFModule.getHighlighterColor();
    
    // Update the size value text
    if (sizeValue) sizeValue.textContent = penSize;
    
    // Update the preview dot size
    const dotSize = Math.max(2, penSize * 2); // Scale up for better visibility
    if (sizePreviewDot) {
        sizePreviewDot.style.width = `${dotSize}px`;
        sizePreviewDot.style.height = `${dotSize}px`;
        
        // Update the preview dot color based on the selected tool
        if (uiTool === 'pen') {
            sizePreviewDot.style.backgroundColor = penColor;
        } else if (uiTool === 'highlighter') {
            sizePreviewDot.style.backgroundColor = highlighterColor;
            sizePreviewDot.style.opacity = '0.3';
        } else if (uiTool === 'eraser') {
            sizePreviewDot.style.backgroundColor = '#ffffff';
            sizePreviewDot.style.border = '1px solid #000000';
        }
    }
}

// Change cursor style
function changeCursorStyle(cursor) {
    const annotationCanvas = document.getElementById('annotation-canvas');
    if (annotationCanvas) {
        annotationCanvas.style.cursor = cursor;
    }
}

// Add shortcut tooltips
function addShortcutTooltips() {
    if (penButton) penButton.title = "Pen Tool (P)";
    if (highlighterButton) highlighterButton.title = "Highlighter Tool (H)";
    if (textButton) textButton.title = "Text Tool (T)";
    if (eraserButton) eraserButton.title = "Eraser Tool (E)";
    if (zoomInButton) zoomInButton.title = "Zoom In (+)";
    if (zoomOutButton) zoomOutButton.title = "Zoom Out (-)";
    if (fitToWidthButton) fitToWidthButton.title = "Fit to Width (W)";
    if (prevPageButton) prevPageButton.title = "Previous Page (Left Arrow)";
    if (nextPageButton) nextPageButton.title = "Next Page (Right Arrow)";
    if (saveButton) saveButton.title = "Save (Ctrl+S)";
}

// Toolbar toggle functionality
function initToolbarToggle() {
    // Event listener already added in addEventListeners
}

function toggleToolbar() {
    if (toolbar) {
        toolbar.classList.toggle('collapsed');
        
        // Update the toggle button icon
        const icon = toolbarToggle ? toolbarToggle.querySelector('i') : null;
        if (icon) {
            if (toolbar.classList.contains('collapsed')) {
                icon.className = 'fas fa-chevron-down';
                if (toolbarToggle) toolbarToggle.title = 'Show Toolbar';
            } else {
                icon.className = 'fas fa-chevron-up';
                if (toolbarToggle) toolbarToggle.title = 'Hide Toolbar';
            }
        }
        
        // Adjust canvas wrapper height
        setTimeout(() => {
            const pdfDoc = window.PDFModule.getPdfDoc();
            if (pdfDoc) {
                // Check scroll needed
                const CanvasWrapper = document.getElementById('canvas-wrapper');
                if (CanvasWrapper) {
                    setTimeout(() => {
                        const isScrollableX = CanvasWrapper.scrollWidth > CanvasWrapper.clientWidth;
                        const isScrollableY = CanvasWrapper.scrollHeight > CanvasWrapper.clientHeight;
                        
                        const scrollIndicator = document.getElementById('scroll-indicator');
                        if (scrollIndicator) {
                            if (isScrollableX || isScrollableY) {
                                scrollIndicator.classList.add('visible');
                                
                                // Hide the indicator after 3 seconds
                                setTimeout(() => {
                                    scrollIndicator.classList.remove('visible');
                                }, 3000);
                            } else {
                                scrollIndicator.classList.remove('visible');
                            }
                        }
                    }, 100);
                }
                
                const fitToWidthButton = document.getElementById('fit-to-width');
                if (fitToWidthButton && fitToWidthButton.classList.contains('active')) {
                    window.PDFModule.fitToWidth();
                }
            }
        }, 300);
    }
}

// Initialize AI panel functionality
function initAIPanel() {
    // Populate language dropdown
    if (window.LLMService && targetLanguage) {
        window.LLMService.populateLanguageOptions(targetLanguage);
    }
    
    // Add event listeners for AI panel buttons
    if (translateButton) {
        translateButton.addEventListener('click', () => {
            showAIPanel('translation');
        });
    }
    
    if (summarizeButton) {
        summarizeButton.addEventListener('click', () => {
            showAIPanel('summarization');
        });
    }
    
    if (extractButton) {
        extractButton.addEventListener('click', () => {
            showAIPanel('extraction');
        });
    }
    
    if (closeAiPanel) {
        closeAiPanel.addEventListener('click', hideAIPanel);
    }
    
    // Add event listeners for AI functionality
    if (translateTextButton) {
        translateTextButton.addEventListener('click', handleTranslateText);
    }
    
    if (summarizeTextButton) {
        summarizeTextButton.addEventListener('click', handleSummarizeText);
    }
    
    if (extractInfoButton) {
        extractInfoButton.addEventListener('click', handleExtractInfo);
    }
    
    if (translatePageButton) {
        translatePageButton.addEventListener('click', handleTranslatePage);
    }
    
    if (summarizePageButton) {
        summarizePageButton.addEventListener('click', handleSummarizePage);
    }
    
    if (extractFromPageButton) {
        extractFromPageButton.addEventListener('click', handleExtractFromPage);
    }
}

// Handle translate text
async function handleTranslateText() {
    if (!sourceText || !sourceText.value.trim()) {
        alert('Please enter text to translate');
        return;
    }
    
    try {
        setLoading(translationResult, true);
        const result = await window.LLMService.translateText(sourceText.value, targetLanguage.value);
        translationResult.innerHTML = renderMarkdown(result);
        setLoading(translationResult, false);
    } catch (error) {
        setLoading(translationResult, false);
        translationResult.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
    }
}

// Handle summarize text
async function handleSummarizeText() {
    if (!summarizeText || !summarizeText.value.trim()) {
        alert('Please enter text to summarize');
        return;
    }
    
    try {
        setLoading(summaryResult, true);
        const result = await window.LLMService.summarizeContent(summarizeText.value, summaryLength.value);
        summaryResult.innerHTML = renderMarkdown(result);
        setLoading(summaryResult, false);
    } catch (error) {
        setLoading(summaryResult, false);
        summaryResult.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
    }
}

// Handle extract information
async function handleExtractInfo() {
    if (!extractText || !extractText.value.trim()) {
        alert('Please enter text to extract information from');
        return;
    }
    
    try {
        setLoading(extractionResult, true);
        const result = await window.LLMService.extractInformation(extractText.value, extractionQuery.value);
        extractionResult.innerHTML = renderMarkdown(result);
        setLoading(extractionResult, false);
    } catch (error) {
        setLoading(extractionResult, false);
        extractionResult.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
    }
}

// Handle translate page
async function handleTranslatePage() {
    const pdfDoc = window.PDFModule.getPdfDoc();
    if (!pdfDoc) {
        alert('Please open a PDF first');
        return;
    }
    
    try {
        showNotification('Extracting text from current page...', 'info');
        const extractedText = await window.PDFModule.extractTextFromCurrentPage();
        
        if (!extractedText || extractedText.trim().length < 10) {
            hideNotification();
            alert('Could not extract text from this page');
            return;
        } else {
            if (sourceText) sourceText.value = extractedText;
            hideNotification();
            showNotification('Text extracted successfully!', 'success');
            setTimeout(hideNotification, 2000);
        }
        
        // Highlight the translate button
        if (translateButton) {
            translateButton.classList.add('highlight-button');
            setTimeout(() => {
                translateButton.classList.remove('highlight-button');
            }, 3000);
        }
        
        setLoading(translationResult, true);
        const result = await window.LLMService.translateText(extractedText, targetLanguage.value);
        translationResult.innerHTML = renderMarkdown(result);
        setLoading(translationResult, false);
    } catch (error) {
        hideNotification();
        setLoading(translationResult, false);
        translationResult.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
    }
}

// Handle summarize page
async function handleSummarizePage() {
    const pdfDoc = window.PDFModule.getPdfDoc();
    if (!pdfDoc) {
        alert('Please open a PDF first');
        return;
    }
    
    try {
        showNotification('Extracting text from current page...', 'info');
        const extractedText = await window.PDFModule.extractTextFromCurrentPage();
        
        if (!extractedText || extractedText.trim().length < 10) {
            hideNotification();
            alert('Could not extract text from this page');
            return;
        } else {
            if (summarizeText) summarizeText.value = extractedText;
            hideNotification();
            showNotification('Text extracted successfully!', 'success');
            setTimeout(hideNotification, 2000);
        }
        
        // Highlight the summarize button
        if (summarizeButton) {
            summarizeButton.classList.add('highlight-button');
            setTimeout(() => {
                summarizeButton.classList.remove('highlight-button');
            }, 3000);
        }
        
        setLoading(summaryResult, true);
        const result = await window.LLMService.summarizeContent(extractedText, summaryLength.value);
        summaryResult.innerHTML = renderMarkdown(result);
        setLoading(summaryResult, false);
    } catch (error) {
        hideNotification();
        setLoading(summaryResult, false);
        summaryResult.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
    }
}

// Handle extract from page
async function handleExtractFromPage() {
    const pdfDoc = window.PDFModule.getPdfDoc();
    if (!pdfDoc || !extractionQuery || !extractionQuery.value.trim()) {
        alert('Please open a PDF and enter an extraction query first');
        return;
    }
    
    try {
        showNotification('Extracting text from current page...', 'info');
        const extractedText = await window.PDFModule.extractTextFromCurrentPage();
        
        if (!extractedText || extractedText.trim().length < 10) {
            hideNotification();
            alert('Could not extract text from this page');
            return;
        } else {
            if (extractText) extractText.value = extractedText;
            hideNotification();
            showNotification('Text extracted successfully!', 'success');
            setTimeout(hideNotification, 2000);
        }
        
        // Highlight the extract button
        if (extractButton) {
            extractButton.classList.add('highlight-button');
            setTimeout(() => {
                extractButton.classList.remove('highlight-button');
            }, 3000);
        }
        
        setLoading(extractionResult, true);
        const result = await window.LLMService.extractInformation(extractedText, extractionQuery.value);
        extractionResult.innerHTML = renderMarkdown(result);
        setLoading(extractionResult, false);
    } catch (error) {
        hideNotification();
        setLoading(extractionResult, false);
        extractionResult.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
    }
}

// Show AI panel with specific section active
function showAIPanel(section) {
    // Hide all sections first
    const translationSection = document.getElementById('translation-section');
    const summarizationSection = document.getElementById('summarization-section');
    const extractionSection = document.getElementById('extraction-section');
    const aiPanelTitle = document.getElementById('ai-panel-title');
    
    if (translationSection) translationSection.style.display = 'none';
    if (summarizationSection) summarizationSection.style.display = 'none';
    if (extractionSection) extractionSection.style.display = 'none';
    
    // Show the requested section
    if (section === 'translation') {
        if (translationSection) translationSection.style.display = 'block';
        if (aiPanelTitle) aiPanelTitle.textContent = 'Translation';
    } else if (section === 'summarization') {
        if (summarizationSection) summarizationSection.style.display = 'block';
        if (aiPanelTitle) aiPanelTitle.textContent = 'Summarization';
    } else if (section === 'extraction') {
        if (extractionSection) extractionSection.style.display = 'block';
        if (aiPanelTitle) aiPanelTitle.textContent = 'Information Extraction';
    }
    
    // Show the panel
    if (aiPanel) aiPanel.classList.add('visible');
}

// Hide AI panel
function hideAIPanel() {
    if (aiPanel) aiPanel.classList.remove('visible');
}

// Toggle AI panel visibility
function toggleAIPanel() {
    if (aiPanel && aiPanel.classList.contains('visible')) {
        hideAIPanel();
    } else {
        showAIPanel('translation'); // Default to translation section
    }
}

// Set loading state for a container
function setLoading(element, isLoading) {
    if (element) {
        if (isLoading) {
            element.classList.add('loading');
        } else {
            element.classList.remove('loading');
        }
    }
}

// Render markdown content safely
function renderMarkdown(markdownText) {
    if (typeof marked !== 'undefined') {
        // Configure marked for safe rendering
        marked.setOptions({
            breaks: true,
            gfm: true,
            sanitize: false,
            smartLists: true,
            smartypants: false
        });
        
        return marked.parse(markdownText);
    } else {
        // Fallback: Simple formatting if marked.js isn't loaded
        return markdownText
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }
}

// Show notification to the user
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set notification content and type
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
}

// Hide notification
function hideNotification() {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.style.display = 'none';
    }
}

// Function to clear all AI panel input and result fields
function clearAIPanelFields() {
    // Clear translation fields
    if (sourceText) sourceText.value = '';
    if (translationResult) translationResult.innerHTML = '';
    
    // Clear summarization fields
    if (summarizeText) summarizeText.value = '';
    if (summaryResult) summaryResult.innerHTML = '';
    
    // Clear extraction fields
    if (extractText) extractText.value = '';
    if (extractionResult) extractionResult.innerHTML = '';
    
    // Remove loading states if any
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(el => el.classList.remove('loading'));
}

// Handle open text modal event from PDF module
function handleOpenTextModal(event) {
    const position = event.detail;
    if (textModal) textModal.style.display = 'block';
    if (textInput) textInput.focus();
    
    // Store position for when text is added
    // In a more robust implementation, we would pass this to the PDF module
}

// Handle get text settings event from PDF module
function handleGetTextSettings(event) {
    event.detail.fontSize = parseInt(fontSizeSelect ? fontSizeSelect.value : '16');
    event.detail.fontFamily = fontFamilySelect ? fontFamilySelect.value : 'Arial, sans-serif';
}

// Handle get selected DPI event from PDF module
function handleGetSelectedDPI(event) {
    let selectedDPI = 150; // Default
    if (qualityOptions) {
        for (const option of qualityOptions) {
            if (option.checked) {
                selectedDPI = parseInt(option.value);
                break;
            }
        }
    }
    event.detail.dpi = selectedDPI;
}

// Handle show loading message event from PDF module
function handleShowLoadingMessage(event) {
    const selectedDPI = event.detail.dpi;
    
    // Show a loading message or spinner
    const loadingMessage = document.createElement('div');
    loadingMessage.id = 'pdf-save-loading-message';
    loadingMessage.style.position = 'fixed';
    loadingMessage.style.top = '50%';
    loadingMessage.style.left = '50%';
    loadingMessage.style.transform = 'translate(-50%, -50%)';
    loadingMessage.style.padding = '20px';
    loadingMessage.style.background = 'rgba(0, 0, 0, 0.7)';
    loadingMessage.style.color = 'white';
    loadingMessage.style.borderRadius = '8px';
    loadingMessage.style.zIndex = '9999';
    loadingMessage.textContent = `Generating ${selectedDPI} DPI PDF...`;
    document.body.appendChild(loadingMessage);
}

// Handle hide loading message event from PDF module
function handleHideLoadingMessage() {
    const loadingMessage = document.getElementById('pdf-save-loading-message');
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

// Handle clear AI panel fields event from PDF module
function handleClearAIPanelFields() {
    clearAIPanelFields();
}

// Initialize model selection functionality
async function initModelSelection() {
    // Load saved API key and selected model
    const savedApiKey = localStorage.getItem('openrouter-api-key');
    const savedModel = localStorage.getItem('selected-model');
    
    if (apiKeyInput && savedApiKey) {
        apiKeyInput.value = savedApiKey;
    }
    
    if (modelSearchInput && savedModel) {
        // Set the model search input to show the selected model name
        modelSearchInput.placeholder = savedModel;
    }
    
    if (selectedModelInput && savedModel) {
        selectedModelInput.value = savedModel;
    }
    
    // Fetch models if API key is available
    if (savedApiKey && window.LLMService) {
        try {
            await loadModelList();
        } catch (error) {
            console.warn('Could not load model list:', error);
        }
    }
}

// Handle API key change
async function handleApiKeyChange(event) {
    const apiKey = event.target.value;
    if (window.LLMService) {
        window.LLMService.updateApiKey(apiKey);
        
        // If we have an API key, try to load the model list
        if (apiKey) {
            try {
                await loadModelList();
            } catch (error) {
                console.warn('Could not load model list:', error);
            }
        }
    }
}

// Handle model search input
async function handleModelSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    
    // Show dropdown when there's a search term
    if (searchTerm && modelDropdown) {
        modelDropdown.classList.remove('hidden');
    }
    
    // Filter models if we have loaded them
    if (window.LLMService && modelList) {
        try {
            const models = await window.LLMService.fetchModels();
            const filteredModels = models.filter(model =>
                model.id.toLowerCase().includes(searchTerm) ||
                (model.name && model.name.toLowerCase().includes(searchTerm))
            );
            renderModelList(filteredModels);
        } catch (error) {
            console.error('Error filtering models:', error);
        }
    }
}

// Handle model search focus
function handleModelSearchFocus() {
    if (modelDropdown) {
        modelDropdown.classList.remove('hidden');
    }
}

// Handle click outside dropdown
function handleDocumentClick(event) {
    if (modelDropdown && !modelDropdown.contains(event.target) &&
        modelSearchInput && !modelSearchInput.contains(event.target)) {
        modelDropdown.classList.add('hidden');
    }
}

// Load model list from API
async function loadModelList() {
    if (!window.LLMService || !modelList) return;
    
    try {
        const models = await window.LLMService.fetchModels();
        renderModelList(models);
    } catch (error) {
        console.error('Error loading model list:', error);
        // Show error in model list
        if (modelList) {
            modelList.innerHTML = `<div class="error-message">Failed to load models: ${error.message}</div>`;
        }
    }
}

// Render model list in dropdown
function renderModelList(models) {
    if (!modelList) return;
    
    if (!models || models.length === 0) {
        modelList.innerHTML = '<div class="model-item">No models found</div>';
        return;
    }
    
    // Limit to first 50 models for performance
    const displayModels = models.slice(0, 50);
    
    modelList.innerHTML = displayModels.map(model => `
        <div class="model-item" data-model-id="${model.id}">
            <div class="model-name">${model.name || model.id}</div>
            <div class="model-id">${model.id}</div>
        </div>
    `).join('');
    
    // Add event listeners to model items
    const modelItems = modelList.querySelectorAll('.model-item');
    modelItems.forEach(item => {
        item.addEventListener('click', () => selectModel(item));
    });
}

// Select a model
function selectModel(modelItem) {
    const modelId = modelItem.dataset.modelId;
    const modelName = modelItem.querySelector('.model-name').textContent;
    
    // Update UI
    if (modelSearchInput) {
        modelSearchInput.value = modelName;
    }
    
    if (selectedModelInput) {
        selectedModelInput.value = modelId;
    }
    
    // Hide dropdown
    if (modelDropdown) {
        modelDropdown.classList.add('hidden');
    }
    
    // Update LLM service
    if (window.LLMService) {
        window.LLMService.updateSelectedModel(modelId);
    }
}

// Export functions for use in other modules
window.UIModule = {
    initUIModule,
    setActiveTool,
    showSizeControlPanel,
    hideSizeControlPanel,
    updateSizePreview,
    changeCursorStyle,
    addShortcutTooltips,
    toggleToolbar,
    showAIPanel,
    hideAIPanel,
    toggleAIPanel,
    showNotification,
    hideNotification,
    clearAIPanelFields,
    initModelSelection
};