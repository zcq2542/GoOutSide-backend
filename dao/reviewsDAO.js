import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO {
    static async injectDB(conn){
        if(reviews){
            return;
        }
        try{
            reviews = await conn.db(process.env.ACTIVREVIEWS_NS).collection('reviews');
        }catch(e){
            console.error(`Unable to establish connection handle in reviewsDA: ${e}`);
        }
    }

    static async addReview(activId, user, review, date){
        try{
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date: date,
                review: review,
                activ_id: ObjectId(activId)
            }
            return await reviews.insertOne(reviewDoc);
        }
        catch(e){
            console.error(`Unable to post review: ${e}`)
            return { error: e };
        }
    }

    static async updateReview(reviewId, userId, review, date){
        try{
            const reviewUpdate = await reviews.updateOne(
                {_id:ObjectId(reviewId), user_id:userId},
                {$set: {review: review, date: date}});
            return reviewUpdate;
        }
        catch(e){
            console.error(`Unable to update review: ${e}`)
            return { error: e };
        }
        
    }

    static async deleteReview(reviewId, userId){
        try{
            const reviewDelete = await reviews.deleteOne(
                {_id:ObjectId(reviewId), user_id:userId});    
            return reviewDelete;
        }
        catch(e){
            console.error(`Unable to delete review: ${e}`)
            return { error: e };
        }

        
    }

}