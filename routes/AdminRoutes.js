import express from 'express'
import { Getuser, deletUser, updateAdmin } from '../controllers/Admin.js'
import { isAdmin } from '../middleware/verifyToken.js'



const AdminRoutes = express.Router()
AdminRoutes.get('/getuser', isAdmin, Getuser)
AdminRoutes.delete('/delete/:id', isAdmin, deletUser)
AdminRoutes.put('/update/:id', isAdmin, updateAdmin)

export default AdminRoutes