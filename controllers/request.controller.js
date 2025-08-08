import { requestModel } from "../models/request.model.js";


const findRequest = async (req, res) => {
  const userRole = req.user.role; // Asignado por authMiddleware

  if (userRole !== 'administrador') {
    return res.status(403).json({ message: 'Acceso denegado: solo el administrador puede ver solicitudes' });
  }

  try {
    const requests = await requestModel.findAllRequest();
    return res.status(200).json({ results: requests });
  } catch (error) {
     console.error('ERROR AL OBTENER SOLICITUDES:', error);
  return res.status(500).json({ message: 'Error en el servidor', detalle: error.message });
  }
};

const createRequest = async (req, res) => {
  const userId = req.user.id;

  const {
    age,
    phone,
    address,
    housing_type,
    allows_pets,
    pet_name,
    reason,
    household
  } = req.body;

  try {
    const newRequest = await requestModel.create({
      age,
      phone,
      address,
      housing_type,
      allows_pets,
      pet_name,
      reason,
      household,
      user_id: userId,
      status: 'pendiente'
    });

    return res.status(201).json({
      message: 'Solicitud enviada con éxito',
      solicitud: newRequest
    });
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

const updateStatus = async (req, res) => {

  const userRole = req.user.role;
  const { id } = req.params;
  const { status } = req.body;
  if (userRole !== 'administrador') {
    return res.status(403).json({ message: 'Solo el administrador puede modificar el estado de una solicitud' });
  }

  if (!status) {
    return res.status(400).json({ message: 'Debes proporcionar el nuevo estado de la solicitud' });
  }

  try {
    const updated = await requestModel.update(id, status);

    if (!updated) {
      return res.status(404).json({ message: 'Solicitud no encontrada o no modificada' });
    }

    return res.status(200).json({
      message: 'Estado actualizado con éxito',
      solicitud: updated
    });


  } catch (error) {
    console.error('Error al actualizar el status:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
}


// Eliminar una solicitud
const deleteRequest = async (req, res) => {
  const userRole = req.user.role;
  const { id } = req.params;

  if (userRole !== 'administrador') {
    return res.status(403).json({ message: 'Acceso denegado: solo el administrador puede eliminar solicitudes' });
  }

  try {
    const request = await requestModel.findRequestById(id);
    if (!request) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    const deleted = await requestModel.remove(id);

    return res.status(200).json({
      message: 'Solicitud eliminada con éxito',
      solicitud: deleted
    });
  } catch (error) {
    console.error('Error al eliminar solicitud:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const requestController = {
  createRequest,
  findRequest,
  deleteRequest,
  updateStatus
}