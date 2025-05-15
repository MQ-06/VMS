const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./app');
const path = require('path');


dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const settingsRoutes = require('./routes/settings');
app.use('/api/settings', settingsRoutes);

const translationRoutes = require('./routes/translationRoutes');
app.use('/api/translations', translationRoutes);

const plans=require('./routes/plans');
app.use('/api/plans', plans);

const customerRoutes = require('./routes/customerRoutes');
app.use('/api/customers', customerRoutes);

const taxRoutes = require('./routes/taxes'); 
app.use('/api/taxes', taxRoutes);

const subscriberRoutes = require('./routes/subscriberRoutes');
app.use('/api/subscribers', subscriberRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const supplierRoutes = require('./routes/supplierRoutes');
app.use('/api/suppliers', supplierRoutes);

const fleetRoutes = require('./routes/fleetRoutes');
app.use('/api/fleets', fleetRoutes);

const vehicleRoutes = require('./routes/vehicleRoutes');
app.use('/api/vehicles', vehicleRoutes);

const repairCategoryRoutes = require('./routes/repairCategories');
app.use('/api/repair-categories', repairCategoryRoutes);

const partServiceRoutes = require('./routes/partServiceRoutes');
app.use('/api/part-services', partServiceRoutes);

const maintenanceRepairRoutes = require('./routes/maintenanceRepairRoutes');    
app.use('/api/maintenance-repairs', maintenanceRepairRoutes);

const recurringMaintenanceRoutes = require('./routes/recurringMaintenanceRoutes');     
app.use('/api/recurring-maintenance', recurringMaintenanceRoutes);


const recurringScheduleRoutes = require('./routes/recurringScheduleRoutes');
app.use('/api/recurring-maintenance-schedule', recurringScheduleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
