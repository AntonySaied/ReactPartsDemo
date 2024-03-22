import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const MyComponent = () => {
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const [editedDescription, setEditedDescription] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://77.92.189.102/iit_vertical_precast/api/v1/Erp.BO.PartSvc/Parts', {
        auth: {
          username: 'manager',
          password: 'manager'
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (Array.isArray(response.data.value)) {
        const extractedData = response.data.value.map(item => ({
          Company: item.Company,
          PartNum: item.PartNum,
          PartDescription: item.PartDescription,
          IUM: item.IUM,
          TypeCode: item.TypeCode
        }));
        setData(extractedData);
      } else {
        console.error('Data received from the API is not in the expected format.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditedDescription(data[index].PartDescription);
  };

  const handleSaveClick = async (index) => {
    try {
      const updatedData = [...data];
      updatedData[index].PartDescription = editedDescription;

      await axios.post('https://77.92.189.102/iit_vertical_precast/api/v1/Erp.BO.PartSvc/Parts', updatedData[index], {
        auth: {
          username: 'manager',
          password: 'manager'
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      fetchData();
      setEditIndex(-1);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  // Filter data based on search query
  const filteredData = data ? data.filter(item =>
    item.PartNum.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <div className="container">
      <h2>Part Table</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Part Number"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <table className="table table-bordered table-hover">
        <thead className='table-primary'>
          <tr>
            <th>Company</th>
            <th>Part Number</th>
            <th>Part Description</th>
            <th>IUM</th>
            <th>TypeCode</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.Company}</td>
                <td>{item.PartNum}</td>
                <td>
                  {editIndex === index ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                    />
                  ) : (
                    item.PartDescription
                  )}
                </td>
                <td>{item.IUM}</td>
                <td>{item.TypeCode}</td>
                <td>
                  {editIndex === index ? (
                    <button className="btn btn-primary" onClick={() => handleSaveClick(index)}>Save</button>
                  ) : (
                    <button className="btn btn-info" onClick={() => handleEditClick(index)}>Edit</button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No matching results found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyComponent;
