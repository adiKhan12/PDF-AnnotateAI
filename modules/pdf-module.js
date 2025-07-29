/**
 * PDF Module for PDF rendering and annotation functionality
 */

// State variables
let pdfTool = 'pen';
let penSize = 1;
let penColor = '#000000';
let highlighterColor = '#ffff00';
let textColor = '#000000';
let pdfDoc = null;
let pageNum = 1;
let totalPages = 1;
let drawing = false;
let annotations = [];
let textAnnotations = [];
let scale = 1;
let originalPageDimensions = {};
let textPosition = { x: 0, y: 0 };

// Canvas elements
let canvas, context, annotationCanvas, annotationContext, CanvasWrapper;

// UI elements
let pageCounter, zoomLevel, scrollIndicator;

// Initialize the PDF module
function initPDFModule() {
    // Get canvas elements
    canvas = document.getElementById('pdf-canvas');
    context = canvas.getContext('2d');
    annotationCanvas = document.getElementById('annotation-canvas');
    annotationContext = annotationCanvas.getContext('2d');
    CanvasWrapper = document.getElementById('canvas-wrapper');
    
    // Get UI elements
    pageCounter = document.getElementById('page-counter');
    zoomLevel = document.getElementById('zoom-level');
    scrollIndicator = document.getElementById('scroll-indicator');
    
    // Set initial canvas dimensions
    annotationCanvas.width = canvas.width;
    annotationCanvas.height = canvas.height;
    
    // Add event listeners for canvas interactions
    annotationCanvas.addEventListener('mousedown', handleCanvasMouseDown);
    annotationCanvas.addEventListener('mousemove', handleCanvasMouseMove);
    annotationCanvas.addEventListener('mouseup', () => drawing = false);
    
    // Add window resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Debounce the resize event to avoid excessive rendering
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (pdfDoc && document.getElementById('fit-to-width').classList.contains('active')) {
                fitToWidth();
            }
        }, 200);
    });
}

// Handle mouse down on canvas
function handleCanvasMouseDown(e) {
    if (pdfTool === 'text') {
        const rect = canvas.getBoundingClientRect();
        textPosition.x = (e.clientX - rect.left) / scale;
        textPosition.y = (e.clientY - rect.top) / scale;
        // Text modal will be handled by UI module
        window.dispatchEvent(new CustomEvent('openTextModal', { detail: textPosition }));
        return;
    }

    drawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    if (!annotations[pageNum]) {
        annotations[pageNum] = [];
    }

    if (pdfTool === 'eraser') {
        eraseAnnotations(x, y, penSize / scale);
    } else {
        const color = pdfTool === 'pen' ? penColor : highlighterColor;
        annotations[pageNum].push({ tool: pdfTool, penSize, color, points: [{ x, y }] });
    }
}

// Handle mouse move on canvas
function handleCanvasMouseMove(e) {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    const currentAnnotation = annotations[pageNum][annotations[pageNum].length - 1];

    if (pdfTool === 'eraser') {
        eraseAnnotations(x, y, penSize / scale);
    } else {
        currentAnnotation.points.push({ x, y });
        renderAnnotations();
    }
}

