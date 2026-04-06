import request from "supertest";
import express from "express";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
jest.mock("./user.service");

const mockedUserService = UserService as jest.Mocked<typeof UserService>;

const app = express();
app.use(express.json());

app.post("/register", UserController.register);
app.post("/login", UserController.login);
app.get("/profile", (req, res, next) => {
  (req as any).user = { id: "1" };
  return UserController.profile(req, res, next);
});

describe("UserController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /register", () => {
    it("should register user", async () => {

      mockedUserService.register.mockResolvedValue({
        id: "1",
        email: "test@test.com",
      } as any);

      const res = await request(app).post("/register").send({
        email: "test@test.com",
        password: "123456",
        username: "test",
      });

      expect(res.status).toBe(201);
      expect(res.body.data.email).toBe("test@test.com");
    });
  });

  describe("POST /login", () => {
    it("should login user", async () => {
      mockedUserService.login.mockResolvedValue({
        email: "test@test.com",
        username: "test",
        token: "token",
      } as any);

      const res = await request(app).post("/login").send({
        email: "test@test.com",
        password: "123456",
      });

      expect(res.status).toBe(200);
      expect(res.body.data.token).toBe("token");
    });
  });

  describe("GET /profile", () => {
    it("should return profile", async () => {
      mockedUserService.profile.mockResolvedValue({
        id: "1",
        email: "test@test.com",
      } as any);

      const res = await request(app).get("/profile");

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe("1");
    });
  });
});
