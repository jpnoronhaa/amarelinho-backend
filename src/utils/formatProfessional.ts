
export const formatProfessional = (professional: any) => {
    return {
        id: professional.id,
        user_id: professional.userId,
        name: professional.name,
        email: professional.email,
        phone: professional.phoneNumber,
        categories: professional.categories,
        average_rating: professional.averageRating,
        total_ratings: professional.totalRatings,
        profile_picture: professional.profilePicture,
        description: professional.description
    };
};