// Render the PDF
async function renderPDF(pdfDocument) {
    if (!pdfDocument) return;
    
    // Ensure scale is valid
    if (scale <= 0 || isNaN(scale)) {
        console.log("Invalid scale detected:", scale);
        scale = 1; // Reset to default if invalid
        updateZoomLevel();
    }
    
    const page = await pdfDocument.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    annotationCanvas.width = viewport.width;
    annotationCanvas.height = viewport.height;

    // Update the canvas container size to match the viewport
    const canvasContainer = document.querySelector('.canvas-container');
    canvasContainer.style.width = `${viewport.width}px`;
    canvasContainer.style.height = `${viewport.height}px`;

    const renderContext = {
        canvasContext: context,
        viewport: viewport,
    };
    await page.render(renderContext).promise;

    // Show the canvases when a PDF is loaded
    CanvasWrapper.style.display = 'block';

    // Hide the no-pdf-message when a PDF is loaded
    const noPdfMessage = document.getElementById('no-pdf-message');
    if (noPdfMessage) {
        noPdfMessage.style.display = 'none';
    }

    renderAnnotations(); // Render annotations after the page is rendered
    renderTextAnnotations(); // Render text annotations
    
    // Scroll to the top when changing pages or zoom
    CanvasWrapper.scrollTop = 0;
    CanvasWrapper.scrollLeft = 0;
    
    // Check if scrolling is needed and show indicator
    checkScrollNeeded();

    // Clear AI panel fields when a new PDF is loaded
    window.dispatchEvent(new CustomEvent('clearAIPanelFields'));
}

// Render annotations on the annotation canvas
function renderAnnotations() {
    annotationContext.clearRect(0, 0, annotationCanvas.width, annotationCanvas.height);

    if (!annotations[pageNum]) return; // Return if no annotations for the current page

    for (const annotation of annotations[pageNum]) {
        const { tool: annotationTool, penSize, color, points } = annotation;
        annotationContext.lineWidth = penSize * scale;
        
        if (annotationTool === 'highlighter') {
            annotationContext.strokeStyle = color || 'rgba(255, 255, 0, 0.3)';
            annotationContext.globalAlpha = 0.3;
        } else {
            annotationContext.strokeStyle = color || 'black';
            annotationContext.globalAlpha = 1.0;
        }
        
        annotationContext.globalCompositeOperation = annotationTool === 'eraser' ? 'destination-out' : 'source-over';
        annotationContext.beginPath();
        
        annotationContext.moveTo(points[0].x * scale, points[0].y * scale);

        for (const point of points) {
            annotationContext.lineTo(point.x * scale, point.y * scale);
        }
        annotationContext.stroke();
    }
}

// Erase annotations near a point
function eraseAnnotations(x, y, radius) {
    if (!annotations[pageNum]) return; // Return if no annotations for the current page

    annotations[pageNum] = annotations[pageNum].filter((annotation) => {
        for (const point of annotation.points) {
            if (
                Math.sqrt(
                    Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)
                ) < radius
            ) {
                return false;
            }
        }
        return true;
    });

    renderAnnotations();
}

// Render text annotations
function renderTextAnnotations() {
    // Remove existing text annotations from DOM
    const existingTextAnnotations = document.querySelectorAll('.text-annotation');
    existingTextAnnotations.forEach(el => el.remove());

    if (!textAnnotations[pageNum]) return;

    const canvasContainer = document.querySelector('.canvas-container');

    textAnnotations[pageNum].forEach((annotation, index) => {
        const textElement = document.createElement('div');
        textElement.className = 'text-annotation';
        textElement.textContent = annotation.text;
        
        textElement.style.left = `${annotation.x * scale}px`;
        textElement.style.top = `${annotation.y * scale}px`;
        
        textElement.style.fontSize = `${annotation.fontSize * scale}px`;
        textElement.style.fontFamily = annotation.fontFamily;
        textElement.style.color = annotation.color;
        textElement.dataset.index = index;

        // Make text annotations draggable
        textElement.addEventListener('mousedown', startDragText);

        canvasContainer.appendChild(textElement);
    });
}

// Start dragging text annotation
function startDragText(e) {
    const textElement = e.target;
    const index = parseInt(textElement.dataset.index);
    
    let startX = e.clientX;
    let startY = e.clientY;
    
    function moveText(e) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        textAnnotations[pageNum][index].x += dx / scale;
        textAnnotations[pageNum][index].y += dy / scale;
        
        textElement.style.left = `${textAnnotations[pageNum][index].x * scale}px`;
        textElement.style.top = `${textAnnotations[pageNum][index].y * scale}px`;
        
        startX = e.clientX;
        startY = e.clientY;
    }
    
    function stopDragText() {
        document.removeEventListener('mousemove', moveText);
        document.removeEventListener('mouseup', stopDragText);
    }
    
    document.addEventListener('mousemove', moveText);
    document.addEventListener('mouseup', stopDragText);
    
    e.preventDefault(); // Prevent text selection during drag
}

