const Subscriber = require('../models/Subscriber');

exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find()
      .populate('customer')
      .populate('initialPlan')
      .populate('currentPlan');
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addSubscriber = async (req, res) => {
  try {
    const newSub = new Subscriber(req.body);
    await newSub.save();
    res.status(201).json(newSub);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateSubscriber = async (req, res) => {
  try {
    const updated = await Subscriber.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Subscriber not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
