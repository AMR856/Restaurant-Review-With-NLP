import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { UserService } from "./user.service";
import { UserModel } from "./user.model";
import CustomError from "../../types/customError";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

jest.mock("./user.model", () => ({
  UserModel: {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  },
}));

const mockedUserModel = UserModel as jest.Mocked<typeof UserModel>;

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      mockedUserModel.findByEmail.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue("hashedPassword" as never);

      mockedUserModel.create.mockResolvedValue({
        id: "1",
        email: "test@test.com",
      } as any);

      const result = await UserService.register({
        email: "test@test.com",
        password: "123456",
        username: "test",
      });

      expect(result).toEqual({
        id: "1",
        email: "test@test.com",
      });

      expect(mockedBcrypt.hash).toHaveBeenCalledWith("123456", 8);
    });

    it("should continue normally if user exists", async () => {
      mockedUserModel.findByEmail.mockResolvedValue({ id: "1" } as any);
      const result = await UserService.register({
        email: "test@test.com",
        password: "123456",
        username: "test",
      });
      expect(result).toEqual({
        id: "1",
      });
    });
  });

  describe("login", () => {
    it("should login successfully", async () => {
      mockedUserModel.findByEmail.mockResolvedValue({
        id: "1",
        email: "test@test.com",
        username: "test",
        password: "hashed",
      } as any);

      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedJwt.sign.mockReturnValue("token" as never);

      process.env.JWT_SECRET = "secret";

      const result = await UserService.login({
        email: "test@test.com",
        password: "123456",
      });

      expect(result).toEqual({
        email: "test@test.com",
        username: "test",
        token: "token",
      });

      expect(mockedJwt.sign).toHaveBeenCalledWith(
        { id: "1", email: "test@test.com" },
        "secret",
        { expiresIn: "7d" },
      );
    });

    it("should throw if user not found", async () => {
      mockedUserModel.findByEmail.mockResolvedValue(null);

      await expect(
        UserService.login({
          email: "test@test.com",
          password: "123456",
        }),
      ).rejects.toThrow(CustomError);
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });

    it("should throw if password invalid", async () => {
      mockedUserModel.findByEmail.mockResolvedValue({
        password: "hashed",
      } as any);

      mockedBcrypt.compare.mockResolvedValue(false as never);

      await expect(
        UserService.login({
          email: "test@test.com",
          password: "123456",
        }),
      ).rejects.toThrow(CustomError);
    });
  });

  describe("profile", () => {
    it("should return user profile", async () => {
      mockedUserModel.findById.mockResolvedValue({
        id: "1",
        email: "test@test.com",
      } as any);

      const result = await UserService.profile({ userId: "1" });

      expect(result).toEqual({
        id: "1",
        email: "test@test.com",
      });
    });

    it("should throw if no userId", async () => {
      await expect(UserService.profile({ userId: "" })).rejects.toThrow(
        CustomError,
      );

      expect(mockedUserModel.findById).not.toHaveBeenCalled();
    });

    it("should throw if user not found", async () => {
      mockedUserModel.findById.mockResolvedValue(null);

      await expect(UserService.profile({ userId: "1" })).rejects.toThrow(
        CustomError,
      );
    });
  });
});
