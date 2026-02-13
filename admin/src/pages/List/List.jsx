import React, { useContext } from "react";
import "./List.css";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import { toast } from "react-toastify";

const List = () => {
  const {
    url,
    list,
    editingItemId,
    editData,
    setEditImage,
    removeFoodItem,
    startEdit,
    cancelEdit,
    handleEditChange,
    saveEdit,
  } = useContext(StoreContext);

  // const fetchList = async () => {
  //   const response = await axios.get(`${url}/api/food/list`);
  //   if (response.data.success) {
  //     setList(response.data.data);
  //   } else {
  //     toast.error("Error fetching list");
  //   }
  // };

  // const removeFood = async (foodId) => {
  //   const response = await axios.post(`${url}/api/food/remove`,{id:foodId});
  //   await fetchList()
  //   if (response.data.success) {
  //     toast.success("Food removed successfully");
  //     fetchList();
  //   } else {
  //     toast.error("Error deleting food");
  //   }
  // };

  // React.useEffect(() => {
  //   fetchList();
  // }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Actions</b>
        </div>
        {list.map((item) => (
          <div className="list-table-format " key={item._id}>
            <div className="list-image-cell">
              <img
                src={`${url}/images/${item.image}`}
                alt={item.name}
                className="list-image"
              />
              {editingItemId === item._id ? (
                <input
                  type="file"
                  onChange={(e) => setEditImage(e.target.files[0])}
                  className="list-file-input"
                />
              ) : null}
            </div>
            {/* <img src={`${url}/images/${item.image}`} alt={item.name} className="list-image" /> */}
            {/* <span>{item.name}</span>
            <span>{item.category}</span>
            <span>${item.price}</span> */}
            {editingItemId === item._id ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  className="list-input"
                />
                {/* <input
                  type="text"
                  name="description"
                  value={editData.description}
                  onChange={handleEditChange}
                  className="list-input"
                /> */}
                <input
                  type="text"
                  name="category"
                  value={editData.category}
                  onChange={handleEditChange}
                  className="list-input"
                />
                <input
                  type="number"
                  name="price"
                  value={editData.price}
                  onChange={handleEditChange}
                  className="list-input"
                />
                <div className="list-actions ">
                  <button className="save-button cursor" onClick={saveEdit}>
                    Save
                  </button>
                  <button className="cancel-button cursor" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span>{item.name}</span>
                <span>{item.category}</span>
                <span>Rs {item.price}</span>
              </>
            )}
            {/* <div className="list-actions ">
              <button className="edit-button cursor" onClick={()=>startEdit(item)}>Edit</button>
              <button
                className="delete-button cursor"
                onClick={() => removeFoodItem(item._id)}
              >
                Delete
              </button>
            </div> */}
            {editingItemId === item._id ? null : (
              <div className="list-actions">
                <button
                  className="edit-button cursor"
                  onClick={() => startEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="delete-button cursor"
                  onClick={() => removeFoodItem(item._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
