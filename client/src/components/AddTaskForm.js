import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AddTaskForm = () => {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("/classes", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        setClasses(data);
      } catch (error) {
        setError("Error fetching classes");
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  // Yup Validation Schema
  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string(),
    dueDate: Yup.date().required('Due date is required'),
    className: Yup.string().required('Class is required'),
  });

  const handleSubmit = async (values) => {
    try {
      const csrfToken = getCookie("csrf_access_token");
      const classData = classes.find((klass) => klass.name === values.className);
      if (!classData) {
        setError("Class not found.");
        return;
      }

      const dueDateWithTime = `${values.dueDate}T00:00:00`;

      const taskData = {
        title: values.title,
        description: values.description,
        due_date: dueDateWithTime,
        class_id: classData.id,
      };

      const requestHeaders = {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await fetch("/tasks", {
        method: "POST",
        headers: requestHeaders,
        credentials: "include",
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();
      navigate(`/tasks/${newTask.class_id}`);
    } catch (error) {
      setError(error.message);
      console.error("Error adding task:", error);
    }
  };

  return (
    <div>
      <h1>Add New Task</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Formik
        initialValues={{
          title: '',
          description: '',
          dueDate: '',
          className: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div>
            <label htmlFor="title">Task Title:</label>
            <Field
              type="text"
              id="title"
              name="title"
              required
            />
            <ErrorMessage name="title" component="div" style={{ color: 'red' }} />
          </div>

          <div>
            <label htmlFor="description">Description:</label>
            <Field
              as="textarea"
              id="description"
              name="description"
            />
          </div>

          <div>
            <label htmlFor="dueDate">Due Date:</label>
            <Field
              type="date"
              id="dueDate"
              name="dueDate"
              required
            />
            <ErrorMessage name="dueDate" component="div" style={{ color: 'red' }} />
          </div>

          <div>
            <label htmlFor="className">Class:</label>
            <Field as="select" id="className" name="className" required>
              <option value="">Select a class</option>
              {classes.map((klass) => (
                <option key={klass.id} value={klass.name}>
                  {klass.name}
                </option>
              ))}
            </Field>
            <ErrorMessage name="className" component="div" style={{ color: 'red' }} />
          </div>

          <div>
            <button type="submit">Add Task</button>
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

export default AddTaskForm;
