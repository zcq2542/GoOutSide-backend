import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let activs;

export default class ActivsDAO {
  static async injectDB(conn) {
    if (activs) {
      return;
    }
    try {
      //Don't know what to write here 
      activs = await conn.db(process.env.ACTIVREVIEWS_NS).collection('Activities');
    }
    catch (e) {
      console.error(`Unable to connect in ActivsDAO : ${e}`);
    }
  }

  static async getActivs({
      filters = null,
      page = 0,
      activsPerPage = 10,
    } = {}) { // empty object is default parameter in case arg is undefined.
    let query;
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters['name'] } };
      } else if ("tag" in filters) {
        query = { "tag": { $eq: filters['tag'] } };
      }
    }

    let cursor;
    try {
      cursor = await activs.find(query)
        .limit(activsPerPage)
        .skip(activsPerPage * page);
      const activsList = await cursor.toArray();
      const totalNumActivs = await activs.countDocuments(query);
      return { activsList, totalNumActivs };
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { activsList: [], totalNumActivs: 0 };
    }
  }

  static async getTags() {
    let tags = [];
    try {
      tags = await activs.distinct("taged");
      return tags;
    } catch (e) {
      console.error(`Unable to get tags, ${e}`);
      return tags;
    }
  }

  static async getActivById(id) {
    try {
      return await activs.aggregate([
        {
          $match: {
            _id: new ObjectId(id),
          }
        },
        {
          $lookup: { // from reviews collection find the data that activ_id === _id(activs collection) as output reviews field.
            from: 'reviews',
            localField: '_id',
            foreignField: 'activ_id',
            as: 'reviews', // output array field.
          }
        }
      ]).next();
    } catch (e) {
      console.error(`Something went wrong in getActivById: ${e}`);
      throw e;
    }
  }

  static async getByIdList(list) {
    let objectIds = list.map((id) => { return new ObjectId(id) });
    console.log(objectIds);
    try {
      return await activs.find(
        {
          _id: {
            $in: objectIds
          }
        }
      ).toArray();
    } catch (e) {
      console.error(`Something went wrong in getByIdList: ${e}`);
      throw e;
    }
  }
}

