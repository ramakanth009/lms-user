// src/services/AssessmentService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const AssessmentService = {
  /**
   * Get all assessments for the current user
   * @returns {Promise} Promise with assessment data
   */
  getMyAssessments: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/student/my_assessments/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching assessments:', error);
      throw error;
    }
  },

  /**
   * Submit an assessment
   * @param {number} assessmentId - ID of the assessment to submit
   * @param {Object} answers - Answers object with question indices as keys
   * @returns {Promise} Promise with submission results
   */
  submitAssessment: async (assessmentId, answers) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${API_URL}/assessments/${assessmentId}/submit/`,
        { answers },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error submitting assessment:', error);
      throw error;
    }
  },

  /**
   * Get assessment details
   * @param {number} assessmentId - ID of the assessment
   * @returns {Promise} Promise with assessment details
   */
  getAssessmentById: async (assessmentId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/assessments/${assessmentId}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching assessment ${assessmentId}:`, error);
      throw error;
    }
  },

  /**
   * Get reports for all completed assessments
   * @returns {Promise} Promise with reports data
   */
  getAssessmentReports: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/student/student_dashboard/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching assessment reports:', error);
      throw error;
    }
  }
};

export default AssessmentService;