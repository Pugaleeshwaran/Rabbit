import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteProduct, fetchAdminProducts } from '../../redux/adminProductSlice';
const ProductManagement = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector(
        (state) => state.adminProducts
    );

    useEffect(() => {
        dispatch(fetchAdminProducts())
    }, [dispatch]);
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want delete the product?")) {
            dispatch(deleteProduct(id))

        }
    }
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>
    return (
        <div className='max-w-7xl mx-auto p-0 md:p-6'>
            <div className='flex flex-wrap items-center justify-between gap-3 mb-6'>
                <h2 className='text-2xl font-bold'>Product Management</h2>
                <Link to="/admin/products/new"
                    className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800'>
                    + Add Product
                </Link>
            </div>
            <div className='overflow-x-auto shadow-md sm:rounded-lg'>
                <table className='min-w-full text-left text-gray-500'>
                    <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
                        <tr>
                            <th className='py-3 px-4'>Name</th>
                            <th className='py-3 px-4 hidden md:table-cell'>Price</th>
                            <th className='py-3 px-4 hidden md:table-cell'>SKU</th>
                            <th className='py-3 px-4'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.length > 0 ? (
                                products.map((product) => {
                                    return (
                                        <tr key={product._id}
                                            className='border-b hover:bg-gray-50 cursor-pointer'>
                                            <td className='p-4 font-medium text-gray-900 md:whitespace-nowrap'>
                                                {product.name}
                                                <p className='md:hidden text-xs font-normal text-gray-500 mt-1'>₹{product.price}</p>
                                            </td>
                                            <td className='p-4 hidden md:table-cell'>₹{product.price}</td>
                                            <td className='p-4 hidden md:table-cell'>{product.sku}</td>
                                            <td className='p-4 flex'>
                                                <Link to={`/admin/products/${product._id}/edit`} className='bg-yellow-500 text-white px-2 py-2 rounded mr-2 hover:bg-yellow-600'>Edit</Link>
                                                <button onClick={() => handleDelete(product._id)} className='bg-red-500 text-white px-2 py-1.5 rounded hover:bg-red-600'>Delete</button>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (<tr>
                                <td colSpan={4} className='p-4 text-center text-gray-500'>
                                    No Products found.
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div >
    )
}

export default ProductManagement