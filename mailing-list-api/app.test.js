const app = require("./app.js");
const request = require("supertest");
const { fetchList } = require("./db/index.js");
const { resetDB } = require("./db/reset-db.js");

describe("Mailing list API", () => {
  afterEach(() => {
    resetDB();
  });
  describe("/lists", () => {
    it("GET - 200 - should fetch all the existing list names", () => {
      return request(app)
        .get("/lists")
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            listNames: ["staff", "cohort-h1-2020"],
          });
        });
    });
  });
  describe("/lists/:name", () => {
    it("GET - 200 - should fetch a single list by name", () => {
      const name = "staff";

      return request(app)
        .get(`/lists/${name}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            name: "staff",
            members: ["talea@techtonica.org", "michelle@techtonica.org"],
          });
        });
    });
    it("GET - 404 - staff name is not found", () => {
      const name = "iman";

      return request(app)
        .get(`/lists/${name}`)
        .expect(404)
        .then((res) => {
          expect(res.body).toEqual({
            message: `no listing found for ${name}`,
          });
        });
    });
    it("DELETE - 200 - can delete a list", () => {
      const name = "cohort-h1-2020";

      return request(app)
        .delete(`/lists/${name}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            message: `listing for ${name} was deleted`,
          });
          expect(fetchList(name)).toBe(undefined);
        });
    });
    it("DELETE - 404 - doesn't delete name that doesn't exist", () => {
      const name = "iman";

      return request(app)
        .delete(`/lists/${name}`)
        .expect(404)
        .then((res) => {
          expect(res.body).toEqual({
            message: `no listing found for ${name}`,
          });
        });
    });
    it("PUT - 200 - updates a list that already exists", () => {
      const name = "staff";

      return request(app)
        .put(`/lists/${name}`)
        .send({ name, members: ["bahar@techtonica.org"] })
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({});
          expect(fetchList(name)).toEqual(["bahar@techtonica.org"]);
        });
    });
    it("PUT- 201 - creates a new list", () => {
      const name = "iman";

      return request(app)
        .put(`/lists/${name}`)
        .send({
          name,
          members: ["sally@techtonica.org", "alicia@techtonica.org"],
        })
        .expect(201)
        .then((res) => {
          expect(res.body).toEqual({});
          expect(fetchList(name)).toEqual([
            "sally@techtonica.org",
            "alicia@techtonica.org",
          ]);
        });
    });
  });
  describe("/lists/:name/members", () => {
    it("GET - 200 - gets members only", () => {
      const name = "cohort-h1-2020";

      return request(app)
        .get(`/lists/${name}/members`)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            members: [
              "ali@techtonica.org",
              "humail@techtonica.org",
              "khadar@techtonica.org",
            ],
          });
        });
    });
  });
  describe("/lists/:name/members/email", () => {
    it("PUT - 200 - adds email to the members list for a given name", () => {
      const name = "staff";
      const newEmail = "mitch@techtechtonica.org";

      return request(app)
        .put(`/lists/${name}/members/email`)
        .send({ email: newEmail })
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({});
          expect(fetchList(name)).toEqual([
            "talea@techtonica.org",
            "michelle@techtonica.org",
            "mitch@techtechtonica.org",
          ]);
        });
    });
    it("DELETE - 200 - remove the supplied email from the list", () => {
      const name = "staff";
      const emailToDelete = "talea@techtonica.org";

      return request(app)
        .delete(`/lists/${name}/members/email`)
        .send({ email: emailToDelete })
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({});
          expect(fetchList(name)).toEqual(["michelle@techtonica.org"]);
        });
    });
  });
});
