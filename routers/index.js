const express = require('express');
const router = express.Router();
const RolesController = require('../controllers/rolesController');
const UsersController = require('../controllers/usersController');
const UsersManagementController = require('../controllers/usersManagementController');
const authMiddleware = require('../middleware/validate');
const dashboardController = require('../controllers/dashboardController');
const multer = require('multer');
const path = require('path');
const errorLogsController = require('../controllers/errorLogsController');
const parkingLotController = require('../controllers/parkingLotController');
const AssetController = require ('../controllers/assetController');




// Konfigurasi Multer untuk unggahan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });


// Routes for edit status
router.post('/edit-status', 
  authMiddleware.authenticate,
  authMiddleware.authorizeRole([1]),
  UsersController.editStatus);

// Routes for edit profile
router.post('/edit-profile', 
  authMiddleware.authenticate,
  upload.single('profile_image'),
  dashboardController.updateProfile);

// Routes for access
router.get('/admin-dashboard',
   authMiddleware.authenticate, // Middleware autentikasi
   authMiddleware.authorizeRole([1]), // Hanya admin yang bisa mengakses
   dashboardController.adminDashboard);

// Routes for error logs
router.get('/error-logs', 
  authMiddleware.authenticate, // Middleware autentikasi
  authMiddleware.authorizeRole([1]), // Hanya admin yang bisa mengakses
  errorLogsController.getErrorLogs);

router.post('/error-logs', 
    authMiddleware.authenticate, // Middleware autentikasi
    authMiddleware.authorizeRole([1]), // Hanya admin yang bisa mengakses
    errorLogsController.deleteErrorLog);

// Routes for roles
router.get(
    '/roles',
    authMiddleware.authenticate, // Middleware autentikasi
    authMiddleware.authorizeRole([1]), // Hanya admin yang bisa mengakses
    RolesController.getAllRoles
  );
  router.post(
    '/roles',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole([1]), // Hanya admin
    RolesController.createRole
  );

// Routes details staff
router.get('/staff-details/:id',
  authMiddleware.authenticate, // Middleware autentikasi
  authMiddleware.authorizeRole([1]), // Hanya admin yang bisa mengakses
  dashboardController.detailsStaff
);
router.post('/staff-details/:id',
  authMiddleware.authenticate, // Middleware autentikasi
  authMiddleware.authorizeRole([1]), // Hanya admin yang bisa mengakses
  dashboardController.updateStatus
);

// Routes for users
router.get('/register', UsersController.getAllUsers );
router.post('/register', UsersController.createUser);
router.get('/verify-email', UsersController.verifyEmail);

// Routes for user management
router.get(
    '/user-management',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole([3,4]),
    UsersManagementController.getAllUserManagement
  );
  router.post(
    '/user-management',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole([3]),
    UsersManagementController.createUserManagement
  );
  // Routes for logout
  router.get("/logout", (req, res) => {
    res.clearCookie("token"); // Hapus cookie 'token'
    res.redirect("/auth/login");  // Redirect ke halaman login
  });

  // Routes for parking lot
  router.get('/parking',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole([3]),
    parkingLotController.getParkingLots
  );
  router.post('/parking',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole([3]),
    upload.single('lot_image'),
    parkingLotController.createParkingLot
  );
  // router.get('/delete/:id_lot', parkingLotController.deleteParkingLot);

  router.get('/aset',
    AssetController.getAsset,
  );


module.exports = router;

