import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';
import './UserList.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [filteredUsers, setFilteredUsers] = useState([]);

    const handleSearch = (e) => {
        const searchValue = e.target.value;
        setSearchParams(searchValue ? {filter: searchValue } : {});
        const filtered = users.filter((user) => user.name.toLowerCase().includes(searchValue.toLowerCase()));
        setFilteredUsers(filtered);
    }

    const resetFilter = () => {
        setSearchParams({});
        setFilteredUsers(users);
    }

    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/users")
        .then((response) => {
            if(!response.ok) {
                throw new Error('Failed to fetch data');
            } 
            return response.json();
        })
        .then(data => {
            console.log(data);
            setUsers(data)

            const filterParam = searchParams.get('filter');
            if (filterParam) {
                const filtered = data.filter((user) => user.name.toLowerCase().includes(filterParam.toLowerCase()));
                setFilteredUsers(filtered);
            } else {
                setFilteredUsers(data);
            }
            setLoading(false)
        })
        .catch((error) => {
            setError(error.message);
            setLoading(false);
        })
    }, [searchParams])

    if (loading) {
        return <div className='spinner'>Loading...</div>
    }

    if (error) {
      return <div className='error'>{error}</div>;
    }

    return (
      <div className='user-list-container'> 
        <h2>UserList</h2>
        <div className="controls">
          <input
            type="text"
            placeholder="Search by name"
            onChange={handleSearch}
            value={searchParams.get("filter") || ""}
          />
          <button onClick={resetFilter}>Reset Filter</button>
        </div>
        {/* {filteredUsers && ( */}
          <ol>
            {filteredUsers.length> 0 ? (
                filteredUsers.map((user) => (
              <li key={user.id}>
                <strong>{user.name}</strong> - {user.email}
              </li>
            ))
            ) : (
                <p className='no-results'>No users found</p>
            )}
          </ol>
        {/* )} */}
      </div>
    );
}

export default UserList