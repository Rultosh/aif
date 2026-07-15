export const secureDownload = async (url: string, filename: string, body?: any) => {
    try {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
            'Authorization': `Bearer ${token}`
        };
        
        let response;
        if (body) {
            headers['Content-Type'] = 'application/json';
            response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });
        } else {
            response = await fetch(url, {
                method: 'GET',
                headers
            });
        }

        if (!response.ok) {
            throw new Error('Download failed');
        }

        // Try to get filename from Content-Disposition header
        let finalFilename = filename;
        const disposition = response.headers.get('Content-Disposition');
        if (disposition && disposition.indexOf('filename=') !== -1) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) { 
                finalFilename = matches[1].replace(/['"]/g, '');
            }
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = finalFilename;
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
    } catch (error) {
        console.error('Error during secure download:', error);
        alert('Failed to download file. Please try again.');
    }
};