// Add text annotation
function addTextAnnotation(text, x, y) {
    if (!textAnnotations[pageNum]) {
        textAnnotations[pageNum] = [];
    }

    // Get font settings from UI
    const event = new CustomEvent('getTextSettings', { detail: {} });
    window.dispatchEvent(event);
    const { fontSize, fontFamily } = event.detail;

    textAnnotations[pageNum].push({
        text,
        x,
        y,
        fontSize,
        fontFamily,
        color: textColor
    });

    renderTextAnnotations();
}

// Update page counter display
function updatePageCounter() {
    if (pdfDoc) {
        pageCounter.textContent = `Page ${pageNum} of ${totalPages}`;
    } else {
        pageCounter.textContent = 'Page 1 of 1';
    }
}

// Update zoom level display
function updateZoomLevel() {
    // Ensure scale is positive before displaying
    const displayScale = Math.max(scale, 0.01);
    zoomLevel.textContent = `${Math.round(displayScale * 100)}%`;
}

// Fit to width functionality
function fitToWidth() {
    if (!pdfDoc) return;
    
    // Calculate the scale needed to fit the PDF to the wrapper width
    // Account for some padding
    const padding = 40; // 20px padding on each side
    
    // Ensure the canvas wrapper has a valid width before calculating
    if (!CanvasWrapper.clientWidth) {
        // If wrapper isn't visible yet, try again after a short delay
        setTimeout(fitToWidth, 100);
        return;
    }
    
    const availableWidth = Math.max(CanvasWrapper.clientWidth - padding, 100); // Ensure minimum width
    const originalWidth = originalPageDimensions[pageNum].width;
    
    // Calculate the scale needed to fit the width
    let newScale = availableWidth / originalWidth;
    
    // Ensure scale is reasonable (not too small or negative)
    newScale = Math.max(newScale, 0.1); // Minimum scale of 10%
    
    // Round to 2 decimal places for cleaner display
    scale = Math.round(newScale * 100) / 100;
    
    // Set the fit-to-width button as active
    const fitToWidthButton = document.getElementById('fit-to-width');
    if (fitToWidthButton) {
        fitToWidthButton.classList.add('active');
    }
    
    updateZoomLevel();
    renderPDF(pdfDoc);
}

// Check if scrolling is needed and show/hide the indicator
function checkScrollNeeded() {
    // Wait a moment for the browser to calculate scroll dimensions
    setTimeout(() => {
        const isScrollableX = CanvasWrapper.scrollWidth > CanvasWrapper.clientWidth;
        const isScrollableY = CanvasWrapper.scrollHeight > CanvasWrapper.clientHeight;
        
        if (isScrollableX || isScrollableY) {
            scrollIndicator.classList.add('visible');
            
            // Hide the indicator after 3 seconds
            setTimeout(() => {
                scrollIndicator.classList.remove('visible');
            }, 3000);
        } else {
            scrollIndicator.classList.remove('visible');
        }
    }, 100);
}

