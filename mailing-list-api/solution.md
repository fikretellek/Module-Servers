# Mailing List REST API - solution

In order to understand the approach in this solution, we'll investigate the testing and implementation of a single endpoint. After this detailed approach, it should hopefully be easier to understand how the rest of the solution works.

### API tests 🧪

Inside `app.test.js` you can find a set of API tests. An API test calls an API endpoint and checks it returns the correct response. We can check that the response is correct by making assertions about various properties of the response like the status code, body etc. An API test may also check that the state of the database has been altered after calling a given endpoint. For example, with a DELETE endpoint, we may want to assert that the resource we wished to delete has actually been deleted.

It's important to note that I've started the solution by examining a test _first_. I've done this to reflect the order in which I wrote the code.
I always started writing the test first so I could specify the exact behaviour of the endpoint before I implemented the endpoint itself.

### GET `/lists` endpoint

Let's take a look at the test for the GET `/lists` endpoint:

```js
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
```

In this test, we're making use of the supertest module to perform a GET request to our app.
It's worth noting how we're using supertest here:

```js
request(app).get("/lists");
```

Here we're invoking `request` with the `app` object, so supertest will start a test server using `app` and then perform the GET request to the `/lists` endpoint. This is worth noting because we're not explicitly using `app.listen` anywhere in the source code; we don't need to explicitly set our server to listen when we're using supertest. We'll need to call `app.listen` when we want to run our server in a development environment and make requests to it using an application like Postman.

In this test we then go on to assert that we've got a 200 status code and that the response body contains all the correct list names:

```js
.expect(200)
.then((res) => {
      expect(res.body).toEqual({
        listNames: ["staff", "cohort-h1-2020"],
      });
});
```

The first chained method `.expect` is part of the supertest API and not part of Jest. Once the promise has resolved we use the expect API from Jest to assert on the response body inside the `then` block.

## Test cleanup 🧹

What is test cleanup? In order to think about this let's consider two separate endpoints:

1. GET `/lists`
2. POST `lists/:name`

The first endpoint can be called several times and the state of the database won't be changed; we're only reading the lists data contained within the database. However, with the second endpoint, if we call it `n` times then we create `n` new resources. In this case, the state of the database is changing after each POST request. In a situation when we are testing endpoints like this, our tests stop being **isolated** because they're both updating the same database. Suddenly a test that checks for a list of items might fail because we've added some list items in another test case.

In order to solve this problem, we need to do **test cleanup**. This means we're going to reset some state between each test run so any actions performed by one test don't affect the outcome in a separate test case. In the context of our test suite, we'll want to ensure we reset the database after each test run.

Nested inside the outer `describe` block in `app.test.js` we have the following piece of code:

```js
afterEach(() => {
  resetDB();
});
```

This is an `afterEach` hook. It is part of the JEST API that allows us to run functionality at certain points in our test run. In this case, the `afterEach` hook will invoke the callback that is passed to it after every test runs ( after each `it` block inside the `describe` block ). So here the `resetDB` function is called after every test run and it's this function that returns the database to its original state.

## GET `/lists` endpoint implementation

All the endpoints for the API are implemented in `app.js`. Let's look specifically at the implementation for the GET `/lists` endpoint:

```js
app.get("/lists", (req, res, next) => {
  const listNames = fetchLists();

  res.status(200).send({ listNames });
});
```

Here we're using the standard express syntax to setup a handler function for the `/lists` route. Inside the handler function we make a call to the `fetchLists` function which returns the list names we want to serve back to the client. The `fetchLists` function is supposed to simulate a similar method one might encounter when working with a package that provides some API for accessing data in a database. From the viewpoint of this handler function, its role is to call a database method to access some lists, but this handler isn't concerned with how the database method is implemented.

## Note on the database methods ❗ ( more advanced )

At the top of `app.js` we require in a bunch of functions from `./db/index.js` ( `./` refers to the root of this repo here ):

```js
const {
  fetchList,
  updateList,
  deleteList,
  fetchLists,
} = require("./db/index.js");
```

These functions are exported from `./db/index.js` using the [IIFE pattern](https://web.archive.org/web/20171201033208/http://benalman.com/news/2010/11/immediately-invoked-function-expression/#iife). **IIFE** stands for **Immediately Invoked Function Expression** and is useful for **encapsulation**. Encapsulation means keeping some data private ( the "database" ) and only making it accessible/modifiable via a bunch of functions. Let's look at `./db/index.js`:

```js
module.exports = (() => {
  let _database = {
    staff: ["talea@techtonica.org", "michelle@techtonica.org"],
    "cohort-h1-2020": [
      "ali@techtonica.org",
      "humail@techtonica.org",
      "khadar@techtonica.org",
    ],
  };
  return {
    fetchLists: () => {
      return Object.keys(_database);
    },
    update: (newData) => {
      _database = newData;
    },
    updateList: (name, newList) => {
      _database[name] = newList;
    },
    fetchList: (name) => {
      return _database[name];
    },
    deleteList: (name) => {
      delete _database[name];
    },
  };
})();
```

We're exporting an arrow function that's wrapped up in parentheses and then invoked straight away. So the exports object will actually evaluate to be the object returned from this immediately invoked arrow function. However, the methods inside the returned object will still have access to the `_database` variable. This is an example of [closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures): when some variables can still be referenced by functions even when those functions are returned out of the scope in which they're defined.
