import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let activs;

export default class ActivsDAO {
  static async injectDB(conn) {
    if (activs) {
      return;
    }
    try {
      activs = await conn.db(process.env.ACTIVREVIEWS_NS).collection('Activities');
    }
    catch (e) {
      console.error(`Unable to connect in ActivsDAO : ${e}`);
    }
  }

  static async getActivs({
      filters = null,
      page = 0,
      activsPerPage = 20,
    } = {}) { // empty object is default parameter in case arg is undefined.
    let query;
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters['name'] } };
      } else if ("tags" in filters) {
        query = { "tags": { $eq: filters['tags'] } };
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
      tags = await activs.distinct("tags");
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
            from: 'Reviews',
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

  static async addActiv(name, images, tags, user, address, description) {
    try {
      const activDoc = {
        name: name,
        images: images,
        tags: tags,
        user_id: user._id,
        user_name: user._name,
        address: address,
        description: description
      }
      return await activs.insertOne(activDoc);
    }
    catch (e) {
      console.error(`Unable to post activity: ${e}`)
      return { error: e };
    }
  }

  static async updateActiv(activId, userId, name, images, tags, address, description) {
    try {
      const activUpdate = await activs.updateOne(
        { _id: ObjectId(activId), user_id: userId },
        { $set: { 
          name: name,
          images: images,
          tags: tags,
          address: address,
          description: description 
        } });
      return activUpdate;
    }
    catch (e) {
      console.error(`Unable to update activity: ${e}`)
      return { error: e };
    }
  }

  static async deleteActiv(activId, userId) {
    try {
      const activDelete = await activs.deleteOne(
        { _id: ObjectId(activId), user_id: userId });
      return activDelete;
    }
    catch (e) {
      console.error(`Unable to delete activity: ${e}`)
      return { error: e };
    }
  }

  static async GetByUserId(userId) {
    // console.log(userId);

    
    let cursor;

    try {
      cursor = await activs.find({
        user_id: userId
        });   
      const activsList = await cursor.toArray();
      // console.log(activsList);
      return  activsList;
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      throw e;
    }
  }


}

