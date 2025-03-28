import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import "../styles/CreateClassForm.css";

const CreateClassForm = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Yup Validation Schema
  const validationSchema = Yup.object({
    className: Yup.string()
      .required('Class name is required')
      .min(3, 'Class name must be at least 3 characters'), 
    description: Yup.string()
      .max(200, 'Description must be less than 200 characters') 
  });

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const csrfToken = getCookie('csrf_access_token');
      const classData = {
        name: values.className,
        description: values.description,
      };

      const requestHeaders = {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };

      const response = await fetch('/classes', {
        method: 'POST',
        headers: requestHeaders,
        credentials: 'include',
        body: JSON.stringify(classData),
      });

      // Check if the response is OK
      if (!response.ok) {
        setError('');
        return;
      }

      // Try parsing JSON if the response is OK
      try {
        const newClass = await response.json();
        navigate(`/classes/${newClass.id}`);
      } catch (jsonError) {
        setError('Failed to parse server response');
      }
    } catch (error) {
      setError('An error occurred while creating the class');
    }
  };

  return (
    <div className="container">
      <h1>Create New Class</h1>
      {error && <p className="error-message">{error}</p>}
      <Formik
        initialValues={{
          className: '',
          description: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="form-group">
            <label htmlFor="className">Class Name:</label>
            <Field
              type="text"
              id="className"
              name="className"
              className="form-input"
              required
            />
            <ErrorMessage name="className" component="div" className="error-message" />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <Field
              as="textarea"
              id="description"
              name="description"
              className="form-input"
            />
            <ErrorMessage name="description" component="div" className="error-message" />
          </div>

          <div>
            <button type="submit" className="submit-button">Create Class</button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

// Helper function to get the CSRF token from cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default CreateClassForm;
