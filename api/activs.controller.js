import ActivsDAO from "../dao/activsDAO.js";

export default class ActivsController{
  static async apiGetActivs(req, res, next){
    const activsPerPage = req.query.activsPerPage ? parseInt(req.query.activsPerPage) : 20;
    const page = req.query.page ? parseInt(req.query.page) : 0;

    let filters = {}
    if (req.query.tags){
      filters.tags = req.query.tags;
    }else if (req.query.name){
      filters.name = req.query.name;
    }

    const { activsList, totalNumActivs} = await ActivsDAO.getActivs({filters, page, activsPerPage});
        
    let response = {
      activs: activsList,
      page: page,
      filters: filters,
      entries_per_page: activsPerPage,
      total_results: totalNumActivs,
    };
      res.json(response);
  }

  static async apiGetActivById(req, res, next){
    try{
      let id = req.params.id || {}
      let activ = await ActivsDAO.getActivById(id);
      if(!activ){
        res.status(404).json({error:"not found"});
        return;
      }
        res.json(activ);
    }catch(e){
      console.log(`API,${e}`);
      res.status(500).json({error:e});
    }
  }

  static async apiGetByIdList(req, res, next){
    try{
      // console.log(req.params);
      let favlist = JSON.parse(req.params.favlist) || {};
      let favorite = await ActivsDAO.getByIdList(favlist);
      res.json(favorite);
    }catch(e){
      console.log(`API,${e}`);
      res.status(500).json({error:e});
    }
  }

  static async apiGetTags(req, res, next){
    try {
      let propertyTypes = await ActivsDAO.getTags();
      res.json(propertyTypes);
    }catch(e){
      console.log(`API, ${e}`);
      res.status(500).json({error: e});
    }
  }

  static async apiPostActiv(req, res, next){
    try{
      const name = req.body.name;
      const images = req.body.imageUrl;
      const tags = req.body.tag;
      const address = req.body.address;
      const description = req.body.description;
      const coord = req.body.coordinate;
      const user = {
        _name: req.body.user_name,
        _id: req.body.user_id
      }
      const rating =[0,0];
      const hide = false;
      const activResponse = await ActivsDAO.addActiv(
        name, images, tags, user, address, description, coord, rating, hide);
      var {error} = activResponse;
      console.log(error);
      if(error){
        res.status(500).json({error: "Unable to post activity."});
      }else{
        res.json({status: "success"});
      }
    }catch(e){
      res.status(500).json({error: e.message});
    }
  }

  static async apiUpdateActiv(req, res, next){
    try{
      const activId = req.body.activ_id;
      const userId = req.body.user_id;
      const name = req.body.name;
      const images = req.body.imageUrl;
      const tags = req.body.tag;
      const address = req.body.address;
      const description = req.body.description;
      const coord = req.body.coordinate;
      const activResponse = await ActivsDAO.updateActiv(activId, userId, name, images, tags, address, description, coord);
      var {error} = activResponse;
        console.log(error);
      if(error){
        res.status(500).json({error: "Unable to update activity."});
      }else if(activResponse.modifiedCount === 0) { // There is no difference between new and old one.
        throw new Error("There is no difference.");
      } else {
        res.json({status: "success"});
      }
    }catch(e){
      res.status(500).json({error: e.message});
    }
  }

  static async apiDeleteActiv(req, res, next){
    //  console.log(req.body.user_id);
    try{
      const activId = req.body.activ_id;
      const userId = req.body.user_id;
      const activResponse = await ActivsDAO.deleteActiv(activId, userId);
      // console.log(activResponse);
      var {error} = activResponse;
      console.log(error);
      if (error) {
        res.status(500).json({error: "Unable to delete activity."});
      } else if (activResponse.modifiedCount === 0) { // There is no difference between new and old one.
        throw new Error("There is no difference.");
      } else {
        res.json({status: "success"});
      }
    }catch(e){
      res.status(500).json({error: e.message});
    }
  }

  static async apiGetByUserId(req, res, next){
    // console.log(req.params.userId);
    try{
      let userId = req.params.userId;
      // console.log(userId);
      let myActivs = await ActivsDAO.GetByUserId(userId);
      if(!myActivs){
        res.status(404).json({error:"not found"});
        return;
      }
      res.json(myActivs);
    }catch(e) {
      console.log(`API, ${e}`);
      res.status(500).json({error:e });
    }
  }

  static async apiUpdateStar(req, res, next){
    try{
      const activId = req.body.activ_id;
      const addStar = req.body.star;
      let getActiv = await ActivsDAO.getActivById(activId);
      let oldRating = getActiv.rating[0];
      let oldSum = getActiv.rating[1];
      let newRating = (oldRating*oldSum+addStar)/(oldSum+1).toFixed(1);
      let newSum = oldSum+1;
      let data ={newRating, newSum}
      const ratingResponse = await ActivsDAO.updateStar(activId, data);
      var {error} = ratingResponse;
        console.log(error);
      if(error){
        res.status(500).json({error: "Unable to update activity."});
      } else {
        res.json({status: "success"});
      }
    }catch(e){
      res.status(500).json({error: e.message});
    }

  }
}