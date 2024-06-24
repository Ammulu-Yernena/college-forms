import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './AllForms.css';

const AllForms = () => {
  const [allForms, setAllForms] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetchAllForms();
  }, []);

  const fetchAllForms = async () => {
    const response = await axios.get('http://localhost:5000/forms');
    setAllForms(response.data);
  };

  const handleGoHome = () => {
    history.push('/');
  };

  return (
    <div className="all-forms-container">
      <nav>
      <button onClick={handleGoHome} className="home-button">Home</button>
      </nav>
      <h1>All Forms</h1>
      <ul className="form-list">
        {allForms.map((form) => (
          <li key={form._id} className="form-item">
            <strong>Name:</strong> {form.name}<br />
            <strong>Email:</strong> {form.email}<br />
            <strong>Details:</strong> {form.details}

          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllForms;
