import React, { useEffect, useState } from "react";
import {
  addBook,
  updateBook,
  getBookById,
} from "../../../services/bookService";
import { useParams, useNavigate } from "react-router-dom";

const AddOrUpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    image: "",
    "old-price": null,
    "new-price": 0,
    discountPercent: 0,
    category: "",
    rating: "",
    rating_count: 0,
    sold: 0,
    stock: "",
  });

  const fetchBookDetails = async () => {
    setLoading(true);
    try {
      const bookData = await getBookById(id);
      setFormData(bookData);
      setImagePreview(bookData.image);
    } catch (err) {
      console.error("Error fetching book details:", err);
      alert("Cannot get detail of this book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchBookDetails();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      name === "new-price" ||
      name === "stock" ||
      name === "discountPercent"
    ) {
      const numberValue = value === "" ? "" : Number(value);
      setFormData({
        ...formData,
        [name]: numberValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({
          ...formData,
          image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (event) => {
    setImagePreview(event.target.value);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Vui lòng nhập tên sách";
    if (!formData.author.trim()) newErrors.author = "Vui lòng nhập tên tác giả";
    if (!formData.category) newErrors.category = "Vui lòng chọn thể loại";

    if (
      formData["new-price"] === "" ||
      isNaN(formData["new-price"]) ||
      formData["new-price"] < 0
    ) {
      newErrors["new-price"] = "Vui lòng nhập giá hợp lệ";
    }

    if (formData.stock === "" || isNaN(formData.stock) || formData.stock < 0) {
      newErrors.stock = "Vui lòng nhập số lượng tồn kho hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const newPrice =
        (formData["new-price"] * (100 - formData.discountPercent)) / 100;

      const updatedFormData = {
        ...formData,
        ["new-price"]: newPrice,
        ...(formData.discountPercent !== 0 && {
          "old-price": formData["new-price"],
        }),
      };
      if (isEditMode) {
        await updateBook(id, updatedFormData);
        alert("Update book successfully!");
      } else {
        await addBook(updatedFormData);
        alert("Add new book successfully!");
      }
      navigate("/admin/books");
    } catch (err) {
      console.error("Error saving book:", err);
      alert(`Cannot ${isEditMode ? "update" : "add"} book. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h2 className="card-title h5 mb-0">
            {isEditMode ? "Chỉnh sửa sách" : "Thêm sách mới"}
          </h2>
        </div>

        <div className="card-body">
          {loading && !isEditMode ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-8">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="title" className="form-label">
                        Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.title ? "is-invalid" : ""
                        }`}
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                      />
                      {errors.title && (
                        <div className="invalid-feedback">{errors.title}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="author" className="form-label">
                        Author <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.author ? "is-invalid" : ""
                        }`}
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                      />
                      {errors.author && (
                        <div className="invalid-feedback">{errors.author}</div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="discountPercent" className="form-label">
                        Discount (%)<span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className={`form-control ${
                          errors.discountPercent ? "is-invalid" : ""
                        }`}
                        id="discountPercent"
                        name="discountPercent"
                        value={formData.discountPercent}
                        onChange={handleChange}
                      />
                      {errors.discountPercent && (
                        <div className="invalid-feedback">
                          {errors.discountPercent}
                        </div>
                      )}
                    </div>

                    <div className="col-md">
                      <label htmlFor="category" className="form-label">
                        Category <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.category ? "is-invalid" : ""
                        }`}
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                      />

                      {errors.category && (
                        <div className="invalid-feedback">
                          {errors.category}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md">
                      <label htmlFor="new-price" className="form-label">
                        Price with no discount (VNĐ){" "}
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className={`form-control ${
                          errors["new-price"] ? "is-invalid" : ""
                        }`}
                        id="new-price"
                        name="new-price"
                        min="0"
                        step="1000"
                        value={formData["new-price"]}
                        onChange={handleChange}
                      />
                      {errors["new-price"] && (
                        <div className="invalid-feedback">
                          {errors["new-price"]}
                        </div>
                      )}
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="stock" className="form-label">
                        Stock <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className={`form-control ${
                          errors.stock ? "is-invalid" : ""
                        }`}
                        id="stock"
                        name="stock"
                        min="0"
                        value={formData.stock}
                        onChange={handleChange}
                      />
                      {errors.stock && (
                        <div className="invalid-feedback">{errors.stock}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Book image preview</label>
                  <div className="card">
                    <div className="card-body text-center">
                      <div className="mb-3">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Book image"
                            className="img-fluid mb-2"
                            style={{ maxHeight: "200px" }}
                          />
                        ) : (
                          <div
                            className="border d-flex align-items-center justify-content-center bg-light"
                            style={{ height: "200px" }}
                          >
                            <p className="text-muted">Have no image</p>
                          </div>
                        )}
                      </div>
                      <div className="input-group">
                        <input
                          type="file"
                          className="form-control"
                          id="image"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </div>
                      <small className="form-text text-muted">
                        Support format: JPG, PNG. Max 2MB.
                      </small>
                      <div className="form-text text-muted">Or</div>
                      <div className="input-group">
                        <input
                          type="text"
                          name="image"
                          className="form-control"
                          id="image"
                          value={formData.image}
                          onChange={handleUrlChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate("/admin/books")}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-1"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Saving...
                    </>
                  ) : isEditMode ? (
                    "Update"
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddOrUpdateBook;
