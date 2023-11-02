import express from "express";
import filmModel from "../models/film.model.js";
import validate from '../middlewares/validate.mdw.js';
import { readFile } from 'fs/promises';

const router = express.Router();
const schema = JSON.parse(await readFile(new URL('../schemas/film.json', import.meta.url)));


/**
 * @swagger
 * components:
 *  schemas:
 *    Film:
 *      type: object
 *      required:
 *        - film_id
 *        - title
 *        - language_id
 *        - rental_duration
 *        - rental_rate
 *        - replacement_cost
 *        - last_update
 *      properties:
 *        film_id:
 *          type: number
 *          description: The auto-generated id of the film
 *        title:
 *          type: string
 *          description: The film's title
 *        description:
 *          type: string
 *          description: The description of the film
 *        release_year:
 *          type: year
 *          description: The year release the film
 *        language_id:
 *          type: number
 *          description: The id's language of the film
 *        original_language_id:
 *          type: number
 *          description: The id's original language of the film
 *        rental_duration:
 *          type: number
 *          description: The time for rent
 *        rental_rate:
 *          type: number
 *          description: The rate when rent for film
 *        length:
 *          type: number
 *          description: The length of the film
 *        replacement_cost:
 *          type: number
 *          description: The replacement cost of the film
 *        rating:
 *          type: enum
 *          description: The rating of the film
 *        special_features:
 *          type: string
 *          description: The special feature like "trailers/commentaries/deleted scenes/behind the scene"
 *        last_update:
 *          type: timestamp
 *          description: The time of latest update
 *      example:
 *        id: 001
 *        title: Vinh Hien
 *        last_name: Phan Thien
 *        last_update: 2006-02-15 04:34:34
 *
 */

/**
 * @swagger
 * /api/films:
 *   get:
 *     summary: Returns the list of all the films
 *     tags: [Films]
 *     responses:
 *       200:
 *         description: The list of the films
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Film'
 */

router.get("/", async (req, res) => {
  const list = await filmModel.findAll();
  res.json(list);
});

/**
 * @swagger
 * /api/films/{id}:
 *   get:
 *     summary: Get the film by id
 *     tags: [Films]
 *     parameters:
 *       - in: path
 *         name: film_id
 *         schema:
 *           type: number
 *         required: true
 *         description: The film id
 *     responses:
 *       200:
 *         description: The film description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Film'
 *       404:
 *         description: The film was not found
 */

router.get("/:id", async (req, res) => {
  const id = req.params.id || 0;
  const film = await filmModel.findById(id);
  if (film === null) return res.status(204).end();
  res.json(film);
});

/**
 * @swagger
 * /api/films:
 *   post:
 *     summary: Create a new film
 *     tags: [Films]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Film'
 *     responses:
 *       200:
 *         description: The film was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Film'
 *       500:
 *         description: Some server error, can't create
 */

router.post("/", validate(schema), async (req, res) => {
  let film = req.body;
  const ret = await filmModel.add(film);

  film = {
    film_id: ret[0],
    ...film,
  };
  res.status(201).json(film);
});

/**
 * @swagger
 * /api/films/{id}:
 *   patch:
 *     summary: Update the film by id
 *     tags: [Films]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Update the film by id
 *
 *     responses:
 *       200:
 *         description: The film was updated
 *       404:
 *         description: Some error, can't update
 */

router.patch("/:id", validate(schema), async (req, res) => {
  const id = req.params.id;
  const film = req.body;
  const n = await filmModel.update(id, film);
  res.json({
    affected: n,
  });
});

/**
 * @swagger
 * /api/films/{id}:
 *   delete:
 *     summary: Remove the film by id
 *     tags: [Films]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The film id
 *
 *     responses:
 *       200:
 *         description: The film was deleted
 *       404:
 *         description: The film was not found
 */

router.delete("/:id", validate(schema), async (req, res) => {
  const id = req.params.id || 0;
  const n = await filmModel.delete(id);
  res.json({
    affected: n,
  });
});

export default router;
