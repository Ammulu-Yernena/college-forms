// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Router, Route, Switch, useLocation } from 'react-router-dom';
import AllForms from './AllForms';
import { createBrowserHistory } from 'history';
import './App.css';

const history = createBrowserHistory();

function App() {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', details: '' });

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/forms');
      console.log('Fetched forms:', response.data);
      setForms(response.data);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form:', formData);
  
    try {
      let response;
      if (selectedForm) {
        response = await axios.put(`http://localhost:5000/forms/${selectedForm._id}`, formData);
        console.log('Update response:', response.data);
      } else {
        response = await axios.post('http://localhost:5000/forms', formData);
        console.log('Create response:', response.data);
      }
      fetchForms();  // Re-fetch forms to update the list
      setFormData({ name: '', email: '', details: '' });
      setSelectedForm(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  

  const handleSelect = async (e) => {
    const formName = e.target.value;
    const response = await axios.get(`http://localhost:5000/forms/${formName}`);
    setSelectedForm(response.data);
    setFormData({ name: response.data.name, email: response.data.email, details: response.data.details });
  };

  const handleDelete = async () => {
    await axios.delete(`http://localhost:5000/forms/${selectedForm._id}`);
    fetchForms();
    setFormData({ name: '', email: '', details: '' });
    setSelectedForm(null);
  };

  const handleShowData = () => {
    history.push({
      pathname: '/all-forms',
      state: { forms: forms }
    });
  };

  const NavBar = () => {
    const location = useLocation();
    return (
      <nav>
        {location.pathname === '/' && <button onClick={handleShowData}>Show Data</button>}
      </nav>
    );
  };

  return (
    <Router history={history}>
      <div className="app-container">
      <NavBar />
        {/* <nav>
        <button onClick={handleShowData}>Show Data</button>
        </nav> */}
        <Switch>
          <Route exact path="/">
            <form onSubmit={handleSubmit} className="form-container">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  placeholder="Form Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Message:</label>
                <textarea
                  placeholder="Form Details"
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                />
              </div>
              <div className="form-buttons">
              <button type="submit">{selectedForm ? 'Update' : 'Create'}</button>
              {selectedForm && <button type="button" onClick={handleDelete}>Delete</button>}
              </div>
            </form>
            <select onChange={handleSelect} className="form-select">
              <option>Select a form</option>
              {forms.map((form) => (
                <option key={form._id} value={form.name}>
                  {form.name}
                </option>
              ))}
            </select>
          </Route>
          <Route path="/all-forms" component={AllForms} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
