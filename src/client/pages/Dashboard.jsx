import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/api/data', {
            headers: {
              'Authorization': `Bearer ${token}` // Use stored token for authentication
            }
          });
          setData(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
          // Handle error (e.g., redirect to login if unauthorized)
        }
      } else {
        // Handle case where token is not available, e.g., redirect to login
        console.error('No token available');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading data...</p>}
    </div>
  );
}

export default Dashboard;
