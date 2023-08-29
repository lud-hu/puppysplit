const express = require("express");
const handlebars = require("express-handlebars");
const app = express();

import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import HELPERS from "./helpers";

initializeApp(); // functions.config().firebase ?
const db = getFirestore();

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.engine("handlebars", handlebars.engine({ helpers: HELPERS }));
app.set("view engine", "handlebars");

/**
 * Render index page with data from mock.ts
 */
app.get("/", (req: any, res: any) => res.render("index"));

/**
 * Create new puppy, "navigate" to it and render it.
 */
app.post("/puppy/create", async (req: any, res: any) => {
  const data = { title: req.body.title };
  // Create new puppy in Firestore
  try {
    const puppy = await db.collection("puppies").add(data);

    res.set("HX-Push-Url", "/puppy/" + puppy.id);
    res.render("puppy", (await puppy.get()).data());
  } catch {
    res.sendStatus(500);
  }
});

/**
 * Get puppy with given id
 */
app.get("/puppy/:puppyId", async (req: any, res: any) => {
  console.log("req.params", req.params);
  // Get puppy from Firestore
  const doc = await db.collection("puppies").doc(req.params.puppyId).get();
  const data = doc.data();

  if (data) {
    res.render("puppy", data);
  } else {
    res.sendStatus(404);
  }
});

/**
 * Example for getting a partial html and send it to browser
 */
app.get("/partials", async (req: any, res: any) => {
  // Get puppy from Firestore
  const doc = await db.collection("puppies").doc("N4KWzyTRSvFPGBwYyAK5").get();
  const data = doc.data();

  // Render partial
  if (data) {
    res.render("partials/test/card", {
      title: data.title,
    });
  }
});

exports.app = functions.region("europe-west3").https.onRequest(app);
