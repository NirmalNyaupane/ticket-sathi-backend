interface QueryType {
  where?: { [key in string]: any };
  limit?: number;
  offset?: number;
}

export { QueryType };
