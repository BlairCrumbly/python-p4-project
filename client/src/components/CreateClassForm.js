import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createClass } from "../Auth";  // Import the function to create a class

// Yup validation schema
const validationSchema = Yup.object({
  name: Yup.string().required("Class name is required"),
  description: Yup.string().required("Class description is required"),
});

export default function CreateClassForm() {
  const [message, setMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const data = await createClass(values);  // Call createClass function to create a class
        if (data.id) {
          setMessage("Class created successfully!");  // Success message
        } else {
          setMessage(data.message || "Failed to create class.");
        }
      } catch (error) {
        setMessage("Error creating class");  // Error handling
      }
    },
  });

  return (
    <div>
      <h2>Create New Class</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Class Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <p>{formik.errors.name}</p>  // Show validation error if any
          )}
        </div>

        <div>
          <textarea
            id="description"
            name="description"
            placeholder="Class Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.description && formik.errors.description && (
            <p>{formik.errors.description}</p>  // Show validation error if any
          )}
        </div>

        <button type="submit">Create Class</button>
      </form>

      {message && <p>{message}</p>}  // Display success or error message
    </div>
  );
}
