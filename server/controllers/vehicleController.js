const Vehicle = require('../models/Vehicle');

exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('customer').populate('fleet');
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createVehicle = async (req, res) => {
  try {
    const {
      customer, fleet, name, vin, licensePlate, brand, color, year,
      mileage, purchaseDate, cost, ownership, amountPaid,
      monthlyPayment, paymentDay, finalPaymentDate, notes, labels
    } = req.body;

    const photos = req.files?.photos?.map(f => `/uploads/vehicle-photos/${f.filename}`) || [];
    const documents = (req.files?.documents || []).map((file, index) => ({
      filename: `/uploads/vehicle-documents/${file.filename}`,
      label: labels && labels[index] ? labels[index] : 'Untitled'
    }));

    const vehicle = new Vehicle({
      customer, fleet, name, vin, licensePlate, brand, color, year,
      mileage, purchaseDate, cost, ownership,
      amountPaid, monthlyPayment, paymentDay, finalPaymentDate,
      notes, photos, documents, active: true
    });

    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    console.error('CREATE VEHICLE ERROR:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILES:', req.files);

    // ✅ Case 1: Only toggling active status
    if ('active' in req.body && Object.keys(req.body).length === 1) {
      const updated = await Vehicle.findByIdAndUpdate(
        req.params.id,
        { active: req.body.active === 'true' || req.body.active === true },
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: 'Vehicle not found' });
      return res.json(updated);
    }

    // ✅ Case 2: Full vehicle update
    const {
      customer, fleet, name, vin, licensePlate, brand, color, year,
      mileage, purchaseDate, cost, ownership, amountPaid,
      monthlyPayment, paymentDay, finalPaymentDate, notes
    } = req.body;

    const rawLabels = req.body.labels || [];
    const parsedLabels = Array.isArray(rawLabels) ? rawLabels : [rawLabels];

    const photos = req.files?.photos?.map(f => `/uploads/vehicle-photos/${f.filename}`) || [];
    const documents = (req.files?.documents || []).map((file, index) => ({
      filename: `/uploads/vehicle-documents/${file.filename}`,
      label: parsedLabels[index] || 'Untitled'
    }));

    const updateData = {
      customer,
      fleet,
      name,
      vin,
      licensePlate,
      brand,
      color,
      year,
      mileage,
      purchaseDate,
      cost,
      ownership,
      amountPaid,
      monthlyPayment,
      paymentDay,
      finalPaymentDate,
      notes
    };

    if (photos.length > 0) updateData.photos = photos;
    if (documents.length > 0) updateData.documents = documents;

    const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedVehicle) return res.status(404).json({ message: 'Vehicle not found' });

    res.json(updatedVehicle);
  } catch (err) {
    console.error('UPDATE VEHICLE ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.toggleVehicleStatus = async (req, res) => {
  try {
    const updated = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { active: req.body.active },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(updated);
  } catch (err) {
    console.error('TOGGLE ACTIVE ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};