// Save PDF with annotations
async function savePDF() {
    if (!pdfDoc) {
        const noPdfMessage = document.getElementById('no-pdf-message');
        if (noPdfMessage) {
            noPdfMessage.style.display = 'block';
        }
        return;
    }

    // Get selected DPI from UI
    const event = new CustomEvent('getSelectedDPI', { detail: {} });
    window.dispatchEvent(event);
    let selectedDPI = event.detail.dpi || 150;

    // Show loading message
    window.dispatchEvent(new CustomEvent('showLoadingMessage', { detail: { dpi: selectedDPI } }));

    try {
        // Calculate scale factor based on selected DPI
        const SCALE_FACTOR = selectedDPI / 72; // PDF default is 72 DPI

        // Create a PDF with the dimensions of the first page
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'pt', [originalPageDimensions[1].width, originalPageDimensions[1].height]);

        // Process each page
        for (let i = 1; i <= pdfDoc.numPages; i++) {
            // Get the original page dimensions
            const { width, height } = originalPageDimensions[i];

            // Create a high-resolution canvas
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = width * SCALE_FACTOR;
            tempCanvas.height = height * SCALE_FACTOR;
            const tempContext = tempCanvas.getContext('2d');
            
            // Set high-quality rendering
            tempContext.imageSmoothingEnabled = true;
            tempContext.imageSmoothingQuality = 'high';
            
            // Render the PDF page at high resolution
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale: SCALE_FACTOR });
            
            // Render the PDF content to the canvas
            await page.render({
                canvasContext: tempContext,
                viewport: viewport
            }).promise;
            
            // Draw the annotations on the high-resolution canvas
            if (annotations[i]) {
                for (const annotation of annotations[i]) {
                    // Scale the line width appropriately
                    tempContext.lineWidth = annotation.penSize * SCALE_FACTOR;
                    
                    if (annotation.tool === 'highlighter') {
                        tempContext.strokeStyle = annotation.color || 'rgba(255, 255, 0, 0.3)';
                        tempContext.globalAlpha = 0.3;
                    } else {
                        tempContext.strokeStyle = annotation.color || 'black';
                        tempContext.globalAlpha = 1.0;
                    }
                    
                    tempContext.globalCompositeOperation = annotation.tool === 'eraser' ? 'destination-out' : 'source-over';
                    tempContext.beginPath();

                    // Scale all points to the high-resolution canvas
                    const [firstPoint, ...remainingPoints] = annotation.points;
                    tempContext.moveTo(firstPoint.x * SCALE_FACTOR, firstPoint.y * SCALE_FACTOR);

                    for (const point of remainingPoints) {
                        tempContext.lineTo(point.x * SCALE_FACTOR, point.y * SCALE_FACTOR);
                    }

                    tempContext.stroke();
                }
            }

            // Draw text annotations
            if (textAnnotations[i]) {
                tempContext.globalAlpha = 1.0;
                tempContext.globalCompositeOperation = 'source-over';
                
                for (const annotation of textAnnotations[i]) {
                    // Scale font size for high resolution
                    const scaledFontSize = annotation.fontSize * SCALE_FACTOR;
                    tempContext.font = `${scaledFontSize}px ${annotation.fontFamily}`;
                    tempContext.fillStyle = annotation.color;
                    tempContext.fillText(
                        annotation.text, 
                        annotation.x * SCALE_FACTOR, 
                        annotation.y * SCALE_FACTOR
                    );
                }
            }

            // Add a new page for each page after the first
            if (i > 1) {
                pdf.addPage([width, height]);
            }

            // Add the high-quality image to the PDF
            // Use higher quality settings for the image
            const imgData = tempCanvas.toDataURL('image/jpeg', 1.0); // Use maximum quality JPEG
            pdf.addImage(imgData, 'JPEG', 0, 0, width, height, null, 'FAST');
        }

        // Save the PDF with a timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        pdf.save(`annotated-${timestamp}.pdf`);
    } catch (error) {
        console.error('Error saving PDF:', error);
        alert('An error occurred while saving the PDF. Please try again.');
    } finally {
        // Hide loading message
        window.dispatchEvent(new CustomEvent('hideLoadingMessage'));
    }
}

