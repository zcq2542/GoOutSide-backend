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
      console.log(req.params);
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
      const user = {
        _name: req.body.user_name,
        _id: req.body.user_id
      }
      const activResponse = await ActivsDAO.addActiv(
        name, images, tags, user, address, description);
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
      const images = req.body.images;
      const tags = req.body.tags;
      const address = req.body.address;
      const description = req.body.description;
      const activResponse = await ActivsDAO.updateActiv(activId, userId, name, images, tags, address, description);
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
    try{
      const activId = req.body.activ_id;
      const userId = req.body.user_id;
      const activResponse = await ActivsDAO.updateActiv(activId, userId);
      var {error} = activResponse;
      console.log(error);
      if(error){
        res.status(500).json({error: "Unable to delete activity."});
      }else{
        res.json({status: "success"});
      }
    }catch(e){
      res.status(500).json({error: e.message});
    }
  }
}