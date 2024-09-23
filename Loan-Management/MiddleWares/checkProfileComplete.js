

const checkProfileComplete = (req,res,next)=>{
    const {location,employmentStatus,MonthlyIncome,IdentificationType,IDNumber, ResidentialAddress,
        DateOfBirth} = req.user

    if(!location || !employmentStatus ||!MonthlyIncome || !IdentificationType || 
        !IDNumber ||! ResidentialAddress
       ||! DateOfBirth){
  return res.status(400).json({message: 'Please complete your profile before applying for a loan.',
    profileComplete: false})
       }
       next()
}

module.exports =checkProfileComplete