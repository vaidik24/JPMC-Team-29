import { useState } from "react";

const Card = ({ imgSrc, number, category, description, counter }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [count, setCount] = useState(counter);

  const handleEditClick = () => {
    if (isEditing) {
      // Save the edited count value
      // You can add any additional save logic here
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-60">
      <img
        src="../download.jpg"
        alt="Card Image"
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-bold text-gray-800">#{number}</span>
          <span className="text-sm text-gray-500">{category}</span>
        </div>
        <p className="text-gray-700 text-sm mb-4">{description}</p>
        <div className="text-right text-gray-800 text-sm flex mb-4 items-center">
          {isEditing ? (
            <input
              type="number"
              className="border outline-none w-20 bg-transparent rounded-lg border-black/10 px-2 mr-2"
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
          ) : (
            <span>Counter: {count}</span>
          )}
          <button
            className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 ml-2"
            onClick={handleEditClick}
          >
            {isEditing ? "📁" : "✏️"}
          </button>
        </div>
        <div>
          <button className="bg-gray-500 p-1 rounded-lg text-white">
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;