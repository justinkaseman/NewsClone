const info = () => `This is the API of a HackerNews clone`;
const feed = async (root, args, context, info) => {
  const where = args.filter
    ? {
        OR: [
          { url_contains: args.filter },
          { description_contains: args.filter },
        ],
      }
    : {};

  const queriedLinks = await context.db.query.links(
    { where, skip: args.skip, first: args.first, orderBy: args.orderBy },
    `{ id }`
  );

  const countSelectionSet = `
  {
    aggregate {
        count
    }
  }
  `;

  const linksConnection = await context.db.query.linksConnection(
    {},
    countSelectionSet
  );

  return {
    count: linksConnection.aggregate.count,
    linkId: queriedLinks.map(link => link.id),
  };
};

module.exports = {
  info,
  feed,
};
