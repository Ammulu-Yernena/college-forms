// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://ammu:Welcome123@college_forms.gapdkns.mongodb.net/college_forms?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, 
  socketTimeoutMS: 45000 
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const formSchema = new mongoose.Schema({
  name: String,
  email: String,
  details: String
});

const Form = mongoose.model('Form', formSchema);

// Create a new form
app.post('/forms', async (req, res) => {
  const { name,email, details } = req.body;
  const form = new Form({ name,email, details });
  await form.save();
  res.status(201).send(form);
});

// Get all form names
app.get('/forms', async (req, res) => {
  const forms = await Form.find().select('name email details');
  res.send(forms);
});

// Get form details by name
app.get('/forms/:name', async (req, res) => {
  const form = await Form.findOne({ name: req.params.name });
  res.send(form);
});

// Update form details by name
app.put('/forms/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, details } = req.body;

  try {
    const updatedForm = await Form.findByIdAndUpdate(id, { name, email, details }, { new: true });
    res.json(updatedForm);
  } catch (error) {
    res.status(500).json({ error: 'Error updating form' });
  }
  });
  
  
// Delete form by name
app.delete('/forms/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Form.findByIdAndDelete(id);
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting form' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
