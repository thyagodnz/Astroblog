import { Router } from 'express'
import { UserController, NewsController } from './controllers/index.js'
import upload from './middlewares/upload.js'
import { auth } from './middlewares/auth.js'

const routes = Router()

routes.get('/users', UserController.getUsers)
routes.get('/users/:id', UserController.getUserById)
routes.get('/me', auth, UserController.getMe) //🔒
routes.post('/users', UserController.createUser)
routes.post('/login', UserController.loginUser)
routes.post('/logout', auth, UserController.logoutUser) //🔒
routes.post('/users/forgot-password', UserController.forgotPassword)
routes.post('/users/be-collaborator', auth, UserController.beCollaborator) //🔒
routes.put('/users/:id', auth, UserController.updateUser) //🔒
routes.delete('/users/:id', UserController.deleteUser)

routes.get('/news', NewsController.getNews)
routes.get('/news/:id', NewsController.getNewsById)
routes.get('/news/author/:author', NewsController.getNewsByAuthor)
routes.post('/news', auth, upload.single('image'), NewsController.createNews) //🔒
routes.put('/news/:id', NewsController.updateNews)
routes.delete('/news/:id', NewsController.deleteNews)

routes.post('/news/:id/comments', auth, NewsController.addComment) //🔒
routes.delete('/news/:newsId/comments/:commentId', auth, NewsController.deleteComment) //🔒

export default routes