import { petModel } from "../models/pet.model.js";
import { cloudinaryMiddle } from '../utils/cloudinary.js';
import fs from 'fs-extra'

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.DOMAIN_URL_APP
    : `http://localhost:${process.env.PORT}`;

const read = async (req, res) => {
  try {
    const { page = 1, specie, size, age } = req.query;
    const isPageValid = /^[1-9]\d*$/.test(page);
    const filters = { page: Number(page), };
    if (specie) filters.specie = specie;
    if (size) filters.size = size;
    if (age) filters.age = age;
    if (!isPageValid) {
      return res.status(400).json({ message: "Invalid page number, page > 0" });
    }

    const pets = await petModel.findAllPets(filters);
    return res.status(200).json(pets);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

const readById = async (req, res) => {
  const petId = req.params.id;
  const userId = req.user?.id || null;

  console.log("req.user:", req.user);
  try {
    const pet = await petModel.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Mascota no encontrada' });
    }

    // Verificación: ¿Es el dueño?
    const isOwner = userId && pet.author_post === userId;

    return res.status(200).json({
      ...pet,
      isOwner,
      href: `${BASE_URL}/api/pets/${pet.id}`,
    });
  } catch (error) {
    console.error('Error en readById:', error);
    return res.status(500).json({ message: 'Error al obtener la mascota' });
  }
};

const readByUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const myPets = await petModel.findByUser(userId);
    return res.status(200).json({
      count: myPets.length,
      results: myPets,
    });
  } catch (error) {
    console.error('Error en readByUser:', error);
    return res.status(500).json({ message: 'Error al obtener mascotas del usuario' });
  }
};

const create = async (req, res) => {

  try {
    const { name, specie, weight, age, gender, chip, description } = req.body;
    const author_post = req.user.id;
    let photo = req.files?.photo
      ? await cloudinaryMiddle.uploadImage(req.files.photo.tempFilePath)
      : null;

    if (!name || !specie || !weight || !age || !gender || photo === null || !description) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const petData = {
      name,
      specie,
      weight,
      age,
      gender,
      chip,
      photo: photo?.secure_url,
      photo_id: photo?.public_id,
      description
    };

    const newPet = await petModel.create(petData, author_post);

    if (req.files?.image) {
      await fs.unlink(req.files.photo.tempFilePath);
    }

    return res.status(201).json(newPet);;
  } catch (error) {
    console.error("Error en create:", error);
    return res.status(500).json({
      message: "Error en el servidor",
      error: error.message
    })
  }

};

const update = async (req, res) => {
  const petId = req.params.id;
  const userId = req.user.id;
  const updatedFields = req.body;

  try {
    const pet = await petModel.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Mascota no encontrada' });
    }

    if (pet.author_post !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para editar esta publicación' });
    }

    const updatedPet = await petModel.update(petId, userId, updatedFields);

    return res.status(200).json({
      message: 'Mascota actualizada con éxito',
      pet: updatedPet
    });
  } catch (error) {
    console.error('Error al actualizar mascota:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};


const remove = async (req, res) => {
  const petId = req.params.id;
  const userRole = req.user?.role;
  const userId = req.user?.id

  try {
    const pet = await petModel.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Mascota no encontrada' });
    }
    const isOwner = pet.author_post === userId;

    if (userRole !== 'administrador' && !isOwner) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta publicación' });
    }

    if (pet.photo_id) {
      await cloudinaryMiddle.deleteImage(pet.photo_id);
    }

    const deletedPet = await petModel.remove(petId);
    return res.status(200).json({
      message: 'Mascota eliminada con éxito',
      pet: deletedPet
    });
  } catch (error) {
    console.error('Error al eliminar mascota:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const petController = {
  read,
  readById,
  create,
  update,
  remove,
  readByUser
};
