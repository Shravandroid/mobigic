const validate = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.issues[0].message,
    });
  }
};

module.exports = validate;
