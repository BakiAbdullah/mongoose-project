import httpStatus from 'http-status'
import { AuthServices } from './auth.service'
import { catchAsync } from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in succesfully!',
    data: result,
  })
})

// const changePassword = catchAsync(async (req, res) => {
//   const { ...passwordData } = req.body

//   const result = await AuthServices.changePassword(req.user, passwordData)
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Password is updated succesfully!',
//     data: result,
//   })
// })

// const refreshToken = catchAsync(async (req, res) => {
//   const { refreshToken } = req.cookies
//   const result = await AuthServices.refreshToken(refreshToken)

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Access token is retrieved succesfully!',
//     data: result,
//   })
// })

export const AuthControllers = {
  loginUser,
  // changePassword,
  // refreshToken,
}
