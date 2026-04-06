import express from "express";
import request from "supertest";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { RestaurantController } from "./restaurant.controller";
import { RestaurantService } from "./restaurant.service";

jest.mock("./restaurant.service");

const mockedRestaurantService = RestaurantService as jest.Mocked<typeof RestaurantService>;

const app = express();
app.use(express.json());

app.get("/restaurants", RestaurantController.list);
app.post("/restaurants", RestaurantController.create);
app.get("/restaurants/:id", RestaurantController.getById);
app.patch("/restaurants/:id", RestaurantController.update);
app.delete("/restaurants/:id", RestaurantController.remove);

describe("RestaurantController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /restaurants", () => {
    it("should list restaurants", async () => {
      mockedRestaurantService.list.mockResolvedValue([{ id: "1", name: "Cafe" }] as any);

      const res = await request(app).get("/restaurants");

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([{ id: "1", name: "Cafe" }]);
    });
  });

  describe("POST /restaurants", () => {
    it("should create restaurant", async () => {
      mockedRestaurantService.create.mockResolvedValue({ id: "1", name: "Cafe" } as any);

      const res = await request(app).post("/restaurants").send({ name: "Cafe" });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("Cafe");
    });
  });

  describe("GET /restaurants/:id", () => {
    it("should return a restaurant", async () => {
      mockedRestaurantService.getById.mockResolvedValue({ id: "1", name: "Cafe" } as any);

      const res = await request(app).get("/restaurants/1");

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe("1");
    });
  });

  describe("PATCH /restaurants/:id", () => {
    it("should update a restaurant", async () => {
      mockedRestaurantService.update.mockResolvedValue({ id: "1", name: "New Cafe" } as any);

      const res = await request(app).patch("/restaurants/1").send({ name: "New Cafe" });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("New Cafe");
    });
  });

  describe("DELETE /restaurants/:id", () => {
    it("should remove a restaurant", async () => {
      mockedRestaurantService.remove.mockResolvedValue({ id: "1", name: "Cafe" } as any);

      const res = await request(app).delete("/restaurants/1");

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe("1");
    });
  });
});