import express from "express";
import actorModel from "../models/actor.model.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Actor:
 *      type: object
 *      required:
 *        - actor_id
 *        - first_name
 *        - last_name
 *        - last_update
 *      properties:
 *        actor_id:
 *          type: number
 *          description: The auto-generated id of the actor
 *        first_name:
 *          type: string
 *          description: The actor's first name
 *        last_name:
 *          type: string
 *          description: The actor's last name
 *        last_update:
 *          type: timestamp
 *          description: The time of latest updated
 *      example:
 *        actor_id: 999
 *        first_name: Vinh Hien
 *        last_name: Phan Thien
 *        last_update: 2006-02-15 04:34:34
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
 * /api/actors:
 *   get:
 *     summary: Returns the list of all the actors
 *     tags: [Actors]
 *     responses:
 *       200:
 *         description: The list of the actor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Actor'
 */

router.get("/", async (req, res) => {
  const list = await actorModel.findAll();
  res.json(list);
});

/**
 * @swagger
 * /api/actors/{id}:
 *   get:
 *     summary: Get the actor by id
 *     tags: [Actors]
 *     parameters:
 *       - in: path
 *         name: actor_id
 *         schema:
 *           type: number
 *         required: true
 *         description: The actor id
 *     responses:
 *       200:
 *         description: The actor description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actor'
 *       404:
 *         description: The actor was not found
 */

router.get("/:id", async (req, res) => {
  const id = req.params.id || 0;
  const actor = await actorModel.findById(id);
  if (actor === null) return res.status(204).end();
  res.json(actor);
});

/**
 * @swagger
 * /api/actors:
 *   post:
 *     summary: Create a new actor
 *     tags: [Actors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Actor'
 *     responses:
 *       200:
 *         description: The actor was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actor'
 *       500:
 *         description: Some server error
 */
router.post("/", async (req, res) => {
  let actor = req.body;
  const ret = await actorModel.add(actor);

  actor = {
    actor_id: ret[0],
    ...actor,
  };
  res.status(201).json(actor);
});


/**
 * @swagger
 * /api/actors/{id}:
 *   delete:
 *     summary: Remove the actor by id
 *     tags: [Actors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The actor id
 *
 *     responses:
 *       200:
 *         description: The actor was deleted
 *       404:
 *         description: The actor was not found
 */

router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const actor = req.body;
    const n = await actorModel.update(id, actor);
    res.json({
        affected: n
    });
})

router.delete("/:id", async (req, res) => {
  const id = req.params.id || 0;
  const n = await actorModel.delete(id);
  res.json({
    affected: n,
  });
});

export default router;
