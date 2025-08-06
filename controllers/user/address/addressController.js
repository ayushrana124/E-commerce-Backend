import Address from "../../../models/addressModel.js"

export const addAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { street, city, state, country, postalCode } = req.body;

        if (!street || !city || !state || !country || !postalCode) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existingAddresses = await Address.find({ user: userId });
        if (existingAddresses.length >= 10) {
            return res.status(400).json({
                success: false,
                message: "Maximum of 10 addresses allowed per user",
            });
        }

        const newAddress = await Address.create({
            user: userId,
            street,
            city,
            state,
            country,
            postalCode,
        });

        res.status(201).json({
            success: true,
            message: "Address added successfully",
            address: newAddress,
        });

    } catch (error) {
        console.error("Error in addAddress:", error);
        res.status(500).json({
            success: false,
            message: "Server Error. Please try again later.",
        });
    }
};

export const getAddress = async (req, res) => {

    const userId = req.user._id;

    const address = await Address.find({user : userId});
    if(!address){
        res.status(400).json({message : "Add address to select"})
    }

    res.status(200).json({ success : true, message : "Address fetched successfully", address});
}

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { street, city, state, country, postalCode } = req.body;

    const address = await Address.findOne({ _id: id, user: req.user._id });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    address.street = street || address.street;
    address.city = city || address.city;
    address.state = state || address.state;
    address.country = country || address.country;
    address.postalCode = postalCode || address.postalCode;

    await address.save();

    res.status(200).json({ success: true, address });
  } catch (err) {
    res.status(500).json({ message: "Failed to update address", error: err.message });
  }
};

export const deleteAddress = async (req,res) => {

    const userId = req.user._id;
     const { id } = req.params;

     const address = await Address.findOneAndDelete({_id : id, user : userId});
     if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({success : true, message : "Deleted Successfully"});
}

