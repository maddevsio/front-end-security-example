import React, { useState, useEffect } from 'react';
import useAuthRequest from '../request/useAuthRequest';

function Dashboard() {
  const [data, setData] = useState();
  const [newItem, setNewItem] = useState('');
  const [idToDelete, setIdToDelete] = useState();

  const { makeRequest, postRequest } = useAuthRequest();

  const fetchData = async () => {
    const response = await makeRequest('/api/data', 'get');
    setData(response.data);
  };

  const addNewItem = async () => {
    const response = await postRequest('/api/data', newItem);
    setData(response.data);
    fetchData();
  };

  const deleteItem = async () => {
    await makeRequest(`/api/data/${idToDelete}`, 'delete');
    await fetchData();
    setIdToDelete(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading data...</p>}
      <div>
        <input type="text" value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="Dog" />
        <button type="button" onClick={addNewItem}>Add</button>
      </div>
      <div>
        <input type="number" value={idToDelete} onChange={e => setIdToDelete(e.target.value)} placeholder="0" />
        <button type="button" onClick={deleteItem}>Delete</button>
      </div>
    </div>
  );
}

export default Dashboard;
