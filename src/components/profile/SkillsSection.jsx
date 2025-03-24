import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Add as AddIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';

const useStyles = makeStyles({
  skillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
    marginBottom: '16px',
  },
  chip: {
    margin: '4px 4px 4px 0',
  },
  placeholder: {
    color: '#666',
    fontStyle: 'italic',
    marginTop: '8px',
  },
  editContainer: {
    marginTop: '16px',
  },
  newSkillInput: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
  },
  skillInput: {
    marginRight: '8px',
    flex: 1,
  },
  editButton: {
    marginBottom: '16px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '16px',
  },
  editMode: {
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    padding: '16px',
    backgroundColor: '#f9f9f9',
  }
});

const SkillsSection = ({ 
  skills, 
  canUpdateProfile = false,
  onProfileUpdated = () => {}
}) => {
  const classes = useStyles();
  const [isEditing, setIsEditing] = useState(false);
  const [skillsList, setSkillsList] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [originalSkills, setOriginalSkills] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Initialize skills list from props
  useEffect(() => {
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim()).filter(Boolean);
      setSkillsList(skillsArray);
      setOriginalSkills(skills);
    }
  }, [skills]);

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    // Reset to original skills
    if (originalSkills) {
      const skillsArray = originalSkills.split(',').map(skill => skill.trim()).filter(Boolean);
      setSkillsList(skillsArray);
    } else {
      setSkillsList([]);
    }
    setNewSkill('');
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
      setSkillsList(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillsList(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSaveSkills = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      // Create payload with updated skills
      const updatedSkills = skillsList.join(', ');
      
      // Don't update if nothing changed
      if (updatedSkills === originalSkills) {
        setIsEditing(false);
        return;
      }
      
      // Prepare minimal payload
      const payload = {
        skills: updatedSkills
      };
      
      // Make sure we include required fields if needed by your API
      if (originalSkills) {
        // This is an existing profile, just update skills
        const response = await axios.put(
          'http://localhost:8000/api/student/update_profile/',
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (response.data && response.data.data) {
          // Update original skills
          setOriginalSkills(updatedSkills);
          
          // Call parent callback
          onProfileUpdated(response.data.data);
          
          // Show success message
          setSnackbar({
            open: true,
            message: 'Skills updated successfully!',
            severity: 'success'
          });
        }
      }
      
      // Exit edit mode
      setIsEditing(false);
      
    } catch (error) {
      console.error('Error updating skills:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to update skills. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box>
      {isEditing ? (
        <Box className={classes.editMode}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Add or remove skills related to your preferred role and career goals
          </Typography>
          
          <Box className={classes.newSkillInput}>
            <TextField
              className={classes.skillInput}
              placeholder="Add a skill (e.g., Python, JavaScript)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddSkill}
              disabled={!newSkill.trim()}
            >
              Add
            </Button>
          </Box>
          
          <Box className={classes.skillsContainer}>
            {skillsList.length > 0 ? (
              skillsList.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
                  className={classes.chip}
                  color="primary"
                  variant="outlined"
                />
              ))
            ) : (
              <Typography className={classes.placeholder}>
                No skills added yet. Add some skills to showcase your expertise.
              </Typography>
            )}
          </Box>
          
          <Box className={classes.buttonGroup}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleCancelEditing}
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveSkills}
              startIcon={<SaveIcon />}
            >
              Save Skills
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            {canUpdateProfile && (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                className={classes.editButton}
                onClick={handleStartEditing}
                startIcon={<EditIcon />}
              >
                Edit Skills
              </Button>
            )}
          </Box>
          
          <Box className={classes.skillsContainer}>
            {skillsList.length > 0 ? (
              skillsList.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  className={classes.chip}
                  color="primary"
                  variant="outlined"
                />
              ))
            ) : (
              <Typography className={classes.placeholder}>
                No skills added yet
              </Typography>
            )}
          </Box>
        </Box>
      )}
      
      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SkillsSection;