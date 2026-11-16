import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { createProduct } from '../../redux/adminProductSlice'

// Turns "S, M, L" into ["S", "M", "L"]
const toList = (text) => text.split(",").map((item) => item.trim()).filter(Boolean);

const AddProductPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        countInStock: "",
        sku: "",
        category: "Top Wear",
        collections: "",
        gender: "Men",
        brand: "",
        material: "",
        sizes: "",   // typed like: S, M, L
        colors: "",  // typed like: Red, Blue
        images: [],
    });
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({ ...prev, [name]: value }));
    };

    // Upload one image to Cloudinary (same API the Edit page uses)
    const handleImageFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("image", file);
        try {
            setUploading(true);
            setError("");
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setProductData((prev) => ({
                ...prev,
                images: [...prev.images, { url: data.imageUrl, altText: prev.name }],
            }));
        } catch (err) {
            console.error(err);
            setError("Image upload failed. Please try again.");
        } finally {
            setUploading(false);
            e.target.value = ""; // lets you pick the same file again
        }
    };

    const removeImage = (index) => {
        setProductData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const sizes = toList(productData.sizes);
        const colors = toList(productData.colors);
        if (sizes.length === 0 || colors.length === 0) {
            setError("Please enter at least one size and one color.");
            return;
        }
        if (productData.images.length === 0) {
            setError("Please upload at least one image.");
            return;
        }

        try {
            setSaving(true);
            await dispatch(createProduct({
                ...productData,
                price: Number(productData.price),
                discountPrice: productData.discountPrice ? Number(productData.discountPrice) : undefined,
                countInStock: Number(productData.countInStock) || 0,
                sizes,
                colors,
            })).unwrap();
            navigate("/admin/products");
        } catch (err) {
            console.error(err);
            setError("Could not add the product. Check that the SKU is not already used.");
        } finally {
            setSaving(false);
        }
    };

    const labelClass = 'block font-semibold mb-2';
    const inputClass = 'w-full border border-gray-300 rounded-md p-2';

    return (
        <div className='max-w-5xl mx-auto p-4 md:p-6 shadow-md rounded-md bg-white'>
            <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl md:text-3xl font-bold'>Add New Product</h2>
                <Link to="/admin/products" className='text-blue-500 hover:underline'>Back</Link>
            </div>

            <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6'>
                    {/* name */}
                    <div className='mb-6 md:col-span-2'>
                        <label className={labelClass}>Product Name *</label>
                        <input type="text" name='name' value={productData.name} onChange={handleChange}
                            className={inputClass} required />
                    </div>

                    {/* description */}
                    <div className='mb-6 md:col-span-2'>
                        <label className={labelClass}>Description *</label>
                        <textarea name='description' rows={4} value={productData.description} onChange={handleChange}
                            className={inputClass} required />
                    </div>

                    {/* price */}
                    <div className='mb-6'>
                        <label className={labelClass}>Price (₹) *</label>
                        <input type="number" name='price' min="0" step="0.01" value={productData.price} onChange={handleChange}
                            className={inputClass} required />
                    </div>

                    {/* discount price */}
                    <div className='mb-6'>
                        <label className={labelClass}>Discount Price (₹)</label>
                        <input type="number" name='discountPrice' min="0" step="0.01" value={productData.discountPrice} onChange={handleChange}
                            className={inputClass} />
                    </div>

                    {/* stock */}
                    <div className='mb-6'>
                        <label className={labelClass}>Count in Stock</label>
                        <input type="number" name='countInStock' min="0" value={productData.countInStock} onChange={handleChange}
                            className={inputClass} />
                    </div>

                    {/* SKU */}
                    <div className='mb-6'>
                        <label className={labelClass}>SKU * (must be unique)</label>
                        <input type="text" name='sku' placeholder='e.g. TW-M-010' value={productData.sku} onChange={handleChange}
                            className={inputClass} required />
                    </div>

                    {/* category */}
                    <div className='mb-6'>
                        <label className={labelClass}>Category *</label>
                        <select name='category' value={productData.category} onChange={handleChange} className={inputClass}>
                            <option value="Top Wear">Top Wear</option>
                            <option value="Bottom Wear">Bottom Wear</option>
                        </select>
                    </div>

                    {/* gender */}
                    <div className='mb-6'>
                        <label className={labelClass}>Gender</label>
                        <select name='gender' value={productData.gender} onChange={handleChange} className={inputClass}>
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Unisex">Unisex</option>
                        </select>
                    </div>

                    {/* collection */}
                    <div className='mb-6'>
                        <label className={labelClass}>Collection *</label>
                        <input type="text" name='collections' placeholder='e.g. Casual Wear' value={productData.collections} onChange={handleChange}
                            className={inputClass} required />
                    </div>

                    {/* brand */}
                    <div className='mb-6'>
                        <label className={labelClass}>Brand</label>
                        <input type="text" name='brand' value={productData.brand} onChange={handleChange}
                            className={inputClass} />
                    </div>

                    {/* material */}
                    <div className='mb-6 md:col-span-2'>
                        <label className={labelClass}>Material</label>
                        <input type="text" name='material' placeholder='e.g. Cotton' value={productData.material} onChange={handleChange}
                            className={inputClass} />
                    </div>

                    {/* sizes */}
                    <div className='mb-6'>
                        <label className={labelClass}>Sizes * (comma-separated)</label>
                        <input type="text" name='sizes' placeholder='S, M, L, XL' value={productData.sizes} onChange={handleChange}
                            className={inputClass} required />
                    </div>

                    {/* colors */}
                    <div className='mb-6'>
                        <label className={labelClass}>Colors * (comma-separated)</label>
                        <input type="text" name='colors' placeholder='Red, Blue, Black' value={productData.colors} onChange={handleChange}
                            className={inputClass} required />
                    </div>
                </div>

                {/* image upload */}
                <div className='mb-6'>
                    <label className={labelClass}>Images * (upload one or more)</label>
                    <input type="file" accept="image/*" onChange={handleImageFile} className='block w-full text-sm' />
                    {uploading && <p className='text-sm text-gray-500 mt-2'>Uploading image...</p>}
                    <div className='flex flex-wrap gap-4 mt-4'>
                        {productData.images.map((img, index) => (
                            <div key={index} className='relative'>
                                <img src={img.url} alt={img.altText || "product"}
                                    className='w-20 h-20 object-cover rounded-md shadow-md' />
                                <button type='button' onClick={() => removeImage(index)}
                                    className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm'
                                    aria-label='Remove image'>
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {error && <p className='text-red-500 mb-4'>{error}</p>}

                <button type='submit' disabled={saving || uploading}
                    className='w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50'>
                    {saving ? "Adding..." : "Add Product"}
                </button>
            </form>
        </div>
    )
}

export default AddProductPage