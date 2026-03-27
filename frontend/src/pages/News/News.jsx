import './news.css'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Loading from '../../components/Loading/Loading.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { formatDistanceToNow, format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { BsPatchCheckFill } from 'react-icons/bs'
import api from '../../services/api'

function News() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [news, setNews] = useState(null)
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { userData } = useAuth()

    useEffect(() => {
        async function fetchNews() {
            try {
                const response = await api.get(`/news/${id}`)
                setNews(response.data)
            } catch (error) {
                console.error('Erro ao carregar notícia:', error)
            }
        }

        fetchNews()
    }, [id])

    if (!news) {
        return <Loading />
    }

    async function handleCommentSubmit(e) {
        e.preventDefault()

        if (!comment.trim()) return

        if (!userData) {
            alert('Faça login para adicionar um comentário')
            navigate('/login')
            return
        }

        try {
            setIsSubmitting(true)

            await api.post(`/news/${id}/comments`, { content: comment.trim() })

            const response = await api.get(`/news/${id}`)
            setNews(response.data)

            setComment('')
        } catch (error) {
            console.error('Erro ao enviar comentário:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleDeleteComment(commentId) {
        const confirmDelete = window.confirm('Deseja excluir este comentário?')

        if (!confirmDelete) return

        try {
            await api.delete(`/news/${id}/comments/${commentId}`)

            const response = await api.get(`/news/${id}`)
            setNews(response.data)
        } catch (error) {
            console.error('Erro ao deletar comentário:', error)
        }
    }

    const date = parseISO(news.createdAt)
    const formattedDate = format(date, 'dd/MM/yyyy')
    const formattedTime = format(date, 'HH:mm')

    return (
        <div className='page'>
            <h1 className='news-title'>{news.title}</h1>
            <span className='news-info'>
                Por{' '}
                <strong
                    className='author'
                    onClick={() => navigate(`/user-profile/${news.author?._id}`)}
                >
                    {news.author?.name || 'Autor desconhecido'}
                </strong>{' '}
                em {formattedDate} às {formattedTime}
            </span>

            {news.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}

            {news.image && news.imageDescription && (
                <div className='news-image-section'>
                    <img
                        src={news.image}
                        alt={news.imageDescription || news.title}
                        className='news-image'
                    />
                    <span className='news-image-description'>{news.imageDescription}</span>
                </div>
            )}

            <div className='comments-section'>
                <h3>Comentários</h3>

                <form onSubmit={handleCommentSubmit} className='comment-form'>
                    <div className='comment-form-content'>
                        <textarea
                            className='comment-input'
                            placeholder='Adicione um comentário...'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows='2'
                            required
                        />
                        <button
                            type='submit'
                            className='comment-submit-button'
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '...' : '➤'}
                        </button>
                    </div>
                </form>

                {news.comments && news.comments.length > 0 ? (
                    news.comments.map((c) => (
                        <div key={c._id} className='comment'>
                            <div
                                className='profile-picture'
                                onClick={() => navigate(`/user-profile/${c.user._id}`)}
                            >
                                {c.user?.name ? c.user.name.charAt(0).toUpperCase() : '?'}
                            </div>

                            <div className='comment-info'>
                                <div className='comment-header'>
                                    <span
                                        className='comment-user'
                                        onClick={() => navigate(`/user-profile/${c.user._id}`)}
                                    >
                                        {c.user?.name || 'Usuário desconhecido'}
                                        {c.user?.collaborator && (
                                            <BsPatchCheckFill
                                                className='verified-icon-p'
                                                title='Colaborador'
                                            />
                                        )}
                                    </span>

                                    <span className='comment-date'>
                                        •{' '}
                                        {formatDistanceToNow(new Date(c.createdAt), {
                                            addSuffix: true,
                                            locale: ptBR
                                        })}
                                    </span>
                                </div>
                                <div className='comment-content'>{c.content}</div>
                            </div>

                            {userData && c.user?._id === userData.id && (
                                <button
                                    className='delete-comment-button'
                                    onClick={() => handleDeleteComment(c._id)}
                                >
                                    Excluir
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className='no-comments'>Nenhum comentário ainda</p>
                )}
            </div>
        </div>
    )
}

export default News
