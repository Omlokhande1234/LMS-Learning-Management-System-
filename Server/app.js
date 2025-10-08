import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

import errorMiddleware from './Middlewares/errorMiddleware.js'
import authRoutes from './Routes/authRoutes.js'
import courseRoutes from './Routes/courseRoutes.js'
import paymentRoutes from './Routes/paymentRoutes.js'
import googleRoutes from './Routes/googleApiRoutes.js'
import adminRoutes from './Routes/adminRoutes.js'

// Swagger configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LMS API Documentation',
      version: '1.0.0',
      description: 'API documentation for Learning Management System',
      contact: {
        name: 'API Support',
        email: 'support@lms.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server (local)'
      },
      {
        url: 'https://lms-backend-awyl.onrender.com',
        description: 'Production server (Render)'
      },
      {
        url: process.env.API_BASE_URL || 'https://lms-backend-awyl.onrender.com',
        description: 'Production server (from environment)'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.js'], // Path to the API routes
}

const specs = swaggerJsdoc(options)
const app=express()


// CORS should be before routes
app.use(cors({
  origin: ['http://localhost:5173', 'https://lms-frontend-1-fq47.onrender.com/'], 
  credentials: true
}));
// Handle preflight requests explicitly
app.options('*', cors());
app.use('/api/v1/payment/webhook', express.raw({ type: 'application/json' }));

app.use(express.json())
//Used to parse the info from the encoded url
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use('/api/user',authRoutes)
app.use('/api/courses',courseRoutes)
app.use('/api/payment',paymentRoutes)
app.use('/api/googleApi',googleRoutes)
app.use('/api/admin',adminRoutes)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
app.use(errorMiddleware)


export default app