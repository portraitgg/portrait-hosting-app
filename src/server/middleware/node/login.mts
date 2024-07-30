const verifyBody = async (req, res, next) => {
  try {
    const { portraitId, identifier } = req.body;

    if (!portraitId || !identifier) {
      return res.status(400).json({ error: 'Bad Request: portraitId or identifier missing' });
    }

    return next();
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export default [verifyBody];
