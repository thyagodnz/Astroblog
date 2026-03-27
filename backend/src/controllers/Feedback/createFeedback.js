import Feedback from '../../models/Feedback.js'

export async function createFeedback(req, res) {
    try {
        const { message } = req.body

        if (!message || !message.trim()) {
            return res.status(400).json({
                message: 'O feedback é obrigatório.'
            })
        }

        if (message.trim().length < 5) {
            return res.status(400).json({
                message: 'O feedback deve ter pelo menos 5 caracteres.'
            })
        }

        const feedback = await Feedback.create({
            user: req.user._id,
            message: message.trim()
        })

        return res.status(201).json({
            message: 'Feedback enviado com sucesso.',
            feedback
        })
    } catch (error) {
        console.error('Erro ao criar feedback:', error)

        return res.status(500).json({
            message: 'Erro interno do servidor.'
        })
    }
}