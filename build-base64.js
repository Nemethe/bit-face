const fs = require("fs");

const config = {
  imagesDirPath: "./src",
  base64JsonPath: "./base64.json",
};

const getExtension = (filename) => filename.split(".").pop();

const base64_encode = (path) =>
  new Buffer.from(fs.readFileSync(path)).toString("base64");

const doDir = (directoryPath) => {
  let obj = {};

  try {
    fs.readdirSync(directoryPath, { withFileTypes: true }).forEach((dirent) => {
      const subPath = `${directoryPath}/${dirent.name}`;

      if (dirent.isDirectory()) {
        obj[dirent.name] = doDir(subPath);
      } else if (getExtension(dirent.name) == "png") {
        obj[dirent.name.split(".")[0]] = base64_encode(subPath);
      }
    });
  } catch (err) {
    console.error(err);
  }

  return obj;
};

try {
  console.log(`Build base64.json...`);

  fs.writeFileSync(
    config.base64JsonPath,
    JSON.stringify(doDir(config.imagesDirPath))
  );

  console.log("\x1b[32m%s\x1b[0m", `Done.`);
} catch (err) {
  console.error(err);
}
