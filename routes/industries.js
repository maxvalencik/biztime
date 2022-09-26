// Routes for industries


const express = require("express");
const slugify = require("sk")
const ExpressError = require("../expressError")
const db = require("../db");

let router = new express.Router();


// Select industries
// GET / =>  {industires: [{code, detail}, ...]} 

router.get("/", async function (req, res, next) {
  try {
    const industires = await db.query(
          `SELECT code, detail
           FROM industries 
           ORDER BY code`
    );

    return res.json({"industries": industries.rows});
  }

  catch (err) {
    return next(err);
  }
});


//add an industry
// POST / =>  {industry: {code, detail}}

router.post("/", async function (req, res, next) {
  try {
    let {code, detail} = req.body;
    let coded = slugify(code, {lower: true});

    const result = await db.query(
          `INSERT INTO industries (code, detail) 
           VALUES ($1, $2, $3) 
           RETURNING code, name, description`,
        [coded, detail]);

    return res.status(201).json({"industry": result.rows[0]});
  }

  catch (err) {
    return next(err);
  }
});


//aassociate industry to company
// POST / =>  {industry code added: {company_id, industry_id)}

router.post("/:comp_id/:ind_id", async function (req, res, next) {
  try {
    let {comp_id, ind_id} = req.body;

    const result = await db.query(
          `INSERT INTO comp_ind (company_id, industry_id) 
           VALUES ($1, $2) 
           RETURNING company_id,indsutry_id`,
        [comp_id, ind_id]);

    return res.status(201).json({"Industry code added": result.rows[0]});
  }

  catch (err) {
    return next(err);
  }
});