import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  InputAdornment,
  Paper,
  Chip,
  Stack
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const useStyles = makeStyles({
  fieldContainer: {
    marginBottom: '16px',
    position: 'relative',
  },
  fieldLabel: {
    color: '#666',
    marginBottom: '4px',
    fontSize: '0.875rem',
  },
  fieldValue: {
    fontWeight: '500',
    padding: '8px 0',
    minHeight: '30px',
    display: 'flex',
    alignItems: 'center',
  },
  readOnlyContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editButton: {
    marginLeft: '8px',
    padding: '4px',
  },
  editableWrapper: {
    borderRadius: '4px',
    padding: '8px',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  disabledField: {
    color: '#999',
    fontStyle: 'italic',
  },
  requiredMark: {
    color: '#f44336',
    marginLeft: '2px',
  },
  editModeContainer: {
    marginTop: '4px',
  },
  fieldActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '8px',
  },
  actionButton: {
    marginLeft: '8px',
    padding: '4px',
  },
  skillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  chip: {
    margin: '4px 4px 4px 0',
  },
  placeholder: {
    color: '#999',
    fontStyle: 'italic',
  }
});

const EditableProfileField = ({
  label,
  value,
  name,
  type = 'text',
  placeholder = 'Not specified',
  required = false,
  disabled = false,
  editable = true,
  canEdit = false,
  onSave,
  options = [],
  multiline = false,
  rows = 1,
  children
}) => {
  const classes = useStyles();
  const [isEditing, setIsEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);
  const [initialValue, setInitialValue] = useState(value);

  // Update field value when prop changes
  useEffect(() => {
    setFieldValue(value);
    setInitialValue(value);
  }, [value]);

  const handleStartEdit = () => {
    if (canEdit && editable) {
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setFieldValue(initialValue);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFieldValue(e.target.value);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(name, fieldValue);
    }
    setInitialValue(fieldValue);
    setIsEditing(false);
  };

  // For skills (chip array display)
  const renderSkillsDisplay = () => {
    if (!value || value.length === 0) {
      return <Typography className={classes.placeholder}>{placeholder}</Typography>;
    }

    // Split skills string into array
    const skills = typeof value === 'string' ? value.split(',').map(s => s.trim()) : value;

    return (
      <Box className={classes.skillsContainer}>
        {skills.map((skill, index) => (
          <Chip
            key={index}
            label={skill}
            className={classes.chip}
            color="primary"
            variant="outlined"
            size="small"
          />
        ))}
      </Box>
    );
  };

  // Content based on read-only vs editable mode
  const renderContent = () => {
    // If we have custom children, render those
    if (children) {
      return children;
    }

    // Handle special case for Skills field
    if (name === 'skills') {
      return renderSkillsDisplay();
    }

    // Default display value
    if (!value) {
      return <Typography className={classes.placeholder}>{placeholder}</Typography>;
    }

    return (
      <Typography 
        className={`${classes.fieldValue} ${disabled ? classes.disabledField : ''}`}
      >
        {value}
      </Typography>
    );
  };

  return (
    <Box className={classes.fieldContainer}>
      <Typography variant="body2" className={classes.fieldLabel}>
        {label}
        {required && <span className={classes.requiredMark}>*</span>}
      </Typography>

      {isEditing ? (
        <Box className={classes.editModeContainer}>
          <TextField
            fullWidth
            name={name}
            value={fieldValue || ''}
            onChange={handleChange}
            variant="outlined"
            size="small"
            type={type}
            multiline={multiline}
            rows={rows}
            select={options.length > 0}
            SelectProps={{ native: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    edge="end" 
                    onClick={handleSave}
                    size="small"
                    color="primary"
                  >
                    <SaveIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          >
            {options.length > 0 && (
              <>
                <option value="">Select {label}</option>
                {options.map((option) => (
                  <option key={option.value || option} value={option.value || option}>
                    {option.label || option}
                  </option>
                ))}
              </>
            )}
          </TextField>

          <Box className={classes.fieldActions}>
            <Tooltip title="Cancel">
              <IconButton 
                onClick={handleCancelEdit} 
                className={classes.actionButton} 
                size="small"
                color="default"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Save">
              <IconButton 
                onClick={handleSave} 
                className={classes.actionButton} 
                size="small"
                color="primary"
              >
                <CheckIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      ) : (
        <Box 
          className={`${classes.readOnlyContainer} ${canEdit && editable ? classes.editableWrapper : ''}`}
          onClick={handleStartEdit}
        >
          <Box flex="1">
            {renderContent()}
          </Box>
          
          {canEdit && editable && !disabled && (
            <Tooltip title="Edit">
              <IconButton 
                className={classes.editButton} 
                size="small"
                color="primary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}
    </Box>
  );
};

export default EditableProfileField;