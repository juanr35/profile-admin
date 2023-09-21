import { Schema } from "mongoose"

const accountAdminSchema = new Schema({
  primer_nombre: {
    type: String,
    trim:true,
    maxLength:[20,'El nombre no es coherente'],
  },
  segundo_nombre: {
      type: String,
      trim:true,
      maxLength:[20,'El nombre no es coherente'],
  },
  primer_apellido: {
      type: String,
      trim:true,
      maxLength:[20,'El nombre no es coherente'],
  },
  segundo_apellido: {
      type: String,
      trim:true,
      maxLength:[20,'El nombre no es coherente'],
  },
  cedula: {
    select: {
      type: String
    },
    input: {
      type: String
    }
  },
  nacionalidad: {
    type: String,
    trim:true,
  },
  sexo: {
    type: String,
  },
  telefono: {
    type: String,
    trim:true,
    maxLength: [20,"El telefono no es coherente"]
  },
  cargo: {
    type: String,trim:true
  },
  image_1: {
    public_id: String,
    secure_url: String
  },
  superAdmin: { type: Boolean, default: false },
  permissions: {
    read: [String],
    write: [String],
  },
})

export default accountAdminSchema