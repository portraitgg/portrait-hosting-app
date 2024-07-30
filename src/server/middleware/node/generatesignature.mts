const verifyBody = async (req, res, next) => {
  try {
    const { portraitId } = req.body;

    if (!portraitId) {
      return res.status(400).json({ error: 'Bad Request' });
    }

    return next();
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export default [verifyBody];
