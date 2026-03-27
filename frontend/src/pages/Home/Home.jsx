import './home.css'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

function Home() {
  const navigate = useNavigate()
  const { userData } = useAuth()

  const [newsList, setNewsList] = useState([])
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [sendingFeedback, setSendingFeedback] = useState(false)
  const [feedbackStatus, setFeedbackStatus] = useState('')

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await api.get('/news')
        setNewsList(response.data)
      } catch (error) {
        console.error('Erro ao buscar notícias:', error)
      }
    }

    fetchNews()
  }, [])

  const goToNews = (id) => {
    navigate(`/news/${id}`)
  }

  const handleSubmitFeedback = async (e) => {
    e.preventDefault()

    if (!feedbackMessage.trim()) {
      setFeedbackStatus('Digite um feedback antes de enviar.')
      return
    }

    try {
      setSendingFeedback(true)
      setFeedbackStatus('')

      await api.post('/feedbacks', {
        message: feedbackMessage
      })

      setFeedbackMessage('')
      setFeedbackStatus('Feedback enviado com sucesso!')
    } catch (error) {
      console.error('Erro ao enviar feedback:', error)
      setFeedbackStatus(
        error.response?.data?.message || 'Não foi possível enviar o feedback.'
      )
    } finally {
      setSendingFeedback(false)
    }
  }

  const firstNews = newsList[0]
  const otherNews = newsList.slice(1)

  return (
    <div className='page'>
      {firstNews && (
        <div className='featured-news' onClick={() => goToNews(firstNews._id)}>
          <img src={firstNews.image} alt={firstNews.title} className='featured-image' />
          <h1 className='featured-title'>{firstNews.title}</h1>
        </div>
      )}

      <div className='news-grid'>
        {otherNews.map((news) => (
          <div key={news._id} className='news-card' onClick={() => goToNews(news._id)}>
            <img src={news.image} alt={news.title} className='news-card-image' />
            <h2 className='news-card-title'>{news.title}</h2>
          </div>
        ))}
      </div>

      {userData && (
        <section className='feedback-section'>
          <h2 className='feedback-title'>Envie seu feedback</h2>
          <p className='feedback-description'>
            Encontrou algum problema, erro ou tem alguma sugestão para melhorar o
            Astroblog? Escreva abaixo.
          </p>

          <form className='feedback-form' onSubmit={handleSubmitFeedback}>
            <textarea
              className='feedback-textarea'
              placeholder='Escreva aqui seu feedback sobre o sistema...'
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              rows={5}
            />

            <button
              type='submit'
              className='feedback-button'
              disabled={sendingFeedback}
            >
              {sendingFeedback ? 'Enviando...' : 'Enviar feedback'}
            </button>
          </form>

          {feedbackStatus && (
            <p className='feedback-status'>{feedbackStatus}</p>
          )}
        </section>
      )}

    </div>
  )
}

export default Home
