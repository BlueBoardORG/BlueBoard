import { Router } from "express";
import passport from "passport";

const router = Router();

/*router.post("/local", passport.authenticate("local", { failureRedirect: '/login' }), (req, res) => {
  res.redirect("/");
});*/

router.get("/shraga", passport.authenticate("shraga"), (req, res) => {
  res.redirect("/");
});

router.post("/shraga", passport.authenticate("shraga"), (req, res) => {
  res.redirect("/");
});

/*router.post(
  "/shraga/callback",
  passport.authenticate("shraga", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);


router.get("/signout", (req, res) => {
  req.logout();
  res.redirect("/");
});*/

export default router;