// Extract text from current page
async function extractTextFromCurrentPage() {
    if (!pdfDoc) return '';
    
    try {
        const page = await pdfDoc.getPage(pageNum);
        
        // First try to extract text directly from the PDF
        const textContent = await page.getTextContent();
        let extractedText = '';
        let textItems = [];
        
        // Collect all text items with their positions
        textContent.items.forEach(item => {
            textItems.push({
                text: item.str,
                x: item.transform[4],
                y: item.transform[5],
                height: item.height
            });
        });
        
        // Sort by vertical position (top to bottom)
        textItems.sort((a, b) => b.y - a.y);
        
        // Process text items to preserve layout
        let currentLine = [];
        let currentY = textItems.length > 0 ? textItems[0].y : 0;
        const lineHeightThreshold = textItems.length > 0 ? textItems[0].height * 1.5 : 0;
        
        textItems.forEach(item => {
            // If this item is on a new line
            if (Math.abs(item.y - currentY) > lineHeightThreshold) {
                // Add the current line to the extracted text
                if (currentLine.length > 0) {
                    // Sort the current line by x position (left to right)
                    currentLine.sort((a, b) => a.x - b.x);
                    extractedText += currentLine.map(i => i.text).join(' ') + '\n';
                    
                    // Check if this might be a paragraph break (larger gap)
                    if (Math.abs(item.y - currentY) > lineHeightThreshold * 2) {
                        extractedText += '\n';
                    }
                }
                
                // Start a new line
                currentLine = [item];
                currentY = item.y;
            } else {
                // Add to the current line
                currentLine.push(item);
            }
        });
        
        // Add the last line
        if (currentLine.length > 0) {
            currentLine.sort((a, b) => a.x - b.x);
            extractedText += currentLine.map(i => i.text).join(' ');
        }
        
        return extractedText;
    } catch (error) {
        console.error('Error extracting text:', error);
        return '';
    }
}

// Getters and setters for module state
function getTool() { return pdfTool; }
function setTool(newTool) { pdfTool = newTool; }

function getPenSize() { return penSize; }
function setPenSize(newSize) { penSize = newSize; }

function getPenColor() { return penColor; }
function setPenColor(newColor) { penColor = newColor; }

function getHighlighterColor() { return highlighterColor; }
function setHighlighterColor(newColor) { highlighterColor = newColor; }

function getTextColor() { return textColor; }
function setTextColor(newColor) { textColor = newColor; }

function getPdfDoc() { return pdfDoc; }
function setPdfDoc(newPdfDoc) { pdfDoc = newPdfDoc; }

function getPageNum() { return pageNum; }
function setPageNum(newPageNum) { pageNum = newPageNum; }

function getTotalPages() { return totalPages; }
function setTotalPages(newTotalPages) { totalPages = newTotalPages; }

function getScale() { return scale; }
function setScale(newScale) { scale = newScale; }

function getOriginalPageDimensions() { return originalPageDimensions; }
function setOriginalPageDimensions(newDimensions) { originalPageDimensions = newDimensions; }

function getAnnotations() { return annotations; }
function setAnnotations(newAnnotations) { annotations = newAnnotations; }

function getTextAnnotations() { return textAnnotations; }
function setTextAnnotations(newTextAnnotations) { textAnnotations = newTextAnnotations; }

// Export functions for use in other modules
window.PDFModule = {
    // Initialization
    initPDFModule,
    
    // Core functionality
    renderPDF,
    renderAnnotations,
    renderTextAnnotations,
    addTextAnnotation,
    updatePageCounter,
    updateZoomLevel,
    fitToWidth,
    savePDF,
    extractTextFromCurrentPage,
    
    // Getters and setters
    getTool, setTool,
    getPenSize, setPenSize,
    getPenColor, setPenColor,
    getHighlighterColor, setHighlighterColor,
    getTextColor, setTextColor,
    getPdfDoc, setPdfDoc,
    getPageNum, setPageNum,
    getTotalPages, setTotalPages,
    getScale, setScale,
    getOriginalPageDimensions, setOriginalPageDimensions,
    getAnnotations, setAnnotations,
    getTextAnnotations, setTextAnnotations
};