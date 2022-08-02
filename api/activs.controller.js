import ActivsDAO from "../dao/activsDAO.js";

export default class ActivsController{
  static async apiGetActivs(req, res, next){
    const activsPerPage = req.query.activsPerPage ? parseInt(req.query.activsPerPage) : 20;
    const page = req.query.page ? parseInt(req.query.page) : 0;

    let filters = {}
    if (req.query.rated){
      filters.rated = req.query.rated;
    }else if (req.query.title){
      filters.title = req.query.title;
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
}