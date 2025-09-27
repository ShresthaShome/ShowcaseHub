"use client";

import { appHook } from "@/context/AppProvider";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

interface ProductType {
  id?: number;
  title: string;
  description?: string;
  cost?: number;
  banner_image?: string;
  banner_file?: File | null;
}

export default function page() {
  const { isLoading, authToken } = appHook();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [products, setProducts] = useState<ProductType[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<ProductType>({
    title: "",
    description: "",
    cost: 0,
    banner_image: "",
    banner_file: null,
  });

  useEffect(() => {
    if (!authToken) {
      router.push("/auth");
      return;
    }

    fetchAllProducts();
  }, [authToken]);

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        banner_file: e.target.files[0],
        banner_image: URL.createObjectURL(e.target.files[0]),
      });
    } else setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isEditing) {
        const response = await axios.post(
          `${API_URL}/products/${formData.id}`,
          { ...formData, _method: "PUT" },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.status) {
          toast.success(response.data.message);
        }

        setIsEditing(false);
      } else {
        const response = await axios.post(`${API_URL}/products`, formData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.status) {
          toast.success(response.data.message);
        }
      }

      setFormData({
        title: "",
        description: "",
        cost: 0,
        banner_image: "",
        banner_file: null,
      });

      if (fileRef.current) fileRef.current.value = "";

      fetchAllProducts();
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${API_URL}/products/${id}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          if (response.data.status) {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });

            toast.success(response.data.message);
            fetchAllProducts();
          }
        } catch (error) {
          console.error("Error deleting product: ", error);
        }
      }
    });
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-5">
          <div className="card p-4">
            <h4>{isEditing ? "Edit" : "Add"} Product</h4>

            <form onSubmit={handleFormSubmit}>
              <input
                className="form-control mb-2"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleOnChange}
                required
              />

              <input
                className="form-control mb-2"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleOnChange}
                required
              />

              <input
                className="form-control mb-2"
                name="cost"
                placeholder="Cost"
                value={formData.cost}
                onChange={handleOnChange}
                type="number"
                required
              />

              <div className="mb-2">
                {formData.banner_image && (
                  <Image
                    src={formData.banner_image}
                    alt="Preview"
                    id="bannerPreview"
                    width={100}
                    height={100}
                  />
                )}
              </div>

              <input
                aria-label="Banner Input"
                className="form-control mb-2"
                type="file"
                ref={fileRef}
                onChange={handleOnChange}
                id="bannerInput"
              />

              <button className="btn btn-primary" type="submit">
                {isEditing ? "Update" : "Add"} Product
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-6">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Banner</th>
                <th>Cost</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={`product-${product.id}`}>
                  <td>{index + 1}</td>
                  <td>{product.title}</td>
                  <td>
                    {product.banner_image ? (
                      <Image
                        src={product.banner_image}
                        alt="Product"
                        width={50}
                        height={50}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>${product.cost}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => {
                        setFormData({
                          id: product.id,
                          title: product.title,
                          description: product.description,
                          cost: product.cost,
                          banner_file: null,
                          banner_image: product.banner_image || "",
                        });

                        if (fileRef.current) fileRef.current.value = "";

                        setIsEditing(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteProduct(product.id!)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
