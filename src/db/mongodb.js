import mongoose from "mongoose";

const URI = 'mongodb+srv://dev:8Ek8qdYUhfXoeURb@cluster0.vjc3fvk.mongodb.net/ecommerce?retryWrites=true&w=majority'

const initDB = async () => {
    try {
      await mongoose.connect(URI);
      console.log('Database connected ✅');
    } catch (error) {
      console.error('Ocurrio un error al conectar base de datos');
    }
  }
  
  export default initDB;