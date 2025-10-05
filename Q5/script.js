// Data Dictionary Generator - Main Script

let currentSchema = null;

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
    // File upload handler
    document.getElementById('fileUpload').addEventListener('change', handleFileUpload);
    
    // Sample schema selector
    document.getElementById('sampleSelect').addEventListener('change', handleSampleSelect);
    
    // Generate button
    document.getElementById('generateBtn').addEventListener('click', generateDictionary);
    
    // Clear button
    document.getElementById('clearBtn').addEventListener('click', clearAll);
    
    // Export buttons
    document.getElementById('exportHtmlBtn').addEventListener('click', exportAsHTML);
    document.getElementById('exportPdfBtn').addEventListener('click', exportAsPDF);
}

/**
 * Handle file upload
 */
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            document.getElementById('schemaInput').value = content;
            hideError();
        } catch (error) {
            showError('Error reading file: ' + error.message);
        }
    };
    reader.readAsText(file);
}

/**
 * Handle sample schema selection
 */
function handleSampleSelect(event) {
    const selectedSample = event.target.value;
    if (!selectedSample) return;
    
    const schema = sampleSchemas[selectedSample];
    if (schema) {
        document.getElementById('schemaInput').value = JSON.stringify(schema, null, 2);
        hideError();
    }
}

/**
 * Generate data dictionary from schema
 */
function generateDictionary() {
    const schemaInput = document.getElementById('schemaInput').value.trim();
    
    if (!schemaInput) {
        showError('Please provide a schema (upload file, paste JSON, or select a sample)');
        return;
    }
    
    try {
        // Parse JSON schema
        currentSchema = JSON.parse(schemaInput);
        
        // Validate schema
        if (!validateSchema(currentSchema)) {
            showError('Invalid schema format. Please check the documentation.');
            return;
        }
        
        // Generate the dictionary
        renderDictionary(currentSchema);
        
        // Show output section
        document.getElementById('outputSection').style.display = 'block';
        document.getElementById('outputSection').scrollIntoView({ behavior: 'smooth' });
        
        hideError();
    } catch (error) {
        showError('Error parsing JSON: ' + error.message);
    }
}

/**
 * Validate schema structure
 */
function validateSchema(schema) {
    if (!schema || typeof schema !== 'object') return false;
    if (!schema.database || typeof schema.database !== 'string') return false;
    if (!Array.isArray(schema.tables) || schema.tables.length === 0) return false;
    
    // Validate each table
    for (const table of schema.tables) {
        if (!table.name || !Array.isArray(table.columns)) return false;
    }
    
    return true;
}

/**
 * Render the complete data dictionary
 */
function renderDictionary(schema) {
    const output = document.getElementById('dictionaryOutput');
    
    let html = '';
    
    // Database info header
    html += renderDatabaseInfo(schema);
    
    // Table of contents
    html += renderTableOfContents(schema.tables);
    
    // ER Diagram
    html += renderERDiagram(schema);
    
    // Table details
    html += renderTableDetails(schema);
    
    output.innerHTML = html;
}

/**
 * Render database information header
 */
