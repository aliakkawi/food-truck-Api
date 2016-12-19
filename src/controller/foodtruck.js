import mongoose from 'mongoose';
import { Router } from 'express';
import Foodtruck from '../model/foodtruck';
import Review from '../model/review';

import {authenticate} from '../middleware/authMiddleware';

export default({ config, db }) => {
  let api = Router();

  // CURD - creat Read Update Delete

  // '/v1/foodtruck/add' - Creat
  //http://localhost:3005/v1/foodtruck/add

  //using postman:  http://localhost:3005/v1/foodtruck/add
  // we added the word authenticate so that the user has to be logged in in order to be able to post.
  api.post('/add', authenticate, (req, res) => {
    let newFoodtruck = new Foodtruck();
    newFoodtruck.name = req.body.name;
    newFoodtruck.foodtype = req.body.foodtype;
    newFoodtruck.avgcost = req.body.avgcost;
    newFoodtruck.geometry.coordinates = req.body.geometry.coordinates;


    newFoodtruck.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Foodtruck saved successfully' });
    });
  });


  //  '/v1/foodtruck'      -Read   http://localhost:3005/v1/foodtruck

  //using postman:  http://localhost:3005/v1/foodtruck/


  api.get('/', (req, res) => {
    Foodtruck.find({}, (err, foodtrucks) => {
      if (err) {
        res.send(err);
      }
      res.json(foodtrucks);
    });
  });


// for filtering by id.
  // '/v1/foodtruck/:id' - Read 1

  //http://localhost:3005/v1/foodtruck/58558447baf4c312968e7765
  api.get('/:id', (req, res) => {
    Foodtruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      res.json(foodtruck);
    });
  });




  // '/v1/foodtruck/:id' - PUT - update an existing record
  //http://localhost:3005/v1/foodtruck/58558447baf4c312968e7765

  api.put('/:id', (req, res) => {
    Foodtruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      foodtruck.name = req.body.name;
      foodtruck.foodtype = req.body.foodtype;
      foodtruck.avgcost = req.body.avgcost;
      foodtruck.geometry.coordinates = req.body.geometry.coordinates;
      foodtruck.save(function(err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: 'foodtruck info updated' });
      });
    });
  });

  // '/v1/foodtruck/:id' - DELETE - remove a foodtruck
  // need to be configured because we need to delete also the reviews related to this foodtruck.
  api.delete('/:id', (req, res) => {
    Foodtruck.remove({
      _id: req.params.id
    }, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }

      // we need to remove the reviews related to the foodtruck we want to delete.

      Review.remove({
        foodtruck: req.params.id
      }, (err, review) => {
        if (err) {
          res.send(err);
        }





      res.json({message: "foodtruck Successfully Removed"});
      });
    });
  });




// For the reviews.

// add review for a specific foodtruck id
// '/v1/foodtruck/reviews/add/:id'

api.post('/reviews/add/:id', function(req,res){

  Foodtruck.findById(req.params.id, function(err, foodtruck){

    if (err){

      res.send(err);
    }

    let newReview = new Review();
    newReview.title = req.body.title;
    newReview.text = req.body.text;
    newReview.foodtruck = foodtruck._id

    // save it
    newReview.save(function(err, review){

      if (err){

        res.send(err);
      }

      // if success, we are gonna need to push this review to the review array of the foodtruck,
      // one foodtruck can have more than one review so it is an array,

      foodtruck.reviews.push(newReview);
      foodtruck.save(function(err){

        if (err){

          res.send(err);
        }

        res.json({message: 'Food truck review saved!'});
      });


    });

  });

});


// query for all the foodtrucks that serve a certain food type: 

// 'v1/foodtruck/foodtype/:foodtype'

// to query using postman:  http://localhost:3005/v1/foodtruck/foodtype/Breakfast

api.get('/foodtype/:foodtype', (req, res) => {
    Foodtruck.find({foodtype:req.params.foodtype}, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      res.json(foodtruck);
    });
  });










// retrive all the reviews for a single fodtruck id.

// 'v1/foodtruck/reviews/:id'

api.get ('/reviews/:id', function(req, res) {

  Review.find({foodtruck: req.params.id}, function(err, reviews){

    if (err){

      res.send(err);
    }

    res.json(reviews);
  });
});


  return api;
}