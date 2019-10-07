const tryCatchHelper = (logger) => async (callback, afterCallback) => {
  let result;
  try {
    result = await callback();
    if (typeof afterCallback === 'function') {
      afterCallback(result);
    }
  } catch (error) {
    logger.error(error);
    result = error;
  }
  return result;
};

export {
  tryCatchHelper,
};
