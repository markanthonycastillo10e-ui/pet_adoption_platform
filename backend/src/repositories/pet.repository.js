const {Pet} = require('../models/base')

class PetRepository{
    async Add(petData){ //Pet data to store the data 
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
           throw new Error(`Failed to create adopter: ${error.message}`);
        }
    }
}