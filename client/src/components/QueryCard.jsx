import { useState } from "react";

const QueryCard = ({ imgSrc, number, category, description }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editCategory, setEditCategory] = useState(category);
  const [editDescription, setEditDescription] = useState(description);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    // You can add any additional logic here to handle the save operation, such as updating state or making an API call
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditCategory(category);
    setEditDescription(description);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-60">
      <img
        src={imgSrc || "../download.jpg"}
        alt="Card Image"
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-bold text-gray-800">#{number}</span>
          {isEditing ? (
            <input
              type="text"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="text-sm text-gray-800 border rounded p-1"
            />
          ) : (
            <span className="text-sm text-gray-500">{category}</span>
          )}
        </div>
        {isEditing ? (
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="text-gray-700 text-sm mb-4 border rounded p-1 w-full"
          />
        ) : (
          <p className="text-gray-700 text-sm mb-4">{description}</p>
        )}
        <div className="flex">
          {isEditing ? (
            <>
              <button
                className="bg-gray-500 p-1 rounded-lg text-white mr-2"
                onClick={handleSaveClick}
              >
                Save
              </button>
              <button
                className="bg-gray-500 p-1 rounded-lg text-white"
                onClick={handleCancelClick}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button className="bg-gray-500 p-1 rounded-lg text-white mr-2">
                Accept
              </button>
              <button
                className="bg-gray-500 p-1 rounded-lg text-white mr-2"
                onClick={handleEditClick}
              >
                Edit
              </button>
              <button className="bg-gray-500 p-1 rounded-lg text-white">
                Decline
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueryCard;