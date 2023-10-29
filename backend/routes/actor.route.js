import express from "express";
import actorModel from "../models/actor.model.js";
import validate from '../middlewares/validate.mdw.js';
import { readFile } from 'fs/promises';

const router = express.Router();
const schema = JSON.parse(await readFile(new URL('../schemas/actor.json', import.meta.url)));



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
 *   patch:
 *     summary: Update the actor by id
 *     tags: [Actors]
 *     parameters:
 *       - in: path
 *         name: actor_id
 *         schema:
 *           type: number
 *         required: true
 *         description: Update the actor by id
 *
 *     responses:
 *       200:
 *         description: The actor was updated
 *       404:
 *         description: Some error, can't update
 */

router.patch("/:id", validate(schema), async (req, res) => {
  const id = req.params.id;
  const actor = req.body;
  const n = await actorModel.update(id, actor);
  res.json({
    affected: n,
  });
});

/**
 * @swagger
 * /api/actors/{id}:
 *   delete:
 *     summary: Remove the actor by id
 *     tags: [Actors]
 *     parameters:
 *       - in: path
 *         name: actor_id
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

router.delete("/:id", validate(schema), async (req, res) => {
  const id = req.params.id || 0;
  const n = await actorModel.delete(id);
  res.json({
    affected: n,
  });
});

export default router;
