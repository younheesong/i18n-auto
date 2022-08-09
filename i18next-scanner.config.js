const path = require("path");
var fs = require("fs");
var chalk = require("chalk");
const COMMON_EXTENSIONS = "/**/*.{js,jsx,ts,tsx,vue,html}";
const DEFAULT_NS = "common";
module.exports = {
  input: [
    `./pages${COMMON_EXTENSIONS}`,
    `./components${COMMON_EXTENSIONS}`,
    `./stories${COMMON_EXTENSIONS}`,
  ],
  options: {
    defaultLng: "en",
    lngs: ["ko", "en", "ja", "zh"],
    ns: ["common", "ecommerce", "example"],
    defaultNs: "common",
    func: {
      list: ["i18next.t", "i18n.t", "$i18n.t", "t"],
      extensions: [".js", ".jsx", ".ts", ".tsx", ".vue", ".html"],
    },
    resource: {
      loadPath: path.join(__dirname, "public/locales/{{lng}}/{{ns}}.json"),
      savePath: path.join(__dirname, "public/locales/{{lng}}/{{ns}}.json"),
    },
    defaultValue(lng, ns, key) {
      const keyAsDefaultValue = ["ko-KR"];
      if (keyAsDefaultValue.includes(lng)) {
        const separator = "~~";
        const value = key.includes(separator) ? key.split(separator)[1] : key;

        return value;
      }

      return "";
    },
    keySeparator: false,
    nsSeparator: false,
    prefix: "%{",
    suffix: "}",
  },
  transform: function customTransform(file, enc, done) {
    ("use strict");
    const parser = this.parser;
    const content = fs.readFileSync(file.path, enc);
    let ns;
    const match = content.match(/useTranslation\(.+\)/);
    if (match) ns = match[0].split(/(\'|\")/)[2];
    let count = 0;
    parser.parseFuncFromString(
      content,
      { list: ["t"] },
      function (key, options) {
        parser.set(
          key,
          Object.assign({}, options, {
            ns: ns ? ns : DEFAULT_NS,
            nsSeparator: ":",
            keySeparator: ".",
          })
        );
        ++count;
      }
    );
    if (count > 0) {
      console.log(
        `i18next-scanner: count=${chalk.cyan(count)}, file=${chalk.yellow(
          JSON.stringify(file.relative)
        )}`
      );
    }

    done();
  },
};
