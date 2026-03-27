import Review from '../../models/Review.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getUserId = (req) => req.user?.id || req.user?._id || req.userId;

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /api/posts/:postId/reviews
 * Cria ou atualiza o review do usuário logado em um post.
 */
export const createOrUpdateReview = async (req, res) => {
  const { postId } = req.params;
  const { stars, comment } = req.body;
  const userId = getUserId(req);

  if (!stars || stars < 1 || stars > 5)
    return res.status(400).json({ message: 'Avaliação deve ser entre 1 e 5 estrelas.' });

  if (!comment || comment.trim().length === 0)
    return res.status(400).json({ message: 'Comentário não pode estar vazio.' });

  if (comment.trim().length > 500)
    return res.status(400).json({ message: 'Comentário deve ter no máximo 500 caracteres.' });

  try {
    const review = await Review.findOneAndUpdate(
      { post: postId, user: userId },
      { stars, comment: comment.trim() },
      { upsert: true, new: true, runValidators: true }
    ).populate('user', 'name avatar');

    res.status(200).json({ message: 'Review salvo com sucesso!', review });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao salvar review.', error: error.message });
  }
};

/**
 * GET /api/posts/:postId/reviews
 * Lista todos os reviews de um post com média e total.
 */
export const getPostReviews = async (req, res) => {
  const { postId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const [reviews, total] = await Promise.all([
      Review.find({ post: postId })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Review.countDocuments({ post: postId }),
    ]);

    const allStars = await Review.find({ post: postId }).select('stars');
    const average =
      allStars.length > 0
        ? parseFloat((allStars.reduce((s, r) => s + r.stars, 0) / allStars.length).toFixed(1))
        : null;

    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: allStars.filter((r) => r.stars === star).length,
    }));

    res.status(200).json({
      reviews,
      average,
      total,
      distribution,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar reviews.', error: error.message });
  }
};

/**
 * GET /api/posts/:postId/reviews/me
 * Retorna o review do usuário logado neste post.
 */
export const getMyReview = async (req, res) => {
  const { postId } = req.params;
  const userId = getUserId(req);

  try {
    const review = await Review.findOne({ post: postId, user: userId });
    res.status(200).json({ review: review || null });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar seu review.', error: error.message });
  }
};

/**
 * PUT /api/posts/:postId/reviews/:reviewId
 * Edita um review (somente o dono).
 */
export const updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { stars, comment } = req.body;
  const userId = getUserId(req);

  if (stars && (stars < 1 || stars > 5))
    return res.status(400).json({ message: 'Avaliação deve ser entre 1 e 5 estrelas.' });

  if (comment && comment.trim().length > 500)
    return res.status(400).json({ message: 'Comentário deve ter no máximo 500 caracteres.' });

  try {
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review não encontrado.' });

    if (review.user.toString() !== userId.toString())
      return res.status(403).json({ message: 'Você não tem permissão para editar este review.' });

    if (stars) review.stars = stars;
    if (comment) review.comment = comment.trim();
    await review.save();

    const updated = await Review.findById(reviewId).populate('user', 'name avatar');
    res.status(200).json({ message: 'Review atualizado!', review: updated });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar review.', error: error.message });
  }
};

/**
 * DELETE /api/posts/:postId/reviews/:reviewId
 * Deleta um review (somente o dono).
 */
export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = getUserId(req);

  try {
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review não encontrado.' });

    if (review.user.toString() !== userId.toString())
      return res.status(403).json({ message: 'Você não tem permissão para deletar este review.' });

    await review.deleteOne();
    res.status(200).json({ message: 'Review deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar review.', error: error.message });
  }
};