function renderDatabaseInfo(schema) {
    const tableCount = schema.tables.length;
    const columnCount = schema.tables.reduce((sum, table) => sum + table.columns.length, 0);
    const relationshipCount = schema.relationships ? schema.relationships.length : 0;
    
    return `
        <div class="db-info">
            <h2>📊 ${escapeHTML(schema.database)}</h2>
            <div class="db-stats">
                <div class="stat-item">
                    <span class="stat-value">${tableCount}</span>
                    <span class="stat-label">Tables</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${columnCount}</span>
                    <span class="stat-label">Total Columns</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${relationshipCount}</span>
                    <span class="stat-label">Relationships</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render table of contents
 */
function renderTableOfContents(tables) {
    let html = '<div class="toc"><h3>📑 Table of Contents</h3><ul class="toc-list">';
    
    tables.forEach(table => {
        html += `<li><a href="#table-${table.name}">${escapeHTML(table.name)}</a></li>`;
    });
    
    html += '</ul></div>';
    return html;
}

/**
 * Render ER Diagram
 */
function renderERDiagram(schema) {
    let html = '<div class="er-diagram"><h3>🔗 Entity Relationship Diagram</h3>';
    html += '<div class="diagram-container">';
    
    // Render each table as a node
    schema.tables.forEach(table => {
        html += renderTableNode(table);
    });
    
    html += '</div></div>';
    return html;
}

/**
 * Render a table node for the ER diagram
 */
function renderTableNode(table) {
    let html = `<div class="table-node">`;
    html += `<div class="table-node-header">${escapeHTML(table.name)}</div>`;
    html += `<div class="table-node-columns">`;
    
    // Show columns (limit to key columns for visibility)
    const keyColumns = table.columns.filter(col => col.primaryKey || col.foreignKey).slice(0, 5);
    const otherColumns = table.columns.filter(col => !col.primaryKey && !col.foreignKey).slice(0, 3);
    
    [...keyColumns, ...otherColumns].forEach(column => {
        const classes = [];
        if (column.primaryKey) classes.push('primary-key');
        if (column.foreignKey) classes.push('foreign-key');
        
        html += `<div class="column-item ${classes.join(' ')}">`;
        html += `${column.primaryKey ? '🔑 ' : ''}${column.foreignKey ? '🔗 ' : ''}`;
        html += `${escapeHTML(column.name)}: ${escapeHTML(column.type)}`;
        html += `</div>`;
    });
    
    if (table.columns.length > keyColumns.length + otherColumns.length) {
        html += `<div class="column-item">... ${table.columns.length - keyColumns.length - otherColumns.length} more</div>`;
    }
    
    html += `</div></div>`;
    return html;
}

/**
 * Render detailed table information
 */
function renderTableDetails(schema) {
    let html = '<div class="tables-section">';
    
    schema.tables.forEach(table => {
        html += `<div class="table-details" id="table-${table.name}">`;
        
        // Table header
        html += `<div class="table-header">`;
        html += `<h3>${escapeHTML(table.name)}</h3>`;
        if (table.description) {
            html += `<p class="table-description">${escapeHTML(table.description)}</p>`;
        }
        html += `</div>`;
        
        // Columns table
        html += `<table class="columns-table">`;
        html += `<thead><tr>`;
        html += `<th>Column Name</th>`;
        html += `<th>Data Type</th>`;
        html += `<th>Nullable</th>`;
        html += `<th>Keys</th>`;
        html += `<th>Description</th>`;
        html += `</tr></thead><tbody>`;
        
        table.columns.forEach(column => {
            html += `<tr>`;
            html += `<td><strong>${escapeHTML(column.name)}</strong></td>`;
            html += `<td>${escapeHTML(column.type)}</td>`;
            html += `<td>${column.nullable ? 'Yes' : 'No'}</td>`;
            html += `<td>`;
            if (column.primaryKey) html += `<span class="badge badge-primary">PK</span>`;
            if (column.foreignKey) html += `<span class="badge badge-warning">FK</span>`;
            html += `</td>`;
            html += `<td>${column.description ? escapeHTML(column.description) : '-'}</td>`;
            html += `</tr>`;
        });
        
        html += `</tbody></table>`;
        
        // Relationships
        if (schema.relationships) {
            const tableRelationships = schema.relationships.filter(rel => 
                rel.from === table.name || rel.to === table.name
            );
            
            if (tableRelationships.length > 0) {
                html += `<div class="relationships-section">`;
                html += `<h4>🔗 Relationships</h4>`;
                html += `<ul class="relationship-list">`;
                
                tableRelationships.forEach(rel => {
                    html += `<li>`;
                    html += `<strong>${escapeHTML(rel.from)}</strong>`;
                    html += `<span class="relationship-arrow">→</span>`;
                    html += `<strong>${escapeHTML(rel.to)}</strong>`;
                    html += ` (${escapeHTML(rel.fromColumn)} → ${escapeHTML(rel.toColumn)})`;
                    html += ` <em>[${escapeHTML(rel.type)}]</em>`;
                    html += `</li>`;
                });
                
                html += `</ul></div>`;
            }
        }
        
        html += `</div>`;
    });
    
    html += '</div>';
    return html;
}

/**
 * Export as HTML file
 */
function exportAsHTML() {
    if (!currentSchema) {
        showError('Please generate a dictionary first');
        return;
    }
    
    const output = document.getElementById('dictionaryOutput');
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Dictionary - ${escapeHTML(currentSchema.database)}</title>
    <style>
        ${getExportCSS()}
    </style>
</head>
<body>
    ${output.innerHTML}
</body>
</html>
    `;
    
    downloadFile(htmlContent, `${currentSchema.database}_data_dictionary.html`, 'text/html');
}

