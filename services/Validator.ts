import { assertType } from "typescript-is";

export default class Validator {
  validateMetaParameters() {
    try {
      assertType<MetaParameters>(dummyMetaParameters);
      console.log("validation ok");
    } catch (error) {
      delete error.stack;
      delete error.message;
      console.log(error.message);
    }
  }

  validateRegularNodeParameters() {
    try {
      assertType<RegularNodeParameters>(dummyRegularNodeParameters);
      console.log("validation ok");
    } catch (error) {
      delete error.stack;
      delete error.message;
      delete error.input;
      console.log(error);
    }
  }
}

const dummyMetaParameters = {
  serviceName: "Hacker News",
  authType: "OAuth2",
  nodeColo1r: "#ff6600",
  apiUrl: "http://hn.algolia.com/api/v1/",
};

export const dummyRegularNodeParameters = {
  Article: [
    {
      description: "Get a Hacker News article",
      endpoint: "items/$$articleId$$",
      requestMethod: "GET",
      fields: [
        {
          name: "Article ID",
          description: "The ID of the Hacker News article to be returned",
          type: "string",
          default: "",
        },
        {
          name: "Additional Fields",
          type: "collection",
          default: {},
          options: [
            {
              name: "Include comments",
              type: "boolean",
              default: false,
              description: "Whether to include all the comments in the article",
            },
          ],
        },
      ],
    },
    {
      name: "Get All",
      description: "Get all Hacker News articles",
      endpoint: "search?",
      requestMethod: "GET",
      fields: [
        {
          name: "Return All",
          description: "Whether to return all results or only up to a limit",
          type: "boolean",
          default: false,
        },
        {
          name: "Limit",
          description:
            "Limit of Hacker News articles to be returned for the query",
          type: "number",
          default: 5,
          extraDisplayRestriction: { "Return All": true },
        },
        {
          name: "Additional Fields",
          type: "collection",
          default: {},
          options: [
            {
              name: "Keyword",
              description: "The keyword for filtering the results of the query",
              type: "string",
              default: "",
            },
            {
              name: "Tags",
              description: "Tags for filtering the results of the query",
              type: "multiOptions",
              default: {},
              options: [
                {
                  name: "Story",
                  description: "Returns query results filtered by story tag",
                },
                {
                  name: "Comment",
                  description: "Returns query results filtered by comment tag",
                },
                {
                  name: "Poll",
                  description: "Returns query results filtered by poll tag",
                },
                {
                  name: "Show HN",
                  description: "Returns query results filtered by Show HN tag",
                },
                {
                  name: "Ask HN",
                  description: "Returns query results filtered by Ask HN tag",
                },
                {
                  name: "Front Page",
                  description:
                    "Returns query results filtered by Front Page tag",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  User: [
    {
      name: "Get",
      description: "Get a Hacker News user",
      endpoint: "users/$$username$$",
      requestMethod: "GET",
      fields: [
        {
          name: "Username",
          description: "The Hacker News user to be returned",
          type: "string",
          default: "",
        },
      ],
    },
    {
      name: "Rename",
      description: "Rename a Hacker News user",
      endpoint: "users/$$username$$",
      requestMethod: "PUT",
      fields: [
        {
          name: "Username",
          description: "The Hacker News user to be renamed",
          type: "string",
          default: "",
        },
      ],
    },
  ],
};
