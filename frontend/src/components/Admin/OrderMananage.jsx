import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllOrders, updateOrderStatus } from '../../redux/adminOrderSlice';

const OrderMananage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const { orders, loading, error } = useSelector((state) => state.adminOrders);
    const [openId, setOpenId] = useState(null);
    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/");
        }
        else {
            dispatch(fetchAllOrders());
        }
    }, [dispatch, user, navigate]);

    const handleStatusChange = (orderId, status) => {
        dispatch(updateOrderStatus({ id: orderId, status }))
    };
    if (loading) return <p>Loading</p>;
    if (error) return <p>Error:{error}</p>


    return (
        <div className='max-w-7xl mx-auto p-0 md:p-6'>
            <h2 className='text-2xl font-bold mb-6'>Order Management</h2>

            <div className='overflow-x-auto shadow-md sm:rounded-lg'>
                <table className='min-w-full text-left text-gray-500'>
                    <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
                        <tr>
                            <th className='py-3 px-4'>Order Id</th>
                            <th className='py-3 px-4 hidden md:table-cell'>Customer</th>
                            <th className='py-3 px-4 hidden md:table-cell'>Total Price</th>
                            <th className='py-3 px-4 hidden md:table-cell'>Payment</th>
                            <th className='py-3 px-4'>Status</th>
                            <th className='py-3 px-4 hidden md:table-cell'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (orders.map((order) => {
                            return (
                                <React.Fragment key={order._id}>
                                    <tr onClick={() => setOpenId(openId === order._id ? null : order._id)}
                                        className='border-b hover:bg-gray-50 cursor-pointer'>
                                        <td className='py-4 px-4 font-medium text-gray-900 whitespace-nowrap'>
                                            {/* Phone: short ID + details below it. Laptop: full ID */}
                                            <span className='md:hidden'>#{order._id.slice(-6)}</span>
                                            <span className='hidden md:inline'>#{order._id}</span>
                                            <div className='md:hidden mt-1 text-xs font-normal text-gray-500 space-y-1'>
                                                <p>{order.user?.name || "Unknown User"}</p>
                                                <p>₹{order.totalPrice.toFixed(2)}</p>
                                                <p>
                                                    {order.paymentMethod === "COD" ? "COD" : "PayPal"}
                                                    <span className={`ml-1 px-2 py-0.5 rounded-full ${order.isPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                        {order.isPaid ? "Paid" : "Unpaid"}
                                                    </span>
                                                </p>
                                            </div>
                                        </td>
                                        <td className='py-4 px-4 font-medium text-gray-900 whitespace-nowrap hidden md:table-cell'>
                                            {order.user?.name || "Unknown User"}
                                        </td>
                                        <td className='py-4 px-4 font-medium text-gray-900 whitespace-nowrap hidden md:table-cell'>
                                            {order.totalPrice.toFixed(2)}
                                        </td>
                                        <td className='py-4 px-4 whitespace-nowrap hidden md:table-cell'>
                                            {order.paymentMethod === "COD" ? "Cash on Delivery" : "PayPal"}
                                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${order.isPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                {order.isPaid ? "Paid" : "Unpaid"}
                                            </span>
                                        </td>
                                        <td className='p-4'>
                                            <select value={order.status}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) =>
                                                    handleStatusChange(order._id, e.target.value)}
                                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5'>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped"> Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className='p-4 hidden md:table-cell'>
                                            <button onClick={(e) => { e.stopPropagation(); handleStatusChange(order._id, "Delivered"); }}
                                                className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'>
                                                Mark as Delivered
                                            </button>
                                        </td>
                                    </tr>

                                    {openId === order._id && (
                                        <tr className='bg-gray-50 border-b'>
                                            <td colSpan={6} className='p-4'>
                                                <p className='font-semibold text-gray-900 mb-2'>Products</p>
                                                {order.orderItems.map((item, i) => (
                                                    <div key={i} className='flex items-center gap-4 py-2 border-b last:border-b-0'>
                                                        <img src={item.image} alt={item.name} className='w-12 h-12 object-cover rounded' />
                                                        <div className='flex-1'>
                                                            <p className='font-medium text-gray-900'>{item.name}</p>
                                                            <p className='text-xs'>Size: {item.size} · Color: {item.color}</p>
                                                        </div>
                                                        <p className='text-sm whitespace-nowrap'>{item.quantity} × ₹{item.price}</p>
                                                    </div>
                                                ))}
                                                <p className='text-xs mt-3'>
                                                    Ship to: {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
                                                    {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            )
                        })) : (<tr>
                            <td colSpan={6} className='p-4 text-center text-gray-500'>No Orders found.</td>
                        </tr>)}
                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default OrderMananage