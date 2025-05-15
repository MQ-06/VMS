const Supplier = require('../models/Supplier');

exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().populate('customer');
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSupplier = async (req, res) => {
  try {
    const {
      customer,
      name,
      contactPerson,
      phone,
      email,
      type,
      address,
      active
    } = req.body;

    const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;

    const supplier = new Supplier({
      customer,
      name,
      contactPerson,
      phone,
      email,
      type,
      active: active === 'false' ? false : true,
      address: parsedAddress,
      logo: req.file ? `/uploads/supplier-logos/${req.file.filename}` : ''
    });

    await supplier.save();
    res.status(201).json(supplier);
  } catch (error) {
    console.error('CREATE SUPPLIER ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const {
      customer,
      name,
      contactPerson,
      phone,
      email,
      type,
      address,
      active
    } = req.body;

    const updatedData = {
      customer,
      name,
      contactPerson,
      phone,
      email,
      type,
      address,
      active: active === 'false' ? false : true,
    };

    if (req.file) {
      updatedData.logo = `/uploads/supplier-logos/${req.file.filename}`;
    }

    const supplier = await Supplier.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(supplier);
  } catch (error) {
    console.error('UPDATE SUPPLIER ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};
