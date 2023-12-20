const pageAndLimit = (page?: number, limit?: number) => {
  const obj = {} as { offset: number; limit: number };

  if (limit) {
    obj.limit = limit || 0;
  }

  if (page) {
    obj.offset = (+page - 1) * Number(limit || 0);
  }

  return obj;
};


export default pageAndLimit;