import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiService = {
  // Health check
  async healthCheck() {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend server is not responding');
    }
  },

  // Generate report
  async generateReport(reportType, formData, customFilename = null) {
    try {
      const response = await apiClient.post('/generate-report', {
        reportType,
        formData,
        filename: customFilename,
      }, {
        responseType: 'blob', // Important for file download
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Set filename based on custom name or default
      const extension = reportType === 'pdf' ? 'pdf' : reportType === 'docx' ? 'docx' : 'xlsx';
      const filename = customFilename
        ? `${customFilename}.${extension}`
        : `report_${Date.now()}.${extension}`;
      link.setAttribute('download', filename);

      // Trigger download
      document.body.appendChild(link);
      link.click();
      link.remove();

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error('Failed to generate report. Please try again.');
      } else if (error.request) {
        throw new Error('Cannot connect to server. Please check if the backend is running.');
      } else {
        throw new Error('An unexpected error occurred.');
      }
    }
  },

  // Get available templates
  async getTemplates() {
    try {
      const response = await apiClient.get('/templates');
      return response.data.templates;
    } catch (error) {
      throw new Error('Failed to fetch templates');
    }
  },
};

export default apiService;
