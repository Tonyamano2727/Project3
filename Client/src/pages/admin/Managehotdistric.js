import React, { useEffect, useState, useRef } from "react";
import {
  gethotdistric,
  updatehotdistric,
  deletedhotdistric,
  apicreatehotdistric,
} from "../../apis";

const ManageHotDistrict = () => {
  const [hotDistricts, setHotDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newPercentage, setNewPercentage] = useState(0);
  const [newDistrictName, setNewDistrictName] = useState("");
  const [newDistrictPercentage, setNewDistrictPercentage] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchHotDistricts = async () => {
      try {
        const response = await gethotdistric();
        if (response.success) {
          setHotDistricts(response.data);
        } else {
          setError("Failed to fetch hot districts");
        }
      } catch (err) {
        setError("Error fetching hot districts: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotDistricts();
  }, []);

  const handleUpdate = async (did) => {
    if (newPercentage < 0 || newPercentage > 100) {
      console.log("Please enter a valid percentage between 0 and 100.");
      return;
    }

    const currentDistrict = hotDistricts.find(
      (district) => district._id === did
    );

    if (currentDistrict && currentDistrict.percentage === newPercentage) {
      console.log(
        "No changes detected. Please modify the percentage to update."
      );
      setEditingId(null);
      return;
    }

    try {
      const response = await updatehotdistric(
        { percentage: newPercentage },
        did
      );
      console.log("API response:", response);

      if (response.success) {
        setHotDistricts((prev) =>
          prev.map((district) =>
            district._id === did
              ? { ...district, percentage: newPercentage }
              : district
          )
        );
        setEditingId(null);
        setNewPercentage(0);
      } else {
        console.log("Update failed: Unknown error");
      }
    } catch (error) {
      console.log("Error updating district:", error.message || "Unknown error");
    }
  };

  const handleDelete = async (did) => {
    try {
      const response = await deletedhotdistric(did);
      console.log("Delete API response:", response);

      if (response.success) {
        setHotDistricts((prev) =>
          prev.filter((district) => district._id !== did)
        );
        console.log("District deleted successfully");
      } else {
        console.log("Delete failed: Unknown error");
      }
    } catch (error) {
      console.log("Error deleting district:", error.message || "Unknown error");
    }
  };

  const handleCreate = async () => {
    if (
      newDistrictName.trim() === "" ||
      newDistrictPercentage < 0 ||
      newDistrictPercentage > 100
    ) {
      console.log("Please enter a valid district name and percentage.");
      return;
    }

    try {
      const response = await apicreatehotdistric({
        name: newDistrictName,
        percentage: newDistrictPercentage,
      });
      console.log("Create API response:", response);

      if (response.success) {
        setHotDistricts((prev) => [...prev, response.data]);
        setNewDistrictName("");
        setNewDistrictPercentage(0);
        setShowCreateForm(false);
        console.log("District created successfully");
      } else {
        console.log("Create failed: Unknown error");
      }
    } catch (error) {
      console.log("Error creating district:", error.message || "Unknown error");
    }
  };

  const startEditing = (district) => {
    setEditingId(district._id);
    setNewPercentage(district.percentage || 0);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex w-[85%] justify-start items-start">
        <button
          onClick={() => setShowCreateForm((prev) => !prev)}
          className="p-2 bg-gradient-to-r from-[#e0a96a] to-[#e07c93] rounded-2xl w-[15%] text-[14px] text-white text-center">
          + New Hotdistric
        </button>
      </div>

      {showCreateForm && (
        <div className=" w-[85%] mt-5">
         
          <input
            type="text"
            placeholder="District Name"
            value={newDistrictName}
            onChange={(e) => setNewDistrictName(e.target.value)}
            className="border p-2 w-full mb-2 rounded-2xl"
          />
          <input
            type="number"
            placeholder="Percentage"
            value={newDistrictPercentage}
            onChange={(e) =>
              setNewDistrictPercentage(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="border p-2 w-full mb-2 rounded-2xl"
            min="0"
            max="100"
          />

          <button
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            Create
          </button>
          <button
            onClick={() => setShowCreateForm(false)}
            className="bg-gray-300 text-black px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      )}

      <div className="border rounded-2xl p-5 mt-5 bg-white z-1 w-[85%] flex flex-col items-center">
        <table className="leading-10 w-[90%] text-center">
          <thead>
            <tr className="text-[13px]">
              <th>District Name</th>
              <th>Percentage</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          {hotDistricts.length > 0 && (
            <tbody>
              {hotDistricts.map((district) => (
                <tr key={district._id}>
                  <td>{district.name}</td>
                  <td>
                    {editingId === district._id ? (
                      <input
                        ref={inputRef}
                        type="number"
                        value={newPercentage}
                        onChange={(e) =>
                          setNewPercentage(Number(e.target.value))
                        }
                        className="border border-gray-300 p-1"
                        min="0"
                        max="100"
                        autoFocus
                      />
                    ) : (
                      <span>{district.percentage || 0} %</span>
                    )}
                  </td>
                  <td>{new Date(district.createdAt).toLocaleString()}</td>
                  <td>
                    {editingId === district._id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(district._id)}
                          className="text-blue-500 hover:underline ml-2">
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-red-500 hover:underline ml-2">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(district)}
                          className="text-blue-500 hover:underline">
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(district._id)}
                          className="text-red-500 hover:underline ml-2">
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default ManageHotDistrict;
