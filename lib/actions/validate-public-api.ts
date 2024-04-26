import { getUserByEmail } from "@lib/data/user";
import { UserRole } from "@lib/utils/types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const validatePublicApi = async (authorizationHeader: string | null) => {
  // check authorization header
  if (!authorizationHeader) {
    return {
      message: "Authorization header is missing",
      status: 401,
    };
  }

  // get token from authorization header
  const [, token] = authorizationHeader.split(" ");
  if (!token) {
    return {
      message: "Authorization token is missing",
      status: 401,
    };
  }

  // decode token
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as {
    email: string;
    password: string;
  };

  // verify decoded token if user is existing in DB
  const loginUser = await getUserByEmail(decodedToken.email);
  if (!loginUser) {
    return {
      message: "Invalid email",
      status: 401,
    };
  }

  if (!loginUser.password) {
    return {
      message: "Password missing",
      status: 401,
    };
  }

  // compare the provided password with the hashed password
  const passwordMatch = await bcrypt.compare(
    decodedToken.password,
    loginUser.password
  );
  if (!passwordMatch) {
    return {
      message: "Invalid password",
      status: 401,
    };
  }

  // USER role is not allowed to access API
  if (loginUser.role === UserRole.USER) {
    return {
      message: "Forbidden",
      status: 403,
    };
  }

  // all validation passed
  return {
    message: "Success",
    status: 200,
    loginUser: loginUser,
  };
};
