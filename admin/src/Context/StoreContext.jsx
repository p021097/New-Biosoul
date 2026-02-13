import { createContext, useEffect, useState } from "react";
export const StoreContext = createContext(null);
import axios from "axios";
import { toast } from "react-toastify";


const StoreContextProvider = (props) => {
  const url = "https://new-biosoul-backend.onrender.com";
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [data, setData] = useState({
    name: "",
    description: "",
    category: "Salad",
    price: "",
  });
  // Inline Editing the food Item
  const [list, setList] = useState([]); // State to hold the list of food items
  const [editingItemId, setEditingItemId] = useState(null); // State to track which item is being edited
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
  }); // State to hold the edited data
  const [editImage, setEditImage] = useState(null); // State to hold the new image file for editing
  
  
  
  
  // Function to fetch all orders for admin panel
 
  const fetchAllOrders = async() =>{
    const response = await axios.get(`${url}/api/order/list`);
    if(response.data.success){
      // toast.success(response.data.message)
      setAllOrders(response.data.data)
      console.log(response.data.data);
      
    }else{
      toast.error(response.data.message)
    }
  }


  // Order Status Handler
  const statusHandler = async (event, orderId) =>{
    const response = await axios.post(`${url}/api/order/status`,{orderId,status:event.target.value});
    if(response.data.success){
      await fetchAllOrders();
      toast.success(response.data.message)
    }
    
  }







  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", Number(data.price));
    const response = await axios.post(`${url}/api/food/add`, formData);
    if (response.data.success) {
      setData({
        name: "",
        description: "",
        category: "Salad",
        price: "",
      });
      setImage(false);
      toast.success(response.data.message);
    } else {
      alert("Error adding product");
      toast.error(response.data.message);
    }
  };

  // Fetch food list
  const fetchlist = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Failed to fetch food items");
    }
  };

  // Remove food item
  const removeFoodItem = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
    if (response.data.success) {
      toast.success(response.data.message);
      fetchlist(); // Refresh the list after removal
    } else {
      toast.error("Failed to remove food item");
    }
  };

  // Food Item Edit Handlers
  const startEdit = (item) => {
    setEditingItemId(item._id);
    setEditData({
      name: item.name || "",
      description: item.description || "",
      category: item.category || "",
      price: item.price || "",
    });
    setEditImage(null); // Reset edit image when starting to edit
  };

  // cancel Edit
  const cancelEdit = () => {
    setEditingItemId(null);
    setEditData({
      name: "",
      description: "",
      category: "",
      price: "",
    });
    setEditImage(null);
  };

  // handle Edit Change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Save Edit
  const saveEdit = async () => {
    const formData = new FormData();
    formData.append("id", editingItemId);
    formData.append("name", editData.name);
    formData.append("description", editData.description);
    formData.append("category", editData.category);
    formData.append("price", editData.price);
    if (editImage) {
      formData.append("image", editImage);
    }
    const response = await axios.post(`${url}/api/food/update`, formData);
    if (response.data.success) {
      toast.success("Food item updated successfully");
      await fetchlist(); // Refresh the list after saving edits
      cancelEdit();
    } else {
      toast.error(response.data.message || "Failed to update food item");
    }
  };



// UseEffects


  useEffect(()=>{
    fetchAllOrders();
  },[])

  useEffect(() => {
    if (image) {
      const previewUrl = URL.createObjectURL(image);
      setImagePreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setImagePreview(null);
    }
  }, [image]);

  useEffect(() => {
    fetchlist();
  }, []);

  const contextValue = {
    url,
    image,
    setImage,
    data,
    setData,
    onChangeHandler,
    onSubmitHandler,
    imagePreview,
    list,
    fetchlist,
    removeFoodItem,
    editingItemId,
    setEditingItemId,
    editData,
    setEditData,
    handleEditChange,
    saveEdit,
    cancelEdit,
    setEditImage,
    startEdit,
    allOrders,
    setAllOrders,
    statusHandler
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
