const express = require("express");
const router = express.Router();
const checkAuth = require("../../controllers/authController"); // Ensure this points to your JWT check middleware

// Your database access (replace with your actual DB client)
const supabase = require("../../config/supabaseClient");

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos for the authenticated user
 *     description: Retrieve all todos for the logged-in user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of todos for the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "Buy groceries"
 *                   description:
 *                     type: string
 *                     example: "Need to buy milk, eggs, and bread."
 *                   is_completed:
 *                     type: boolean
 *                     example: false
 *                   user_id:
 *                     type: string
 *                     example: "b85bb9f4-d62b-4bb8-9f80-6d1eeb99f8c1"
 *       401:
 *         description: Unauthorized access, invalid or missing token.
 *       500:
 *         description: Internal server error.
 */
router.get("/", checkAuth, async (req, res) => {
  const { user } = req;
  const { data, error } = await supabase.from("todos").select("*").eq("user_id", user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a single todo by ID for the authenticated user
 *     description: Retrieve a specific todo by its ID for the logged-in user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the todo to retrieve
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: The requested todo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "Buy groceries"
 *                 description:
 *                   type: string
 *                   example: "Need to buy milk, eggs, and bread."
 *                 is_completed:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Invalid todo ID.
 *       404:
 *         description: Todo not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id", checkAuth, async (req, res) => {
  const { id } = req.params;
  const { user } = req;

  if (isNaN(parseInt(id))) {
    return res.status(400).json({ message: "ID must be a number" });
  }

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ message: "Todo not found" });
    }
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
});

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo for the authenticated user
 *     description: Create a new todo item for the logged-in user.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Buy groceries"
 *               description:
 *                 type: string
 *                 example: "Need to buy milk, eggs, and bread."
 *     responses:
 *       201:
 *         description: Todo successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "Buy groceries"
 *                 description:
 *                   type: string
 *                   example: "Need to buy milk, eggs, and bread."
 *                 is_completed:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Internal server error.
 */
router.post("/", checkAuth, async (req, res) => {
  const { title, description } = req.body;
  const { user } = req;

  if (!title) return res.status(400).json({ message: "Title is required" });

  const { data, error } = await supabase
    .from("todos")
    .insert([{ title, description, user_id: user.id }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo for the authenticated user
 *     description: Delete a specific todo by its ID for the logged-in user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the todo to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Todo successfully deleted.
 *       400:
 *         description: Invalid todo ID.
 *       404:
 *         description: Todo not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", checkAuth, async (req, res) => {
  const { id } = req.params;
  const { user } = req;

  if (isNaN(parseInt(id))) {
    return res.status(400).json({ message: "ID must be a number" });
  }

  const { data, error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  if (data.length === 0) return res.status(404).json({ message: "Todo not found" });

  res.status(200).json(data);
});

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo for the authenticated user
 *     description: Update an existing todo item for the logged-in user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the todo to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Buy groceries"
 *               description:
 *                 type: string
 *                 example: "Need to buy milk, eggs, and bread."
 *               is_completed:
 *                 type: boolean
 *                 example: false
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Todo successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "Buy groceries"
 *                 description:
 *                   type: string
 *                   example: "Need to buy milk, eggs, and bread."
 *                 is_completed:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Invalid todo ID or missing fields.
 *       404:
 *         description: Todo not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", checkAuth, async (req, res) => {
  const { id } = req.params;
  const { title, description, is_completed } = req.body;
  const { user } = req;

  const { data, error } = await supabase
    .from("todos")
    .update({ title, description, is_completed })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  if (!data) return res.status(404).json({ message: "Todo not found" });

  res.status(200).json(data);
});


module.exports = router;

