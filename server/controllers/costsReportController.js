const MaintenanceRepair = require('../models/MaintenanceRepair');
const Vehicle = require('../models/Vehicle');
const Supplier = require('../models/Supplier');
const Category = require('../models/RepairCategory');

exports.getCostsReport = async (req, res) => {
  try {
    const {
      customer,
      fleet,
      vehicle,
      type,
      supplier,
      category,
      dateFrom,
      dateTo
    } = req.query;

    const filters = {};

    if (customer) filters.customer = customer;
    if (fleet) filters.fleet = fleet;
    if (vehicle) filters.vehicle = vehicle;
    if (type) filters.type = type;
    if (supplier) filters.supplier = supplier;
    if (category) filters.category = category;

    if (dateFrom || dateTo) {
      filters.date = {};
      if (dateFrom) filters.date.$gte = new Date(dateFrom);
      if (dateTo) filters.date.$lte = new Date(dateTo);
    }

    const results = await MaintenanceRepair.find(filters)
      .populate('vehicle', 'name')
      .populate('supplier', 'name')
      .populate('category', 'categoryEn') // ✅ correct field name
      .sort({ date: -1 });

    const formatted = results.map(entry => ({
      _id: entry._id,
      vehicleName: entry.vehicle?.name || 'Unknown',
      supplierName: entry.supplier?.name || 'Unknown',
      category: entry.category?.categoryEn || 'Uncategorized', // ✅ use correct populated field
      type: entry.type,
      description: entry.description,
      date: entry.date,
      totalCost: entry.cost || 0
    }));

    res.status(200).json({ data: formatted });
  } catch (error) {
    console.error('Failed to fetch cost report:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
