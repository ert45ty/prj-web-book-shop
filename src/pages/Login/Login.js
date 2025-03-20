import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [loginError, setLoginError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .min(4, "Username must be at least 4 characters"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoginError("");
      await login(values.username, values.password);
      navigate("/");
    } catch (error) {
      setLoginError(
        error.response?.data?.message || "Login fail. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Login</h2>

              {loginError && (
                <div className="alert alert-danger" role="alert">
                  {loginError}
                </div>
              )}

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">
                        Username
                      </label>
                      <Field
                        type="text"
                        name="username"
                        className="form-control"
                        placeholder="Type your username"
                      />
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <Field
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Type your password"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    <div className="d-grid gap-2">
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
                        Login
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>

              <div className="text-center mt-3">
                <p>
                  Dont have a account? <Link to="/register">Register now</Link>
                </p>
                <p>
                  <Link to="/forgot-password">Forgot password?</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
