// eslint-disable-next-line eqeqeq
const validateNumber = (n) => !isNaN(parseFloat(n)) && isFinite(n) && Number(n) == n;

export default { validateNumber };
export { validateNumber };
