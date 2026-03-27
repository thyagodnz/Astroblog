import { getUsers } from './User/getUsers.js'
import { createUser } from './User/createUser.js'
import { deleteUser } from './User/deleteUser.js'
import { updateUser } from './User/updateUser.js'
import { loginUser } from './User/loginUser.js'
import { logoutUser } from './User/logoutUser.js'
import { getUserById } from './User/getUserById.js'
import { getMe } from './User/getMe.js'
import { forgotPassword } from './User/forgotPassword.js'
import { beCollaborator } from './User/beCollaborator.js'

import { getNews } from './News/getNews.js'
import { createNews } from './News/createNews.js'
import { deleteNews } from './News/deleteNews.js'
import { updateNews } from './News/updateNews.js'
import { getNewsById } from './News/getNewsById.js'
import { addComment } from './News/addComment.js'
import { deleteComment } from './News/deleteComment.js'
import { getNewsByAuthor } from './News/getNewsByAuthor.js'

import { createFeedback } from './Feedback/createFeedback.js'
import { getFeedbacks } from './Feedback/getFeedbacks.js'

export const UserController = {
    getUsers,
    createUser,
    deleteUser,
    updateUser,
    loginUser,
    logoutUser,
    getUserById,
    getMe,
    forgotPassword,
    beCollaborator,
}

export const NewsController = {
    getNews,
    createNews,
    deleteNews,
    updateNews,
    getNewsById,
    addComment,
    deleteComment,
    getNewsByAuthor,
}

export const FeedbackController = {
    createFeedback,
    getFeedbacks,
}