/**
 * Export as PDF
 */
async function exportAsPDF() {
    if (!currentSchema) {
        showError('Please generate a dictionary first');
        return;
    }
    
    try {
        const { jsPDF } = window.jspdf;
        const output = document.getElementById('dictionaryOutput');
        
        // Create a temporary container for better PDF rendering
        const tempDiv = document.createElement('div');
        tempDiv.style.width = '800px';
        tempDiv.style.padding = '20px';
        tempDiv.style.background = 'white';
        tempDiv.innerHTML = output.innerHTML;
        document.body.appendChild(tempDiv);
        
        // Capture as canvas
        const canvas = await html2canvas(tempDiv, {
            scale: 2,
            backgroundColor: '#ffffff'
        });
        
        // Remove temp div
        document.body.removeChild(tempDiv);
        
        // Create PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;
        
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save(`${currentSchema.database}_data_dictionary.pdf`);
        
    } catch (error) {
        showError('Error generating PDF: ' + error.message);
    }
}

/**
 * Get CSS for HTML export
 */
function getExportCSS() {
    return `
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        .db-info { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; text-align: center; }
        .db-stats { display: flex; justify-content: center; gap: 30px; margin-top: 20px; }
        .stat-item { text-align: center; }
        .stat-value { font-size: 2rem; font-weight: bold; display: block; }
        .stat-label { font-size: 0.9rem; }
        .toc { background: white; padding: 20px; border-radius: 10px; margin-bottom: 30px; }
        .toc h3 { color: #1e3c72; margin-bottom: 15px; }
        .toc-list { list-style: none; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
        .toc-list li a { color: #2a5298; text-decoration: none; padding: 8px 12px; display: block; border-radius: 5px; }
        .er-diagram { background: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
        .diagram-container { display: flex; flex-wrap: wrap; gap: 30px; justify-content: center; padding: 20px; background: #f8f9fa; border-radius: 10px; }
        .table-node { background: white; border: 2px solid #2a5298; border-radius: 10px; padding: 15px; min-width: 250px; }
        .table-node-header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 10px 15px; border-radius: 5px; margin-bottom: 10px; font-weight: bold; }
        .column-item { padding: 5px 10px; border-bottom: 1px solid #eee; font-size: 0.9rem; }
        .column-item.primary-key { background: #fff3cd; font-weight: bold; }
        .column-item.foreign-key { background: #d1ecf1; }
        .table-details { margin-bottom: 40px; page-break-inside: avoid; }
        .table-header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
        .columns-table { width: 100%; border-collapse: collapse; background: white; }
        .columns-table th { background: #f8f9fa; color: #1e3c72; padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #dee2e6; }
        .columns-table td { padding: 12px; border-bottom: 1px solid #dee2e6; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 3px; font-size: 0.75rem; font-weight: bold; margin-right: 5px; }
        .badge-primary { background: #007bff; color: white; }
        .badge-warning { background: #ffc107; color: #333; }
        .relationships-section { margin-top: 15px; padding: 15px; background: #e7f3ff; border-left: 4px solid #2196f3; border-radius: 5px; }
        .relationship-list { list-style: none; }
    `;
}

/**
 * Clear all inputs and outputs
 */
function clearAll() {
    document.getElementById('schemaInput').value = '';
    document.getElementById('fileUpload').value = '';
    document.getElementById('sampleSelect').value = '';
    document.getElementById('outputSection').style.display = 'none';
    currentSchema = null;
    hideError();
}

/**
 * Show error message
 */
function showError(message) {
    const errorDisplay = document.getElementById('errorDisplay');
    errorDisplay.innerHTML = `<h3>⚠️ Error</h3><p>${escapeHTML(message)}</p>`;
    errorDisplay.style.display = 'block';
    errorDisplay.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Hide error message
 */
function hideError() {
    document.getElementById('errorDisplay').style.display = 'none';
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Download file helper
 */
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}



