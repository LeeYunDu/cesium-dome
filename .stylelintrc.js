module.exports = {
  extends: "stylelint-config-standard",
  rules: {
    "color-no-invalid-hex": true,
    "rule-empty-line-before": null,
    "color-hex-length": "long",
    "color-hex-case": "lower",
    "unit-whitelist": ["em", "rem", "%", "s", "px","vh","deg"],
    "declaration-colon-newline-after": null
  }
}