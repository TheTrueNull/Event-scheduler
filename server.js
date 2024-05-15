const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to PostgreSQL
const sequelize = new Sequelize('postgres://eventsuser:expired@localhost:5432/eventsdb');

// Define the Event model
const Event = sequelize.define('event', {
    event: DataTypes.STRING,
    priority: DataTypes.STRING,
    deadline: DataTypes.DATE,
    done: DataTypes.BOOLEAN
},{
    timestamps: false
});

// Sync the model with the database
sequelize.sync();

// API endpoints
app.get('/events', async (req, res) => {
    const events = await Event.findAll();
    res.json(events);
});

app.post('/events', async (req, res) => {
    const { event, priority, deadline, done } = req.body;
    const newEvent = await Event.create({ event, priority, deadline, done });
    res.json(newEvent);
});

app.put('/events/:id', async (req, res) => {
    const { done } = req.body;
    const id = req.params.id;
    const updated = await Event.update({ done }, {
        where: { id }
    });
    res.json({ updated });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
