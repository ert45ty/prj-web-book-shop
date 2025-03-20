import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const [registerError, setRegisterError] = useState("");
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    username: Yup.string()
      .required("Username is required")
      .min(4, "Username must be at least 4 characters"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Password does not match")
      .required("Please confirm password"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 characters")
      .required("Phone number is required"),
    address: Yup.string().required("Address is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setRegisterError("");
      const { confirmPassword, ...registerData } = values;
      await register({ ...registerData, role: "USER" });

      await login(values.username, values.password);

      navigate("/");
    } catch (error) {
      setRegisterError(
        error.response?.data?.message || "Register fail. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Register</h2>

              {registerError && (
                <div className="alert alert-danger" role="alert">
                  {registerError}
                </div>
              )}

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="name" className="form-label">
                          Your name
                        </label>
                        <Field
                          type="text"
                          name="name"
                          className="form-control"
                          placeholder="Type your name..."
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="username" className="form-label">
                          Username
                        </label>
                        <Field
                          type="text"
                          name="username"
                          className="form-control"
                          placeholder="Type your username..."
                        />
                        <ErrorMessage
                          name="username"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <Field
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Type your email..."
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="password" className="form-label">
                          Password
                        </label>
                        <Field
                          type="password"
                          name="password"
                          className="form-control"
                          placeholder="Type password"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="confirmPassword" className="form-label">
                          Re-password
                        </label>
                        <Field
                          type="password"
                          name="confirmPassword"
                          className="form-control"
                          placeholder="type re-password"
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="phone" className="form-label">
                          Phone number
                        </label>
                        <Field
                          type="text"
                          name="phone"
                          className="form-control"
                          placeholder="Type your phone number..."
                        />
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="address" className="form-label">
                          Address
                        </label>
                        <Field
                          type="text"
                          name="address"
                          className="form-control"
                          placeholder="Type your address..."
                        />
                        <ErrorMessage
                          name="address"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    <div className="d-grid gap-2 mt-3">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : null}
                        Register
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>

              <div className="text-center mt-3">
                <p>
                  Had account? <Link to="/login">Login</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
