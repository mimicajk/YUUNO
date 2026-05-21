const Post = require("../models/Post");

// Crear post
const createPost = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Contenido requerido" });
        }

        const post = await Post.create({
            user: req.user._id,
            content,
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: "Error creando post" });
    }
};

// Obtener todos los posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "username")
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo posts" });
    }
};

module.exports = {
    createPost,
    getPosts,
};