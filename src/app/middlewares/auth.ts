import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { TUserRole } from '../modules/user/user.interface'
import { catchAsync } from '../utils/catchAsync'
import AppError from '../errors/AppError'
import config from '../config'
import { User } from '../modules/user/user.model'

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
    }

    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload

    console.log({ decoded })

    const { role, userId, iat } = decoded
    console.log({ role })

    // checking if the user is exist
    const user = await User.isUserExistsByCustomId(userId)

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
    }
    // checking if the user is already deleted

    const isDeleted = user?.isDeleted

    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !')
    }

    // checking if the user is blocked
    const userStatus = user?.status

    if (userStatus === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !!')
    }

    //! problem resolved using await ------->
    const hasPassChangedBeforeTokenIssue =
      await User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt as Date,
        iat as number,
      )
    console.log(hasPassChangedBeforeTokenIssue)
    if (user.passwordChangedAt && hasPassChangedBeforeTokenIssue) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized, your password has changed !',
      )
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized hi!')
    }

    req.user = decoded as JwtPayload
    next()
  })
}

export default auth
