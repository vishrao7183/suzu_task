export default fromNodeMiddleware(async (req, res, next): Promise<void> => {
  next();
});
