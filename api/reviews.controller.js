import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {
  static async apiPostReview(req, res, next) {
    try {
      const ActivityId = req.body.activity_id;
      const review = req.body.review;
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id
      }

      const date = new Date();

      const reviewResponse = await ReviewsDAO.addReview(
        ActivityId,
        userInfo,
        review,
        date
      );

      var { error } = reviewResponse;
      console.log(error);
      if (error) {
        res.status(500).json({ error: "Unable to post review." });
      }
      else {
        res.json({ status: "success" });
      }
    }
    catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiUpdateReview(req, res, next) {
    try {
      const reviewId = req.body.review_id;
      const review = req.body.review;
      const userId = req.body.user_id;
      const date = new Date();
      const reviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        userId,
        review,
        date
      );

      var Count = reviewResponse.modifiedCount;
      console.log(Count);
      if (!Count) {
        res.status(500).json({ error: "controller Unable to update review." });
      }
      else {
        res.json({ status: "success" });
      }
    }
    catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeleteReview(req, res, next) {
    try {
      const reviewId = req.body.review_id;
      const userId = req.body.user_id;

      const DeleteReviewResponse = await ReviewsDAO.deleteReview(
        reviewId,
        userId
      );
      var dCount = DeleteReviewResponse.deletedCount;
      console.log(dCount);
      if (!dCount) {
        res.status(500).json({ error: "controller Unable to delete review." });
      }
      else {
        res.json({ status: "success" });
      }
    }
    catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}