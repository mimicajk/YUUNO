const Post = require("../models/Post");

// ==========================
// Crear post
// ==========================
const createPost = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Contenido requerido" });
        }

        let post = await Post.create({
            user: req.user._id,
            content,
        });

        // ✅ Importantísimo: popular usuario antes de devolver
        post = await post.populate("user", "username");

        res.status(201).json(post);

    } catch (error) {
        res.status(500).json({ message: "Error creando post" });
    }
};

// ==========================
// Obtener posts
// ==========================
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

// ==========================
// Toggle Like
// ==========================
const toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post no encontrado" });
        }

        const userId = req.user._id.toString();

        const alreadyLiked = post.likes.some(
            id => id.toString() === userId
        );

        if (alreadyLiked) {
            post.likes = post.likes.filter(
                id => id.toString() !== userId
            );
        } else {
            post.likes.push(req.user._id);
        }

        await post.save();

        res.json({
            message: alreadyLiked ? "Like removido" : "Like agregado",
            totalLikes: post.likes.length
        });

    } catch (error) {
        res.status(500).json({ message: "Error al procesar like" });
    }
};

module.exports = {
    createPost,
    getPosts,
    toggleLike,
};