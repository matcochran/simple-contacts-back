const cors = require("cors");
const express = require("express");

const app = express();
app.use(cors());
app.use(express.static("build"));
app.use(express.json());

let contacts = [
  {
    firstName: "Dummy",
    lastName: "Test",
    email: "test@outlook.com",
    mobile: "0987654321",
    createdDate:
      "Mon Mar 07 2022 22:21:26 GMT+1100 (Australian Eastern Daylight Time)",
    id: 1,
  },
  {
    firstName: "Test",
    lastName: "Dummy",
    email: "test@gmail.com",
    mobile: "1234567890",
    createdDate:
      "Mon Mar 07 2022 22:23:27 GMT+1100 (Australian Eastern Daylight Time)",
    id: 2,
  },
];

app.get("/api/contacts", (request, response) => {
  response.json(contacts);
});

app.get("/api/contacts/:id", (request, response) => {
  const id = +request.params.id;
  const contact = contacts.find((contact) => contact.id === id);

  if (contact) response.json(contact);
  else response.status(404).end();
});

const generateId = () => {
  const maxId =
    contacts.length > 0 ? Math.max(...contacts.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/contacts", (request, response) => {
  const body = request.body;
  if (!body.firstName || !body.lastName || !body.email || !body.mobile) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const contact = {
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    mobile: body.mobile,
    createdDate: new Date(),
    id: generateId(),
  };

  contacts = contacts.concat(contact);

  response.json(contact);
});

app.put("/api/contacts/:id", (request, response) => {
  const id = +request.params.id;
  const body = request.body;
  const contact = contacts.find((contact) => contact.id === id);

  if (!body.firstName || !body.lastName || !body.email || !body.mobile) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  contact.firstName = body.firstName;
  contact.lastName = body.lastName;
  contact.email = body.email;

  response.json(contact);
});

app.delete("/api/contacts/:id", (request, response) => {
  const id = +request.params.id;
  contacts = contacts.filter((contact) => contact.id !== id);

  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
