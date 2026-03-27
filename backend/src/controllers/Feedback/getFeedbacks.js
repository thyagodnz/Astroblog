import Feedback from '../../models/Feedback.js'

export async function getFeedbacks(req, res) {
    try {
        const feedbacks = await Feedback.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })

        return res.status(200).json(feedbacks)
    } catch (error) {
        console.error('Erro ao buscar feedbacks:', error)

        return res.status(500).json({
            message: 'Erro interno do servidor.'
        })
    }
}