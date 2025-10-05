import { useState, useEffect } from 'react';

export function useUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/resumes');
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return users;
}
