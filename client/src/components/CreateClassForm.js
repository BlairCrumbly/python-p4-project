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
  const [loading, setLoading] = useState(false); // Loading state for form submission

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);  // Set loading to true
        const data = await createClass(values);  // Call createClass function to create a class
        if (data.id) {
          setMessage("Class created successfully!");  // Success message
        } else {
          setMessage(data.message || "Failed to create class.");
        }
      } catch (error) {
        setMessage("Error creating class: " + error.message);  // Show detailed error message
      } finally {
        setLoading(false);  // Reset loading state
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
            disabled={loading}  // Disable input during loading
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
            disabled={loading}  // Disable input during loading
          />
          {formik.touched.description && formik.errors.description && (
            <p>{formik.errors.description}</p>  // Show validation error if any
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Class"}  // Show loading text on button
        </button>
      </form>

      {message && <p>{message}</p>}  // Display success or error message
    </div>
  );
}
