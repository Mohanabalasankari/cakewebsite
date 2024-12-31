import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]); // State for orders
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [activeTab, setActiveTab] = useState('users'); // State to manage active tab

  // Fetch users, products, and orders from the backend (orders static for now)
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/auth/users');
      setUsers(response.data);
    } catch (error) {
      setError('Error fetching users');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products');
      setProducts(response.data);
    } catch (error) {
      setError('Error fetching products');
    }
  };

  const fetchOrders = () => {
    // Static order data for now with address, phone, and delivery status
    const staticOrders = [
      { id: 1, product: 'blue anarkali', quantity: 2, size: 'L', total: '₹3100', address: '1st North Street', phone: '9876543210', delivered: false },
      { id: 2, product: 'yellow shararah', quantity: 2,size: 'L', total: '₹3800', address: '1st North Street', phone: '9789157034', delivered: false },
    ];
    setOrders(staticOrders);
  };

  useEffect(() => {
    fetchUsers();
    fetchProducts();
    fetchOrders(); // Fetch static orders data
  }, []);

  // Handle adding a product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    if (image) formData.append('image', image);

    try {
      await axios.post('http://localhost:8080/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Product added successfully');
      resetForm();
      fetchProducts(); // Fetch updated product list
    } catch (error) {
      setError('Error adding product');
    }
  };

  // Handle removing a product
  const handleRemoveProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`);
      setSuccess('Product removed successfully');
      fetchProducts(); // Fetch updated product list
    } catch (error) {
      setError('Error removing product');
    }
  };

  // Handle marking an order as delivered
  const handleDeliverOrder = (id) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, delivered: true } : order
      )
    );
  };

  // Reset product form
  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setImage(null);
  };

  // Handle image change
  const handleImageChange = (e) => setImage(e.target.files[0]);

  return (
    <AdminContainer>
      <Sidebar>
        <SidebarItem
          isActive={activeTab === 'users'}
          onClick={() => setActiveTab('users')}
        >
          Users
        </SidebarItem>
        <SidebarItem
          isActive={activeTab === 'addProduct'}
          onClick={() => setActiveTab('addProduct')}
        >
          Add Product
        </SidebarItem>
        <SidebarItem
          isActive={activeTab === 'orders'}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </SidebarItem>
      </Sidebar>

      <MainContent>
        <h1>Admin Dashboard</h1>
        {error && <Error>{error}</Error>}
        {success && <Success>{success}</Success>}

        {activeTab === 'users' ? (
          <>
            <h2>Users List</h2>
            {users.length === 0 ? (
              <p>No users found</p>
            ) : (
              <UserList>
                {users.map((user) => (
                  <UserCard key={user._id}>
                    <h3>{user.name}</h3>
                    <p>Email: {user.email}</p>
                    {/* Display phone number */}
                    <p>Phone: {user.phone || 'Not available'}</p>
                    {/* Display address */}
                    <p>Address: {user.address || 'Not available'}</p>
                  </UserCard>
                ))}
              </UserList>
            )}
          </>
        ) : activeTab === 'addProduct' ? (
          <>
            <h2>Add New Product</h2>
            <ProductForm onSubmit={handleAddProduct}>
              <FormField>
                <label>Product Name:</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </FormField>
              <FormField>
                <label>Description:</label>
                <TextArea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter product description"
                  required
                />
              </FormField>
              <FormField>
                <label>Price:</label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                  required
                />
              </FormField>
              <FormField>
                <label>Product Image:</label>
                <FileInput type="file" onChange={handleImageChange} />
                {image && <ImagePreview src={URL.createObjectURL(image)} alt="Preview" />}
              </FormField>
              <SubmitButton type="submit">Add Product</SubmitButton>
            </ProductForm>

            <h2>Product List</h2>
            {products.length === 0 ? (
              <p>No products found</p>
            ) : (
              <ProductList>
                {products.map((product) => (
                  <ProductCard key={product._id}>
                    {product.image && (
                      <ProductImage
                        src={`http://localhost:8080${product.image}`}
                        alt={product.name}
                      />
                    )}
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>₹{product.price}</p>
                    <button onClick={() => handleRemoveProduct(product._id)}>
                      Remove
                    </button>
                  </ProductCard>
                ))}
              </ProductList>
            )}
          </>
        ) : activeTab === 'orders' ? (
          <>
            <h2>Orders</h2>
            {orders.length === 0 ? (
              <p>No orders yet</p>
            ) : (
              <OrderList>
                {orders.map((order) => (
                  <OrderCard key={order.id}>
                    <h3>Order #{order.id}</h3>
                    <p>Product: {order.product}</p>
                    <p>Quantity: {order.quantity}</p>
                    <p>size: {order.size}</p>
                    <p>Total: {order.total}</p>
                    <p>Address: {order.address}</p>
                    <p>Phone: {order.phone}</p>
                    <DeliveryButton
                      disabled={order.delivered}
                      onClick={() => handleDeliverOrder(order.id)}
                    >
                      {order.delivered ? 'Delivered' : 'Mark as Delivered'}
                    </DeliveryButton>
                  </OrderCard>
                ))}
              </OrderList>
            )}
          </>
        ) : null}
      </MainContent>
    </AdminContainer>
  );
};

// Styled Components for Admin Page

const AdminContainer = styled.div`
  display: flex;
  font-family: Arial, sans-serif;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding-top: 20px;
  padding-left: 20px;
  height: 100vh;
`;

const SidebarItem = styled.div`
  margin: 20px 0;
  cursor: pointer;
  padding: 12px;
  background-color: ${(props) => (props.isActive ? '#34495e' : 'transparent')};
  border-radius: 4px;
  font-size: 18px;
  &:hover {
    background-color: #34495e;
  }
`;

const MainContent = styled.div`
  padding: 20px;
  flex-grow: 1;
`;

const Error = styled.div`
  color: red;
  margin-bottom: 20px;
`;

const Success = styled.div`
  color: green;
  margin-bottom: 20px;
`;

const ProductForm = styled.form`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormField = styled.div`
  margin-bottom: 20px;
`;

const Input = styled.input`
  height: 35px;
  padding: 10px;
  font-size: 16px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const TextArea = styled.textarea`
  height: 80px;
  padding: 10px;
  font-size: 16px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const FileInput = styled.input`
  padding: 10px;
`;

const SubmitButton = styled.button`
  background-color: #3498db;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

const ProductList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const ProductCard = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 15px;
  width: 200px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ProductImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserCard = styled.div`
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
`;

const OrderCard = styled.div`
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const DeliveryButton = styled.button`
  background-color: ${(props) => (props.disabled ? '#95a5a6' : '#3498db')};
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  font-size: 14px;
  transition: 0.3s;

  &:hover {
    background-color: ${(props) =>
      props.disabled ? '#95a5a6' : '#2980b9'};
  }
`;

const ImagePreview = styled.img`
  max-width: 200px;
  max-height: 200px;
  margin-top: 10px;
  border-radius: 5px;
`;

export default AdminDashboard;
