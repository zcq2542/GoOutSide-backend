import express from "express";
import ActivsController from './activs.controller.js';
import ReviewsController from './reviews.controller.js';
import FavoritesController from './favorites.controller.js';

const router = express.Router();//get access to express router

router.route("/").get(ActivsController.apiGetActivs);
router.route("/id/:id").get(ActivsController.apiGetActivById);
router.route("/tags").get(ActivsController.apiGetTags);
router.route("/idList/:favlist").get(ActivsController.apiGetByIdList);

router.route("/review").post(ReviewsController.apiPostReview);
router.route("/review").put(ReviewsController.apiUpdateReview);
router.route("/review").delete(ReviewsController.apiDeleteReview);

router.route("/favorites").put(FavoritesController.apiUpdateFavorites);
router.route("/favorites/:userId").get(FavoritesController.apiGetFavorites);

router.route("/").post(ActivsController.apiPostActiv);
router.route("/").put(ActivsController.apiUpdateActiv);
router.route("/").delete(ActivsController.apiDeleteActiv);




export default router;