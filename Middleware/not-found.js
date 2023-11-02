const notFound = (req, res) => {
  res.status(404).send("PAGE NOT FOUND");
};
module.exports = { notFound };
