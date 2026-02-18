if (process.env.NODE_ENV === "production") {
  console.log = () => { };
  console.warn = () => { };
  console.info = () => { };
  console.debug = () => { };
  // keep console.error if you want error visibility
}
