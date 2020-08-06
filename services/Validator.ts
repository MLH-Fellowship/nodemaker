import Joi from "@hapi/joi";

// https://hapi.dev/module/joi/api/?v=17.1.1#errors

export default class Validator {
  run() {
    const schema = Joi.object({
      a: Joi.string().required(),
      b: Joi.number().required(),
    });

    const data = { a: true, b: "abc" };

    const { error } = schema.validate(data, { abortEarly: false });
    if (!error) return;
    console.log(error.details);
  }
}
