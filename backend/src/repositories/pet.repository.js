const {Pet} = require('../models/base')

class PetRepository{
    async Add(petData){ // Add a new pet to the database
        try{
            const pet = new Pet({
                after_image: petData.after_image,
                before_image: petData.beforeImage,
                pet_name: petData.pet_name,
                age: petData.age,
                weight: petData.weight,
                status: petData.status || [],
                pet_type: petData.pet_type || [],
                sex: petData.sex || [],
                arrival_date: petData.arrival_date,
                location: petData.location,
                vaccinated: petData.vaccinated,
                personality: petData.personality || [],
                about_pet: petData.personality
            });

            return await pet.save();
        }catch(error){
           throw new Error(`Failed to add pet data: ${error.message}`);
        }
    }
    async findPetByID(id){ // Find a pet by its ID
        try{
            return await Pet.findOne(id);
        }catch(error){
            throw new Error(`Failed to find pet: ${error.message}`)
        }
    }
    async findAllPetByStatus(){ // Get all pets with status 'available' or 'pending'
        try{
            return await Pet.find({status: {$in: ['available', 'pending']}})
        }catch(error){
            throw new Error(`Failed to fetch ${error.message}`)
        }
    }

    async findAllPetByType(){ // Get all pets of type 'dog' or 'cat'
        try{
            return await Pet.find({pet_type: {$in: ['dog', 'cat']}})
        }catch(error){
            throw new Error(`Failed to find their status ${error.message}`)
        }
    }
}
module.exports = new PetRepository();